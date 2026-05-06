package nro.models.npc_list;

import nro.models.consts.ConstNpc;
import nro.models.item.Item;
import nro.models.npc.Npc;
import nro.models.player.Player;
import nro.models.services.InventoryService;
import nro.models.services.ItemService;
import nro.models.services.Service;

/**
 *
 * @author By Mr Blue
 * 
 */

public class GokuSSJ2 extends Npc {

    public GokuSSJ2(int mapId, int status, int cx, int cy, int tempId, int avartar) {
        super(mapId, status, cx, cy, tempId, avartar);
    }

    // 80% → 30–55, 19% → 55–79, 1% → 80
    private static int randStat() {
        int rd = nro.models.utils.Util.nextInt(1, 100);
        if (rd <= 80) return nro.models.utils.Util.nextInt(30, 55);
        if (rd <= 99) return nro.models.utils.Util.nextInt(55, 79);
        return 80;
    }

    @Override
    public void openBaseMenu(Player player) {
        if (canOpenNpc(player)) {
            this.createOtherMenu(player, ConstNpc.BASE_MENU, "Hãy cố gắng luyện tập\nThu thập 9.999 bí kiếp để đổi trang phục Yardrat nhé!",
                    "Nhận\nthưởng", "OK");
        }
    }

    @Override
    public void confirmMenu(Player player, int select) {
        if (canOpenNpc(player)) {
            if (select == 0) {
                if (InventoryService.gI().getCountEmptyBag(player) < 1) {
                    Service.gI().sendThongBao(player, "Cần ít nhất 1 ô hành trang trống");
                    return;
                }
                int soluong = InventoryService.gI().getParam(player, 31, 590);
                if (soluong >= 9999) {
                    InventoryService.gI().subParamItemsBag(player, 590, 31, 9999);
                    Item yardart = ItemService.gI().createNewItem((short) (player.gender + 592));
                    yardart.itemOptions.add(new Item.ItemOption(47, 400));  // Giáp
                    yardart.itemOptions.add(new Item.ItemOption(97, 10));   // Kháng chưởng khí
                    yardart.itemOptions.add(new Item.ItemOption(14, 10));   // Chí mạng
                    yardart.itemOptions.add(new Item.ItemOption(5, randStat()));
                    yardart.itemOptions.add(new Item.ItemOption(50, randStat()));
                    yardart.itemOptions.add(new Item.ItemOption(77, randStat()));
                    yardart.itemOptions.add(new Item.ItemOption(103, randStat()));
                    yardart.itemOptions.add(new Item.ItemOption(192, 30));
                    boolean vinh_vien = nro.models.utils.Util.nextInt(1000) == 0; // 0.1% vĩnh viễn
                    if (vinh_vien) {
                        Service.gI().sendThongBao(player, "Chúc mừng! Bạn nhận được võ phục Yardrat VĨNH VIỄN!");
                    } else {
                        int days = nro.models.utils.Util.nextInt(2, 10);
                        yardart.itemOptions.add(new Item.ItemOption(93, days)); // Hạn sử dụng # ngày
                        Service.gI().sendThongBao(player, "Bạn nhận được võ phục của người Yardrat (" + days + " ngày)");
                    }
                    InventoryService.gI().addItemBag(player, yardart);
                    InventoryService.gI().sendItemBags(player);
                } else {
                    Service.gI().sendThongBao(player, "Bạn cần 9.999 Bí Kiếp để đổi trang phục");
                }
            }
        }
    }
}
