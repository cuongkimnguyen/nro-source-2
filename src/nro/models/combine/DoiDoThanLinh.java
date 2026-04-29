package nro.models.combine;

import nro.models.consts.ConstNpc;
import nro.models.item.Item;
import nro.models.player.Player;
import nro.models.services.InventoryService;
import nro.models.services.ItemService;
import nro.models.services.Service;
import nro.models.utils.Util;

/**
 * Đổi 5 đồ thần linh bất kỳ lấy 1 đồ kích hoạt ngẫu nhiên (không giới hạn gender).
 */
public class DoiDoThanLinh {

    private static final int REQUIRED_COUNT = 5;

    // Item IDs hợp lệ: đồ thần linh (555-567)
    private static boolean isThanLinh(Item item) {
        if (item == null || !item.isNotNullItem()) return false;
        int id = item.template.id;
        return id >= 555 && id <= 567;
    }

    // Pool item kích hoạt theo gender và type (0=áo, 1=quần, 2=găng, 3=giày, 4=nhẫn/rada)
    private static final int[][][] ALL_ITEM_IDS = {
        { // Gender 0 - Trái đất
            {0, 3, 33, 34, 136, 137, 138, 139, 230, 231, 232, 233},
            {6, 9, 35, 36, 140, 141, 142, 143, 242, 243, 244, 245},
            {21, 24, 37, 38, 144, 145, 146, 147, 254, 256, 257},
            {27, 30, 39, 40, 148, 149, 150, 151, 266, 267, 268, 269},
            {12, 57, 58, 59, 184, 185, 186, 187, 278, 279, 280, 281}
        },
        { // Gender 1 - Namek
            {1, 4, 41, 42, 152, 153, 154, 155, 235, 236, 237},
            {7, 10, 43, 44, 156, 157, 158, 159, 246, 247, 248, 249},
            {22, 25, 45, 46, 160, 161, 162, 163, 259, 260, 261},
            {28, 31, 47, 48, 164, 165, 166, 167, 270, 271, 272, 273},
            {12, 57, 58, 59, 184, 185, 186, 187, 278, 279, 280, 281}
        },
        { // Gender 2 - Xayda
            {2, 5, 49, 50, 168, 169, 170, 171, 238, 239, 240, 241},
            {8, 11, 51, 52, 172, 173, 174, 174, 250, 251, 252, 253},
            {23, 26, 53, 54, 176, 177, 178, 179, 262, 263, 264, 265},
            {29, 32, 55, 56, 180, 181, 182, 183, 274, 275, 276, 277},
            {12, 57, 58, 59, 184, 185, 186, 187, 278, 279, 280, 281}
        }
    };

    // SKH options theo gender (index 0=Trái Đất, 1=Namek, 2=Xayda)
    private static final int[][] SKH_OPTIONS_BY_GENDER = {
        {127, 128, 129, 233, 245}, // Trái Đất
        {130, 131, 132, 233, 237}, // Namek
        {133, 134, 135, 233, 241}  // Xayda
    };

    // Trọng số SKH: option 129 (idx 2 gender 0), 130 (idx 0 gender 1), 135 (idx 2 gender 2) hiếm hơn
    // Tổng mỗi hàng = 1000
    private static final int[][] SKH_WEIGHTS = {
        {230, 230, 110, 215, 215}, // Gender 0: idx 2 (129) hiếm
        {110, 230, 230, 215, 215}, // Gender 1: idx 0 (130) hiếm
        {230, 230, 110, 215, 215}  // Gender 2: idx 2 (135) hiếm
    };

    public static void showInfoCombine(Player player) {
        if (player.combineNew.itemsCombine.size() != REQUIRED_COUNT) {
            CombineService.gI().baHatMit.createOtherMenu(player, ConstNpc.IGNORE_MENU,
                    "Cần chọn đúng " + REQUIRED_COUNT + " đồ thần linh!", "Đóng");
            return;
        }

        for (Item item : player.combineNew.itemsCombine) {
            if (!isThanLinh(item)) {
                CombineService.gI().baHatMit.createOtherMenu(player, ConstNpc.IGNORE_MENU,
                        "Chỉ chấp nhận đồ thần linh\n(ID 555–567)!", "Đóng");
                return;
            }
        }

        CombineService.gI().baHatMit.createOtherMenu(player, ConstNpc.MENU_START_COMBINE,
                "Đổi 5 đồ thần linh\nlấy 1 đồ kích hoạt ngẫu nhiên?",
                "Đổi", "Hủy");
    }

    public static void doiDoThanLinh(Player player) {
        if (player.combineNew.itemsCombine.size() != REQUIRED_COUNT) {
            Service.gI().sendThongBao(player, "Cần đặt đúng " + REQUIRED_COUNT + " đồ thần linh!");
            return;
        }

        for (Item item : player.combineNew.itemsCombine) {
            if (!isThanLinh(item)) {
                Service.gI().sendThongBao(player, "Vật phẩm không hợp lệ, chỉ nhận đồ thần linh!");
                return;
            }
        }

        if (InventoryService.gI().getCountEmptyBag(player) <= 0) {
            Service.gI().sendThongBao(player, "Hành trang không còn chỗ trống!");
            return;
        }

        // Tạo item kích hoạt ngẫu nhiên trước (tránh mất đồ nếu lỗi)
        // Gender: hành tinh của player có tỷ lệ thấp hơn (200/1000), 2 hành tinh còn lại cao hơn (400/1000)
        int pg = Math.max(0, Math.min(2, player.gender));
        int[] genderWeights = new int[3];
        genderWeights[pg] = 200;
        genderWeights[(pg + 1) % 3] = 400;
        genderWeights[(pg + 2) % 3] = 400;
        int gender = Util.nextInt(genderWeights);

        int type = Util.nextInt(ALL_ITEM_IDS[gender].length);
        int[] pool = ALL_ITEM_IDS[gender][type];
        int itemId = pool[Util.nextInt(pool.length)];

        // SKH: option 129/130/135 có tỷ lệ thấp hơn các option còn lại
        int skhIdx = Util.nextInt(SKH_WEIGHTS[gender]);
        int skhId = SKH_OPTIONS_BY_GENDER[gender][skhIdx];

        Item reward = ItemService.gI().createItemSKH(itemId, skhId);
        if (reward == null) {
            Service.gI().sendThongBao(player, "Có lỗi xảy ra, vui lòng thử lại!");
            return;
        }

        // Xóa 5 đồ thần linh đã chọn
        for (Item item : player.combineNew.itemsCombine) {
            InventoryService.gI().subQuantityItemsBag(player, item, 1);
        }

        // Trao phần thưởng
        InventoryService.gI().addItemBag(player, reward);
        InventoryService.gI().sendItemBags(player);
        CombineService.gI().sendEffectSuccessCombine(player);
        Service.gI().sendThongBao(player, "Đổi thành công! Bạn nhận được " + reward.template.name);
        CombineService.gI().reOpenItemCombine(player);
    }
}
