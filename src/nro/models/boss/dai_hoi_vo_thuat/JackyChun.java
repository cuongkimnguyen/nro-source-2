package nro.models.boss.dai_hoi_vo_thuat;


import nro.models.boss.BossID;
import nro.models.boss.BossesData;
import static nro.models.consts.BossType.PHOBAN;
import nro.models.player.Player;

public class JackyChun extends The23rdMartialArtCongress {

    public JackyChun(Player player) throws Exception {
        super(PHOBAN, BossID.JACKY_CHUN, BossesData.JACKY_CHUN);
        this.playerAtt = player;
        this.nPoint.tlNeDon = 200; // 20% né đòn (200/1000)
        this.nPoint.tlPST = 40;   // 40% phản sát thương
    }
}
