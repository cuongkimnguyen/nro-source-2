package nro.models.shop_ky_gui;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;
import nro.models.data.LocalManager;
import org.json.simple.JSONValue;

/**
 *
 * @author By Mr Blue
 * 
 */

public class ConsignShopManager {

    private static ConsignShopManager instance;

    public static ConsignShopManager gI() {
        if (instance == null) {
            instance = new ConsignShopManager();
        }
        return instance;
    }

    public long lastTimeUpdate;

    public String[] tabName = {"Áo Quần", "Găng Tay", "Phụ Kiện", "Linh tinh", ""};

    public List<ConsignItem> listItem = new ArrayList<>();

    public void save() {
        try (Connection con = LocalManager.getConnection();
             PreparedStatement ps = con.prepareStatement(
                 "INSERT INTO `shop_ky_gui`(`id`, `player_id`, `tab`, `item_id`, `gold`, `gem`, `quantity`, `itemOption`, `isUpTop`, `isBuy`) VALUES (?,?,?,?,?,?,?,?,?,?)")) {
            LocalManager.executeUpdate("TRUNCATE shop_ky_gui");
            for (ConsignItem it : this.listItem) {
                if (it != null) {
                    String itemOption = JSONValue.toJSONString(it.options);
                    if ("null".equals(itemOption)) itemOption = "[]";
                    ps.setLong(1, it.id);
                    ps.setInt(2, it.player_sell);
                    ps.setInt(3, it.tab);
                    ps.setInt(4, it.itemId);
                    ps.setLong(5, it.goldSell);
                    ps.setLong(6, it.gemSell);
                    ps.setInt(7, it.quantity);
                    ps.setString(8, itemOption);
                    ps.setInt(9, it.isUpTop);
                    ps.setInt(10, it.isBuy ? 1 : 0);
                    ps.addBatch();
                }
            }
            ps.executeBatch();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

