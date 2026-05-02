package nro.models.npc_list;

import nro.models.npc.Npc;
import nro.models.player.Player;
import nro.models.map.service.NpcService;
import nro.models.shop_ky_gui.ConsignShopService;

public class KyGui extends Npc {

    public KyGui(int mapId, int status, int cx, int cy, int tempId, int avartar) {
        super(mapId, status, cx, cy, tempId, avartar);
    }

    @Override
    public void openBaseMenu(Player player) {
    }

    @Override
    public void confirmMenu(Player pl, int select) {
        if (canOpenNpc(pl)) {
            switch (select) {
                case 0 ->
                    NpcService.gI().createTutorial(pl, tempId, avartar,
                            "Cửa hàng chuyên nhận ký gửi mua bán vật phẩm\bChỉ với 5 ngọc\bGiá trị ký gửi 10k-200Tr vàng hoặc 2-2k ngọc\bMột người bán, vạn người mua, mại dô, mại dô");
                case 1 -> {
                    if (pl.getSession().actived) {
                        ConsignShopService.gI().openShopKyGui(pl);
                        return;
                    }
                    this.npcChat(pl, "Bạn chưa kích hoạt thành viên!!!");
                }
            }
        }
    }
}
