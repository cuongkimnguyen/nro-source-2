import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Reusable micro-components
───────────────────────────────────────────── */
function Section({ id, title, children }) {
  return (
    <section id={id} style={s.section}>
      <h2 style={s.h2}>{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }) {
  return (
    <div style={s.subSection}>
      <h3 style={s.h3}>{title}</h3>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="table-wrap" style={{ marginTop: 12, marginBottom: 4 }}>
      <table>
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Rate({ pct, color }) {
  const c = color || (pct >= 80 ? '#51cf66' : pct >= 20 ? '#fcc419' : pct >= 5 ? '#74c0fc' : '#ff6b6b');
  return <span style={{ color: c, fontWeight: 700 }}>{pct}%</span>;
}

function Tag({ children, color }) {
  const map = { green: 'badge-green', red: 'badge-red', yellow: 'badge-yellow', blue: 'badge-blue', gray: 'badge-gray' };
  return <span className={`badge ${map[color] || 'badge-gray'}`}>{children}</span>;
}

function CodeBlock({ children }) {
  return (
    <pre style={s.codeBlock}>{children}</pre>
  );
}

function Note({ children }) {
  return <p style={s.note}>{children}</p>;
}

function TocItem({ href, children }) {
  return (
    <li>
      <a href={href} style={s.tocLink}>{children}</a>
    </li>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function GameGuide() {
  return (
    <div style={s.page}>
      {/* ── Header ── */}
      <header style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>
            <Tag color="red">Hướng dẫn</Tag>
          </div>
          <h1 style={s.heroTitle}>Cơ chế Boss & Tỷ lệ Rơi Đồ</h1>
          <p style={s.heroSub}>
            Tổng hợp đầy đủ từ source code — HP, dame, tỷ lệ drop vật phẩm, Đồ Thần Linh,
            Ngọc Rồng, Kachi Vua và cơ chế đặc biệt của từng boss.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <Link to="/register" style={s.heroBtnOutline}>Tạo tài khoản</Link>
          </div>
        </div>
      </header>

      <div style={s.body}>
        {/* ── TOC ── */}
        <aside style={s.toc}>
          <p style={s.tocTitle}>Mục lục</p>
          <ul style={s.tocList}>
            <TocItem href="#sku">Lưu ý về SKH</TocItem>
            <TocItem href="#than-linh">Đồ Thần Linh</TocItem>
            <TocItem href="#sao-pha-le">Sao Pha Lê</TocItem>
            <TocItem href="#do-thuong">Đồ Thường</TocItem>
            <TocItem href="#bang-drop">Bảng Drop Theo Boss</TocItem>
            <TocItem href="#co-che">Cơ Chế Đặc Biệt</TocItem>
            <TocItem href="#ket-luan">Tổng Kết</TocItem>
          </ul>
        </aside>

        {/* ── Content ── */}
        <article style={s.article}>

          {/* ── SKH ── */}
          <Section id="sku" title="SKH (Sách Kỹ Năng) — Lấy ở đâu?">
            <div className="alert alert-info" style={{ marginTop: 12 }}>
              <strong>SKH không rơi trực tiếp từ boss.</strong> Sách Kỹ Năng được lấy bằng
              cách sử dụng vật phẩm mở hộp đặc biệt trong game. Boss không có dòng code nào
              drop SKH trong phần thưởng tiêu diệt.
            </div>
            <p style={s.p}>
              Hàm <code style={s.code}>OpenSKH()</code> trong <code style={s.code}>ItemService</code>{' '}
              nhận vào loại item và gender nhân vật, sau đó chọn ngẫu nhiên 1 trong 3 tier SKH:
            </p>
            <Table
              headers={['Tier', 'Tỷ lệ chọn', 'Mô tả']}
              rows={[
                ['SKH V1', <Rate pct={25} />, 'Sách Kỹ Năng cấp 1 — chỉ số thấp'],
                ['SKH V2', <Rate pct={35} />, 'Sách Kỹ Năng cấp 2 — chỉ số trung bình'],
                ['SKH C',  <Rate pct={40} />, 'Sách Kỹ Năng chuẩn — chỉ số tốt nhất'],
              ]}
            />
            <Note>
              Mỗi gender (Trái Đất / Xayda / Namek) có bộ SKH riêng với option ID khác nhau.
            </Note>
          </Section>

          {/* ── Thần Linh ── */}
          <Section id="than-linh" title="Đồ Thần Linh (randDoTLBoss)">
            <p style={s.p}>
              Một số boss có xác suất rơi <strong>Đồ Thần Linh</strong> — trang bị cao cấp nhất
              hiện tại. Khi triggered, game chọn ngẫu nhiên <em>một</em> trong các loại sau theo
              xác suất đọc từ code:
            </p>
            <Table
              headers={['Loại', 'Tỷ lệ chọn', 'Item ID', 'Set']}
              rows={[
                ['Nhẫn',    <Rate pct={10} />,              '561',           'TD'],
                ['Găng tay',<><Rate pct={22.5} color="#74c0fc"/></>,         '562, 564, 566', 'TD / NM / XD'],
                ['Quần',    <><Rate pct={33.7} color="#fcc419"/></>,         '556, 558, 560', 'TD / NM / XD'],
                ['Áo',      <><Rate pct={41.2} color="#51cf66"/></>,         '555, 557, 559', 'TD / NM / XD'],
                ['Giày',    'Còn lại',                                       '563, 565, 567', 'TD / NM / XD'],
              ]}
            />
            <Note>
              Tỷ lệ Găng/Quần/Áo/Giày là tính theo logic sequential (if-else chain), không phải
              independent. Nếu đã ra Nhẫn (10%) thì các loại còn lại chia nhau 90%.
            </Note>
            <p style={s.p} style={{ marginTop: 10 }}>
              Chỉ số trang bị: nhân hệ số <code style={s.code}>tiLe = rand(100–115%)</code>.
              Nếu <code style={s.code}>tiLe &gt; 100</code> → thêm option hiếm{' '}
              <Tag color="yellow">207</Tag> với giá trị = tiLe − 100.
            </p>
          </Section>

          {/* ── Sao Pha Lê ── */}
          <Section id="sao-pha-le" title="Sao Pha Lê (Option 107)">
            <p style={s.p}>
              Tất cả đồ thường rơi từ boss (IDs 230–280) đều được gắn thêm số sao pha lê ngẫu nhiên.
              Chỉ số của item cũng được nhân thêm <code style={s.code}>100–115%</code>.
            </p>
            <Table
              headers={['Kết quả sao', 'Xác suất', 'Ghi chú']}
              rows={[
                ['1 – 3 sao', <Rate pct={80} color="#51cf66" />, 'Phổ biến nhất'],
                ['4 – 5 sao', <Rate pct={17} color="#fcc419" />, 'Hiếm'],
                ['6 sao',     <Rate pct={3}  color="#ff6b6b" />, 'Cực hiếm'],
              ]}
            />
          </Section>

          {/* ── Đồ thường ── */}
          <Section id="do-thuong" title="Bảng Đồ Thường Có Thể Rơi">
            <p style={s.p}>
              Khi boss kích hoạt drop đồ thường, chọn nhóm trước rồi chọn item ngẫu nhiên trong nhóm:
            </p>
            <Table
              headers={['Nhóm', 'Tỷ lệ chọn nhóm', 'Số lượng item', 'Item ID']}
              rows={[
                ['Áo / Quần / Giày', <Rate pct={70} />, '27 item', '230-252, 266-276'],
                ['Găng / Rada',      <Rate pct={30} />, '12 item', '254-264, 278-280'],
              ]}
            />
            <Note>Mỗi item trong nhóm có xác suất bằng nhau (random đều).</Note>
          </Section>

          {/* ── Bảng Drop ── */}
          <Section id="bang-drop" title="Tỷ Lệ Drop Theo Từng Boss">

            <SubSection title="Nhóm Boss Thông Thường — Kuku, Mập Đầu Đinh, Rambo, SO1–SO4, Android 13/14/15/19, Dr.Kôrê, Fide">
              <Table
                headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
                rows={[
                  ['Tiền (Zeni)',    '457', <Rate pct={100} />,       '4 – 8 cái'],
                  ['Ngọc Rồng',     '18, 19, 20', <Rate pct={88} />, '1 cái'],
                  ['+5 Event Point','—',  <Rate pct={100} />,        'mỗi kill'],
                  ['Đồ Thần Linh',  '—',  <Tag color="gray">Không có</Tag>, '—'],
                ]}
              />
              <Note>Ngọc rơi ngẫu nhiên 1 trong {'{18, 19, 20}'} — ngọc 6, 7, 8 sao.</Note>
            </SubSection>

            <SubSection title="Cooler (2 giai đoạn)">
              <Table
                headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
                rows={[
                  ['Tiền (Zeni)',    '457',       <Rate pct={100} />,       '4 – 8 cái'],
                  ['Đồ Thần Linh',  '555–567',   <Rate pct={5} color="#74c0fc" />,   '1 cái'],
                  ['Đồ thường',     '230–280',   <Rate pct={5} color="#74c0fc" />,   '1 cái + sao pha lê'],
                  ['Ngọc Rồng',     '15–20',     <Rate pct={88} />,        '1 – 3 cái'],
                  ['+5 Event Point','—',          <Rate pct={100} />,       'mỗi kill'],
                ]}
              />
            </SubSection>

            <SubSection title="Siêu Bọ Hung — Cell Hoàn Thiện (boss mạnh nhất trong sự kiện Cell)">
              <Table
                headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
                rows={[
                  ['Tiền (Zeni)',    '457',     <Rate pct={100} />,                          '4 – 8 cái'],
                  ['Đồ Thần Linh',  '555–567', <Rate pct={5} color="#74c0fc" />,             '1 cái'],
                  ['Đồ thường',     '230–280', <Rate pct={33} color="#fcc419" />,            '1 cái + sao pha lê'],
                  ['Ngọc Rồng',     '15–20',   <Rate pct={88} />,                           '1 – 3 cái'],
                  ['+5 Event Point','—',        <Rate pct={100} />,                          'mỗi kill'],
                ]}
              />
              <Note>
                Cell Hoàn Thiện có tỷ lệ đồ thường cao nhất (33%) trong tất cả boss.
              </Note>
            </SubSection>

            <SubSection title="Baby (boss sự kiện — có trang phục độc quyền)">
              <Table
                headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
                rows={[
                  ['Tiền (Zeni)',          '457',             <Rate pct={100} />,                   '4 – 8 cái'],
                  ['Đồ Thần Linh',         '555–567',         <Rate pct={11} color="#fcc419" />,    '1 cái'],
                  ['Trang phục Baby',      '1785/1786/1788',  <Rate pct={1} color="#ff6b6b" />,     '1 cái (random 3 loại)'],
                  ['Đồ thường',            '230–280',         <Rate pct={5} color="#74c0fc" />,     '1 cái + sao pha lê'],
                  ['Ngọc + Kachi Vua',     '15–20, 992',      <Rate pct={11} color="#fcc419" />,    '1 – 3 cái'],
                  ['Event Point',          '—',               <Tag color="gray">Không có</Tag>,     '—'],
                ]}
              />
              <p style={{ ...s.p, marginTop: 10 }}>
                <strong>Trang phục Baby — Stats cố định khi drop:</strong>
              </p>
              <Table
                headers={['Option', 'Giá trị', 'Mô tả']}
                rows={[
                  ['50',  '30 – 40', 'Công lực'],
                  ['77',  '30 – 40', 'Công lực'],
                  ['103', '30 – 40', 'Công lực'],
                  ['94',  '10 – 20', 'Phòng thủ'],
                  ['5',   '10 – 20', 'Phòng thủ'],
                  ['204', '10 – 20', 'Phòng thủ'],
                  ['30',  '0 (cố định)', '—'],
                  ['93',  '2 – 5',   'Bổ sung'],
                ]}
              />
              <Note>
                Trang phục Baby là item độc quyền duy nhất từ boss có stats ngẫu nhiên riêng,
                không dùng hệ thống sao pha lê.
              </Note>
            </SubSection>

            <SubSection title="Black Goku / Cumber (2 giai đoạn)">
              <Table
                headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
                rows={[
                  ['Tiền (Zeni)',          '457',         <Rate pct={100} />,                   '4 – 8 cái'],
                  ['Đồ Thần Linh',         '555–567',     <Rate pct={5} color="#74c0fc" />,     '1 cái'],
                  ['Đồ thường',            '230–280',     <Rate pct={5} color="#74c0fc" />,     '1 cái + sao pha lê'],
                  ['Ngọc + Kachi Vua',     '15–20, 992',  <Rate pct={11} color="#fcc419" />,    '1 – 3 cái'],
                  ['+5 Event Point',       '—',           <Rate pct={100} />,                   'mỗi kill'],
                ]}
              />
              <Note>
                Item 992 (Kachi Vua) chỉ có trong pool ngọc của Baby, Black Goku và Cumber.
                Xác suất ra Kachi Vua = 11% × 1/7 ≈ <strong>1.57%</strong>.
              </Note>
            </SubSection>

            <SubSection title="Nhóm MajinBuu 12h — Mabu, Goku, Drabura, BuiBui, Yacon, Cadic">
              <Table
                headers={['Boss', 'Đồ TL', 'Đồ thường', 'Ngọc', 'Point đặc biệt']}
                rows={[
                  ['Mabu',        <Rate pct={1} color="#ff6b6b"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event / +25 điểm Mabu'],
                  ['Goku (12h)',   <Rate pct={1} color="#ff6b6b"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event / +10 điểm Mabu'],
                  ['Drabura',     <Rate pct={1} color="#ff6b6b"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event'],
                  ['BuiBui / BuiBui2', <Rate pct={1} color="#ff6b6b"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event'],
                  ['Yacon',       <Rate pct={1} color="#ff6b6b"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event'],
                  ['Cadic',       <Rate pct={1} color="#ff6b6b"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event'],
                ]}
              />
              <Note>
                Tỷ lệ 1% rất thấp — boss MajinBuu 12h tập trung vào điểm Mabu,
                không phải farm đồ.
              </Note>
            </SubSection>

            <SubSection title="NinjaClone (Doanh Trại Băng Đỏ)">
              <Table
                headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
                rows={[
                  ['Ngọc 3 sao', '17', <Rate pct={11} color="#fcc419" />, '1 cái'],
                  ['+5 Event Point', '—', <Rate pct={100} />, 'mỗi kill'],
                ]}
              />
            </SubSection>
          </Section>

          {/* ── Cơ chế ── */}
          <Section id="co-che" title="Cơ Chế Boss Đặc Biệt">

            <SubSection title="Siêu Bọ Hung — Gọi 7 Cell Con">
              <p style={s.p}>
                Boss Cell Hoàn Thiện có <strong>2 giai đoạn</strong>. Khi bị đánh với sát thương
                vượt quá HP hiện tại <em>lần đầu</em>, boss không chết mà kích hoạt cơ chế gọi con:
              </p>
              <CodeBlock>{`Lần đầu HP về 0:
  → Vào trạng thái AFK (bất tử)
  → Hồi HP về đầy (100%)
  → Chat: "Hãy đấu với 7 đứa con của ta"
  → Triệu hồi Xên Con 1–7 vào map
  → Người chơi phải diệt hết 7 con
  → Sau khi 7 con chết → Cell ACTIVE lại

Lần HP về 0 thứ 2:
  → setBom() — nổ bom AoE toàn map
  → Phân phát reward cho người diệt`}</CodeBlock>
              <Note>Né đòn: theo chỉ số tlNeDon. Giảm sát thương: damage ÷ 3 → trừ thêm def.</Note>
            </SubSection>

            <SubSection title="Black Goku / Cumber — 2 Dạng Biến Thân">
              <Table
                headers={['Giai đoạn', 'Level', 'Giảm sát thương', 'Ghi chú']}
                rows={[
                  ['Dạng thường', '0', 'Không giảm', 'damage bình thường → trừ def'],
                  ['Dạng Super',  '1', '−50%',        'damage / 2 → trừ thêm rand(100,000)'],
                ]}
              />
              <CodeBlock>{`Dạng Super (level 1):
  damage thực = (damage_nhận - rand(0, 100000)) / 2
  Khi shield còn: damage = 1 (block hoàn toàn)

Tự rời map:
  Nếu không có player: reset timer 300–900s → leaveMap
  Khi joinMap: đặt timer rời = rand(600s, 900s)
  Tên boss: "{tên} {số random 1–100}" (thay đổi mỗi lần vào map)`}</CodeBlock>
            </SubSection>

            <SubSection title="Mabu — Boss 12h, Giới Hạn Damage & Kiểm Soát Đám Đông">
              <CodeBlock>{`Giới hạn sát thương:
  Mỗi đòn bị đánh: nếu damage >= 50,000,000
  → Cắt về 50,000,000 ± rand(10,000)

Né đòn: 20% cứng (chat "Xí hụt")

Cơ chế tích điểm Mabu:
  Mỗi đòn đánh trúng (player): 20% → +1% điểm Mabu cho người đánh
  Khi kill: +25 điểm Mabu (cộng trực tiếp)

Kiểm soát đám đông (mỗi 30s):
  Mỗi player trên map:
    10% → hóa đá 22 giây
    20% → biến thành kẹo socola 30 giây`}</CodeBlock>
            </SubSection>

            <SubSection title="Goku (12h) — Deadline & Tự Nổ">
              <CodeBlock>{`Khi vào map:
  HP = HP gốc ÷ 4 (boss yếu hơn)
  Sau 248.5 giây: tự cast skill mạnh nhất (slot 2)
  Sau 250.0 giây: rời map cưỡng bức

Giới hạn sát thương nhận vào: max 20,000,000/đòn
Không có % né đòn (tlNeDon = 0)

Sau khi chết:
  → Vào AFK 60 giây
  → Chat: "Đừng vội mừng, ta sẽ hồi sinh..."
  → Sau 60s: hồi HP đầy → CHAT_S → ACTIVE lại

Điểm Mabu khi kill Goku: +10 điểm`}</CodeBlock>
            </SubSection>

            <SubSection title="Tiểu Đội Trưởng (TDT) — Body Change">
              <CodeBlock>{`Mỗi 10 giây:
  50% ngẫu nhiên từng player trên map
  → Bị hoán đổi thân xác (Body Change)
  → Boss chat: "Úm ba la xì bùa"

Giai đoạn level 1 (biến thân):
  → Không di chuyển
  → Không thông báo vào map

Kích hoạt chiến đấu:
  SO1–SO4 phải chết hết → TDT mới ACTIVE`}</CodeBlock>
            </SubSection>

            <SubSection title="Android 13 — Khiên Hội Tụ">
              <CodeBlock>{`Android 13 không thể bị kill nếu Android 15 còn sống.

Logic:
  Nếu damage >= HP[Android13]:
    Kiểm tra Android 15 còn sống?
    → Có: chặn damage (return 0)
    → Không: cho phép die()

Thứ tự tiêu diệt bắt buộc:
  1. Android 15 trước
  2. Sau đó mới diệt được Android 13`}</CodeBlock>
            </SubSection>

            <SubSection title="NinjaClone (Doanh Trại) — Boss Sinh Ngẫu Nhiên">
              <CodeBlock>{`Né đòn: 20% cứng (không phụ thuộc chỉ số)
Giảm sát thương: damage ÷ 2 → trừ def
Khi shield bị phá: damage ÷ 2 tiếp

Spawn: sinh ngẫu nhiên tại vị trí boss cha ±200px
Map: 54 (Doanh Trại Băng Đỏ)
Respawn: 60 giây
Khi chết: tự xóa khỏi RedRibbonHQManager`}</CodeBlock>
            </SubSection>
          </Section>

          {/* ── Tổng kết ── */}
          <Section id="ket-luan" title="Tổng Kết — Nên Farm Boss Nào?">
            <Table
              headers={['Mục tiêu', 'Boss nên farm', 'Lý do']}
              rows={[
                ['Đồ Thần Linh tốt nhất', 'Baby', '11% — cao nhất toàn server'],
                ['Đồ thường nhiều sao',   'Siêu Bọ Hung', '33% đồ + cơ hội 6 sao (3%)'],
                ['Ngọc Rồng nhiều',        'Siêu Bọ Hung / Cooler', '88%, 1–3 cái/lần'],
                ['Kachi Vua (ID 992)',      'Baby / Black Goku / Cumber', 'Pool ngọc duy nhất có 992'],
                ['Trang phục độc quyền',   'Baby', '1% — outfit duy nhất từ boss'],
                ['Điểm Mabu',              'Mabu + Goku (12h)', 'Quest chuỗi MajinBuu 12h'],
                ['Event Point nhanh',      'Mọi boss có reward()', '+5pt/kill'],
              ]}
            />

            <div style={s.callout}>
              <strong>Công thức xác suất Kachi Vua từ Black Goku / Cumber:</strong>
              <br />
              <code style={{ ...s.code, fontSize: 13 }}>
                P(Kachi Vua) = 11% × (1/7) ≈ <strong>1.57%</strong> mỗi lần kill
              </code>
            </div>
          </Section>

          {/* ── Footer CTA ── */}
          <div style={s.cta}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
              Chưa có tài khoản? Đăng ký ngay để bắt đầu săn boss!
            </p>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 14 }}>
              Tạo tài khoản ngay
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const s = {
  page: {
    background: 'var(--bg)',
    minHeight: '100vh',
    color: 'var(--text)',
  },
  hero: {
    background: 'linear-gradient(135deg, #1a1d27 0%, #0f1117 60%, #1a0f0f 100%)',
    borderBottom: '1px solid var(--border)',
    padding: '60px 24px 48px',
  },
  heroInner: {
    maxWidth: 860,
    margin: '0 auto',
  },
  heroTag: {
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 'clamp(24px, 4vw, 36px)',
    fontWeight: 800,
    lineHeight: 1.2,
    color: '#fff',
    marginBottom: 12,
  },
  heroSub: {
    color: 'var(--text-muted)',
    fontSize: 15,
    maxWidth: 600,
    lineHeight: 1.6,
  },
  heroBtnOutline: {
    display: 'inline-block',
    padding: '9px 20px',
    border: '1px solid var(--accent)',
    borderRadius: 8,
    color: 'var(--accent)',
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
  },
  body: {
    maxWidth: 1060,
    margin: '0 auto',
    padding: '32px 24px',
    display: 'flex',
    gap: 32,
    alignItems: 'flex-start',
  },
  toc: {
    width: 180,
    flexShrink: 0,
    position: 'sticky',
    top: 24,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '16px',
  },
  tocTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    marginBottom: 10,
    fontWeight: 700,
  },
  tocList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  tocLink: {
    color: 'var(--text-muted)',
    fontSize: 12,
    textDecoration: 'none',
    display: 'block',
    padding: '4px 0',
    borderBottom: 'none',
    transition: 'color 0.15s',
  },
  article: {
    flex: 1,
    minWidth: 0,
  },
  section: {
    marginBottom: 48,
  },
  subSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  h2: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--accent)',
    paddingBottom: 8,
    borderBottom: '1px solid var(--border)',
    marginBottom: 16,
  },
  h3: {
    fontSize: 15,
    fontWeight: 700,
    color: '#c5cae9',
    marginBottom: 10,
  },
  p: {
    color: 'var(--text-muted)',
    lineHeight: 1.7,
    fontSize: 14,
    marginBottom: 8,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    borderLeft: '2px solid var(--border)',
    paddingLeft: 10,
  },
  code: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '1px 6px',
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#74c0fc',
  },
  codeBlock: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '14px 16px',
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#a9b7d0',
    lineHeight: 1.7,
    overflowX: 'auto',
    marginTop: 10,
    marginBottom: 6,
    whiteSpace: 'pre',
  },
  callout: {
    marginTop: 20,
    background: 'rgba(25,113,194,0.1)',
    border: '1px solid var(--info)',
    borderRadius: 8,
    padding: '14px 16px',
    fontSize: 13,
    lineHeight: 1.6,
  },
  cta: {
    marginTop: 40,
    padding: '28px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    textAlign: 'center',
  },
};
