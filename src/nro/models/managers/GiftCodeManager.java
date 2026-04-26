package nro.models.managers;
import nro.models.data.LocalManager;
import nro.models.data.LocalResultSet;
import nro.models.item.Item;
import nro.models.player_system.GiftCode;
import nro.models.player.Player;
import nro.models.map.service.NpcService;
import nro.models.services.Service;
import nro.models.utils.Logger;
import java.util.ArrayList;
import nro.models.services.InventoryService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

public class GiftCodeManager {

    public String name;
    public final ArrayList<GiftCode> listGiftCode = new ArrayList<>();

    private static GiftCodeManager instance;

    public static GiftCodeManager gI() {
        if (instance == null) {
            instance = new GiftCodeManager();
        }
        return instance;
    }

    public synchronized GiftCode checkUseGiftCode(Player player, String code) {
        String normalizedCode = code == null ? "" : code.trim();
        GiftCode found = findInMemory(normalizedCode);
        if (found == null) {
            // Code chưa có trong memory — thử load từ DB (code mới tạo sau khi server khởi động)
            found = loadGiftCodeFromDB(normalizedCode);
        }
        if (found == null) {
            return null;
        }
        if (found.countLeft <= 0) {
            Service.gI().sendThongBaoOK(player, "Giftcode đã hết");
            return null;
        }
        if (found.isUsedGiftCode(player)) {
            Service.gI().sendThongBaoOK(player, "Tham lam!");
            return null;
        }
        if (InventoryService.gI().getCountEmptyBag(player) < found.detail.size()) {
            Service.gI().sendThongBaoOK(player, "Cần tối thiểu " + found.detail.size() + " ô hành trang trống");
            return null;
        }
        found.countLeft -= 1;
        player.giftCode.add(code);
        updateGiftCode(found);
        return found;
    }

    private GiftCode findInMemory(String normalizedCode) {
        for (GiftCode gc : listGiftCode) {
            if (gc.code.trim().equalsIgnoreCase(normalizedCode)) {
                return gc;
            }
        }
        return null;
    }

    /** Load một code cụ thể từ DB và thêm vào memory nếu tìm thấy. */
    private GiftCode loadGiftCodeFromDB(String code) {
        LocalResultSet rs = null;
        try {
            rs = LocalManager.executeQuery(
                "SELECT * FROM giftcode WHERE LOWER(TRIM(code)) = LOWER(TRIM(?))", code);
            if (rs.next()) {
                GiftCode gc = parseGiftCodeRow(rs);
                if (gc != null) {
                    listGiftCode.add(gc);
                    Logger.log(Logger.GREEN, "[GiftCode] Loaded from DB on demand: " + gc.code + "\n");
                    return gc;
                }
            }
        } catch (Exception e) {
            Logger.log(Logger.RED, "[GiftCode] loadGiftCodeFromDB error: " + e.getMessage() + "\n");
        } finally {
            if (rs != null) rs.close();
        }
        return null;
    }

    /** Reload toàn bộ danh sách giftcode từ DB (dùng cho lệnh admin). */
    public synchronized void reloadGiftCodes() {
        listGiftCode.clear();
        LocalResultSet rs = null;
        try {
            rs = LocalManager.executeQuery("SELECT * FROM giftcode");
            while (rs.next()) {
                GiftCode gc = parseGiftCodeRow(rs);
                if (gc != null) {
                    listGiftCode.add(gc);
                }
            }
            Logger.success(Logger.GREEN + "[GiftCode] Reloaded " + listGiftCode.size() + " giftcodes from DB\n");
        } catch (Exception e) {
            Logger.log(Logger.RED, "[GiftCode] reloadGiftCodes error: " + e.getMessage() + "\n");
        } finally {
            if (rs != null) rs.close();
        }
    }

    private GiftCode parseGiftCodeRow(LocalResultSet rs) {
        try {
            GiftCode gc = new GiftCode();
            gc.code = rs.getString("code");
            gc.id = rs.getInt("id");
            gc.countLeft = rs.getInt("count_left");
            if (gc.countLeft == -1) {
                gc.countLeft = 999999999;
            }
            gc.datecreate = rs.getTimestamp("datecreate");
            gc.dateexpired = rs.getTimestamp("expired");
            JSONArray jar = (JSONArray) JSONValue.parse(rs.getString("detail"));
            if (jar != null) {
                for (int i = 0; i < jar.size(); i++) {
                    JSONObject jsonObj = (JSONObject) jar.get(i);
                    int id = Integer.parseInt(jsonObj.get("id").toString());
                    int quantity = Integer.parseInt(jsonObj.get("quantity").toString());
                    ArrayList<Item.ItemOption> optionList = new ArrayList<>();
                    JSONArray option = (JSONArray) jsonObj.get("options");
                    if (option != null) {
                        for (int u = 0; u < option.size(); u++) {
                            JSONObject jo = (JSONObject) option.get(u);
                            int optionId = Integer.parseInt(jo.get("id").toString());
                            int param = Integer.parseInt(jo.get("param").toString());
                            optionList.add(new Item.ItemOption(optionId, param));
                        }
                    }
                    gc.option.put(id, optionList);
                    gc.detail.put(id, quantity);
                }
            }
            return gc;
        } catch (Exception e) {
            Logger.log(Logger.RED, "[GiftCode] parseGiftCodeRow error: " + e.getMessage() + "\n");
            return null;
        }
    }

    public void updateGiftCode(GiftCode giftcode) {
        try {
            LocalManager.executeUpdate("update giftcode set count_left = ? where id = ?", giftcode.countLeft, giftcode.id);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void checkInfomationGiftCode(Player p) {
        if (listGiftCode.isEmpty()) {
            NpcService.gI().createTutorial(p, 5073, "Không có giftcode nào đang hoạt động.");
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (GiftCode giftCode : listGiftCode) {
            sb.append("Code: ").append(giftCode.code).append(", Số lượng còn lại: ").append(giftCode.countLeft).append("\b")
                    .append("Ngày tạo: ")
                    .append(giftCode.datecreate).append(", Ngày hết hạn: ").append(giftCode.dateexpired)
                    .append("\n");
        }
        if (sb.length() > 0) {
            sb.deleteCharAt(sb.length() - 1);
        }
        NpcService.gI().createTutorial(p, 5073, sb.toString());
    }

}