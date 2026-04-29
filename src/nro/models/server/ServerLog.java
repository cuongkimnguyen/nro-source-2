package nro.models.server;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import nro.models.item.Item;
import nro.models.data.LocalManager;

/**
 *
 * @author By Mr Blue
 *
 */
public class ServerLog {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd_MM_yyyy");
    private static final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");

    public static void logCombine(String name, String itemname, int param) {
        try {
            Calendar calender = Calendar.getInstance();
            Date date = calender.getTime();
            String str = toTimeString(Date.from(Instant.now()));
            String filename = "log/Combine_" + dateFormat.format(date) + ".txt";
            FileWriter fw = new FileWriter(filename, true);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write("Player: " + name + "- Item: " + itemname + " " + param + " Sao - Time : " + str + "\n");
            bw.close();
            fw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void logItemDrop(String name, String item) {
        try {
            Calendar calender = Calendar.getInstance();
            Date date = calender.getTime();
            String str = toTimeString(Date.from(Instant.now()));
            String filename = "log/ItemDrop_" + dateFormat.format(date) + ".txt";
            FileWriter fw = new FileWriter(filename, true);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write("Player: " + name + "-" + item + " - Time : " + str + "\n");
            bw.close();
            fw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String toTimeString(Date date) {
        try {
            String a = timeFormat.format(date);
            return a;
        } catch (Exception e) {
            return "01:01:00";
        }
    }

    public static void logAdmin(String name, int quantity) {
        // kept for backward compatibility — no-op
    }

    /**
     * Ghi log buff item/tiền/chỉ số của admin vào DB (bảng admin_buff_log).
     *
     * @param adminName    Tên admin ra lệnh
     * @param command      Lệnh dùng ("i", "b", "dm", "hp", "ki", "up", ...)
     * @param targetPlayer Tên người chơi được buff
     * @param itemId       ID item; -1=vàng, -2=ngọc, -3=ngọc khóa, -99=chỉ số stat
     * @param itemName     Tên item hoặc mô tả stat
     * @param quantity     Số lượng / giá trị
     * @param options      Danh sách ItemOption (có thể null)
     */
    public static void logAdminBuff(String adminName, String command,
                                    String targetPlayer, int itemId, String itemName,
                                    int quantity, List<Item.ItemOption> options) {
        try {
            String optionsJson = "[]";
            if (options != null && !options.isEmpty()) {
                StringBuilder sb = new StringBuilder("[");
                for (int i = 0; i < options.size(); i++) {
                    Item.ItemOption io = options.get(i);
                    if (i > 0) sb.append(",");
                    sb.append("{\"id\":").append(io.optionTemplate.id)
                      .append(",\"name\":\"").append(io.optionTemplate.name.replace("\"", "'"))
                      .append("\",\"value\":").append(io.param).append("}");
                }
                sb.append("]");
                optionsJson = sb.toString();
            }

            LocalManager.executeUpdate(
                "INSERT INTO admin_buff_log (admin_name, command, target_player, item_id, item_name, quantity, options) VALUES (?,?,?,?,?,?,?)",
                adminName, command, targetPlayer, itemId, itemName, quantity, optionsJson
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
