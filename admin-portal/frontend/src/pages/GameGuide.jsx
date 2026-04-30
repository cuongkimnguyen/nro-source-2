import { useState } from 'react';
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
  return <pre style={s.codeBlock}>{children}</pre>;
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

function Callout({ color, children }) {
  const colors = {
    blue:   { bg: 'rgba(25,113,194,0.1)',  border: 'var(--info)' },
    green:  { bg: 'rgba(81,207,102,0.08)', border: '#51cf66' },
    yellow: { bg: 'rgba(252,196,25,0.08)', border: '#fcc419' },
    red:    { bg: 'rgba(255,107,107,0.08)',border: '#ff6b6b' },
  };
  const c = colors[color] || colors.blue;
  return (
    <div style={{ ...s.callout, background: c.bg, borderColor: c.border }}>
      {children}
    </div>
  );
}

/* Pipeline step block */
function PipelineStep({ num, title, children }) {
  return (
    <div style={s.pipeStep}>
      <div style={s.pipeNum}>{num}</div>
      <div style={{ flex: 1 }}>
        <div style={s.pipeTitle}>{title}</div>
        <div style={s.pipeSub}>{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: BOSS & DROP (nội dung cũ)
───────────────────────────────────────────── */
function TabBossDrop() {
  return (
    <div style={s.body}>
      <aside style={s.toc}>
        <p style={s.tocTitle}>Mục lục</p>
        <ul style={s.tocList}>
          <TocItem href="#diem-su-kien">Điểm Săn Boss</TocItem>
          <TocItem href="#sku">SKH</TocItem>
          <TocItem href="#than-linh">Đồ Thần Linh</TocItem>
          <TocItem href="#sao-pha-le">Sao Pha Lê</TocItem>
          <TocItem href="#do-thuong">Đồ Thường</TocItem>
          <TocItem href="#bang-drop">Bảng Drop</TocItem>
          <TocItem href="#trai-dat">Nhóm Trái Đất</TocItem>
          <TocItem href="#co-che">Cơ Chế Đặc Biệt</TocItem>
          <TocItem href="#ket-luan">Tổng Kết</TocItem>
        </ul>
      </aside>

      <article style={s.article}>

        <Section id="diem-su-kien" title="Điểm Sự Kiện — Hệ Thống Phân Bậc Theo Độ Khó">
          <Callout color="blue">
          Điểm Săn Boss thu được khi tiêu diệt boss được <strong>phân theo 3 bậc độ khó</strong>.
            Boss càng mạnh → thưởng điểm càng cao.
          </Callout>

          <SubSection title="Bảng Phân Bậc Boss">
            <Table
              headers={['Bậc', 'Điểm/kill', 'Boss thuộc nhóm này']}
              rows={[
                [
                  <Tag color="green">Dễ</Tag>,
                  <span style={{ color: '#51cf66', fontWeight: 700 }}>+3</span>,
                  'Kuku, Mập Đầu Đinh, Rambo — Trung úy Xanh Lơ, Trung úy Thép, Trung úy Trắng, Ninja Áo Tím, Clone Ninja, Rôbốt Vệ Sĩ (Doanh Trại) — Ăn Trộm, Rồng Nhi, Sói Hec Quỷn (Mini) — SO1–SO4 Namek, TDT Namek',
                ],
                [
                  <Tag color="yellow">Trung bình</Tag>,
                  <span style={{ color: '#fcc419', fontWeight: 700 }}>+4</span>,
                  'SO1, SO2, SO3, SO4, TDT (Tiểu Đội Sát Thủ) — Fide (3 giai đoạn) — Sơn Tinh, Thủy Tinh (Hùng Vương) — Xên Con 1–7',
                ],
                [
                  <Tag color="red">Khó</Tag>,
                  <span style={{ color: '#ff6b6b', fontWeight: 700 }}>+5</span>,
                  'Xên Bọ Hung, Siêu Bọ Hung (Cell) — Mabu2H, SuperBu (MajinBuu 14h) — Black Goku, Cumber — Cooler, Android 13/14/15/19, Dr.Kôrê, GoldenFrieza và các boss khác',
                ],
              ]}
            />
          </SubSection>

          <SubSection title="Chi Tiết Từng Nhóm">
            <Table
              headers={['Boss', 'HP tham chiếu', 'Điểm sự kiện', 'Ghi chú']}
              rows={[
                ['Kuku',              '500K',   <span style={{ color: '#51cf66', fontWeight: 700 }}>+3</span>, 'Dễ'],
                ['Mập Đầu Đinh',      '1M',     <span style={{ color: '#51cf66', fontWeight: 700 }}>+3</span>, 'Dễ'],
                ['Rambo (Nappa)',      '1.5M',   <span style={{ color: '#51cf66', fontWeight: 700 }}>+3</span>, 'Dễ'],
                ['Doanh Trại (Ninja/Trung Úy/Robot)', '~500K–2M', <span style={{ color: '#51cf66', fontWeight: 700 }}>+3</span>, 'Dễ — Clan event'],
                ['SO4_NM → TDT_NM',   '25M–50M', <span style={{ color: '#51cf66', fontWeight: 700 }}>+3</span>, 'Dễ — Tiểu Đội Namek'],
                ['Ăn Trộm / Rồng Nhi / Sói Hec Quỷn', 'Nhỏ', <span style={{ color: '#51cf66', fontWeight: 700 }}>+3</span>, 'Dễ — Mini boss'],
                ['SO1 → TDT',         '25M–50M', <span style={{ color: '#fcc419', fontWeight: 700 }}>+4</span>, 'Trung bình — Tiểu Đội'],
                ['Fide (cả 3 lv)',     '10M–30M', <span style={{ color: '#fcc419', fontWeight: 700 }}>+4</span>, 'Trung bình — Frieza'],
                ['Sơn Tinh / Thủy Tinh', '—',   <span style={{ color: '#fcc419', fontWeight: 700 }}>+4</span>, 'Trung bình — Hùng Vương'],
                ['Xên Con 1–7',       '~5M–10M', <span style={{ color: '#fcc419', fontWeight: 700 }}>+4</span>, 'Trung bình — tiền đề Cell'],
                ['Xên Bọ Hung',       '50M–150M', <span style={{ color: '#ff6b6b', fontWeight: 700 }}>+5</span>, 'Khó — Cell'],
                ['Siêu Bọ Hung',      'Cao nhất', <span style={{ color: '#ff6b6b', fontWeight: 700 }}>+5</span>, 'Khó — Cell hoàn thiện'],
                ['Mabu2H / SuperBu',  'Rất cao',  <span style={{ color: '#ff6b6b', fontWeight: 700 }}>+5</span>, 'Khó — MajinBuu 14h'],
                ['Black Goku / Cumber', 'Rất cao', <span style={{ color: '#ff6b6b', fontWeight: 700 }}>+5</span>, 'Khó'],
                ['Cooler / Android / GoldenFrieza / …', '—', <span style={{ color: '#ff6b6b', fontWeight: 700 }}>+5</span>, 'Khó'],
              ]}
            />
          </SubSection>

          <Note>
            Điểm Săn Boss được cộng tích lũy vào <code style={s.code}>player.event_point</code> và
            có thể dùng để mua vật phẩm tại cửa hàng sự kiện (tab 59).
          </Note>
        </Section>

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
          <Note>Mỗi gender (Trái Đất / Xayda / Namek) có bộ SKH riêng với option ID khác nhau.</Note>
        </Section>

        <Section id="than-linh" title="Đồ Thần Linh (randDoTLBoss)">
          <p style={s.p}>
            Một số boss có xác suất rơi <strong>Đồ Thần Linh</strong> — trang bị cao cấp nhất
            hiện tại. Khi triggered, game chọn ngẫu nhiên <em>một</em> trong các loại sau:
          </p>
          <Table
            headers={['Loại', 'Tỷ lệ chọn', 'Item ID', 'Set']}
            rows={[
              ['Nhẫn',    <Rate pct={10} />,                        '561',           'TD'],
              ['Găng tay',<Rate pct={22.5} color="#74c0fc"/>,       '562, 564, 566', 'TD / NM / XD'],
              ['Quần',    <Rate pct={33.7} color="#fcc419"/>,       '556, 558, 560', 'TD / NM / XD'],
              ['Áo',      <Rate pct={41.2} color="#51cf66"/>,       '555, 557, 559', 'TD / NM / XD'],
              ['Giày',    'Còn lại',                                '563, 565, 567', 'TD / NM / XD'],
            ]}
          />
          <Note>
            Tỷ lệ Găng/Quần/Áo/Giày là tính theo logic sequential (if-else chain), không phải
            independent. Nếu đã ra Nhẫn (10%) thì các loại còn lại chia nhau 90%.
          </Note>
          <p style={{ ...s.p, marginTop: 10 }}>
            Chỉ số trang bị: nhân hệ số <code style={s.code}>tiLe = rand(100–115%)</code>.
            Nếu <code style={s.code}>tiLe &gt; 100</code> → thêm option hiếm{' '}
            <Tag color="yellow">207</Tag> với giá trị = tiLe − 100.
          </p>
        </Section>

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

        <Section id="bang-drop" title="Tỷ Lệ Drop Theo Từng Boss">
          <SubSection title="Boss Dễ (+3 điểm) — Kuku, Mập Đầu Đinh, Rambo, Doanh Trại, Mini Boss">
            <Table
              headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
              rows={[
                ['Tiền (Zeni)',       '457',       <Rate pct={100} />,      '4 – 8 cái'],
                ['Ngọc Rồng',        '18, 19, 20', <Rate pct={88} />,      '1 cái'],
                [<span><Tag color="green">+3</Tag> Event Point</span>, '—', <Rate pct={100} />, 'mỗi kill'],
                ['Đồ Thần Linh',     '—',          <Tag color="gray">Không có</Tag>, '—'],
              ]}
            />
            <Note>
              Ngọc rơi ngẫu nhiên 1 trong {'{18, 19, 20}'} — ngọc 6, 7, 8 sao.
              Boss Doanh Trại còn rơi thêm item 1824 (100%) và item 17 / 611 theo xác suất.
            </Note>
          </SubSection>

          <SubSection title="Tiểu Đội Sát Thủ Namek (+3 điểm) — SO1_NM, SO2_NM, SO3_NM, SO4_NM, TDT_NM">
            <Callout color="yellow">
              HP đã được nâng cấp x10: SO4_NM 25M → TDT_NM 50M. Drop thêm buff tiêu hao cao cấp.
            </Callout>
            <Table
              headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
              rows={[
                ['Tiền (Zeni)',                '77',          <Rate pct={100} />,                '1 – 5 cái (nhiều lần drop)'],
                ['Trang bị đặc trưng boss',   '429–433',     <Rate pct={100} />,                '1 cái (mỗi boss 1 ID riêng)'],
                ['Ngọc Rồng 6 & 7 sao',       '19, 20',      <Rate pct={100} />,                '1 cái mỗi loại'],
                ['Buff cao cấp (random 1 trong 5)', '1150–1154', <Rate pct={100} />,             '2 – 4 cái'],
                [<span><Tag color="green">+3</Tag> Event Point</span>, '—', <Rate pct={100} />, 'mỗi kill'],
              ]}
            />
            <Table
              headers={['ID', 'Tên', 'Hiệu ứng']}
              rows={[
                ['1150', 'Cuồng nộ 2',         '+120% sức đánh gốc, tối đa 10 phút'],
                ['1151', 'Bổ khí 2',            '+120% KI, tối đa 10 phút'],
                ['1152', 'Bổ huyết 2',          '+120% HP, tối đa 10 phút'],
                ['1153', 'Giáp Xên bọ hung 2',  'Giảm 60% sát thương nhận vào, tối đa 10 phút'],
                ['1154', 'Ẩn danh 2',           'Ẩn danh +10 phút (cộng dồn, tối đa 40 phút)'],
              ]}
            />
            <Note>
              Mỗi boss drop 1 item trang bị riêng: SO4_NM=429, SO3_NM=430, SO2_NM=431, SO1_NM=432, TDT_NM=433.
              Buff 1150–1154 chọn ngẫu nhiên 1 loại, số lượng 2–4 cái.
            </Note>
          </SubSection>

          <SubSection title="Boss Trung Bình (+4 điểm) — SO1–SO4, TDT, Fide, Sơn Tinh, Thủy Tinh, Xên Con 1–7">
            <Table
              headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
              rows={[
                ['Tiền (Zeni)',       '457',       <Rate pct={100} />,                '4 – 8 cái'],
                ['Ngọc Rồng',        '18, 19, 20', <Rate pct={88} />,                '1 cái'],
                [<span><Tag color="yellow">+4</Tag> Event Point</span>, '—', <Rate pct={100} />, 'mỗi kill'],
                ['Đồ Thần Linh',     '—',          <Tag color="gray">Không có</Tag>, '—'],
              ]}
            />
            <Note>
              Fide và Xên Con có cùng cơ chế drop nhưng HP/dame cao hơn đáng kể so với nhóm dễ.
              Sơn Tinh / Thủy Tinh (event Hùng Vương) ngoài +4 điểm còn rơi trang bị đặc biệt
              421/422 với nhiều option khi chết.
            </Note>
          </SubSection>

          <SubSection title="Boss Khó (+5 điểm) — Cooler, Android 13/14/15/19, Dr.Kôrê, GoldenFrieza">
            <Table
              headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
              rows={[
                ['Tiền (Zeni)',    '457',       <Rate pct={100} />,                 '4 – 8 cái'],
                ['Đồ Thần Linh',  '555–567',   <Rate pct={5} color="#74c0fc" />,   '1 cái'],
                ['Đồ thường',     '230–280',   <Rate pct={5} color="#74c0fc" />,   '1 cái + sao pha lê'],
                ['Ngọc Rồng',     '15–20',     <Rate pct={88} />,                  '1 – 3 cái'],
                [<span><Tag color="red">+5</Tag> Event Point</span>, '—', <Rate pct={100} />, 'mỗi kill'],
              ]}
            />
          </SubSection>

          <SubSection title="Siêu Bọ Hung — Cell Hoàn Thiện (+5 điểm)">
            <Table
              headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
              rows={[
                ['Tiền (Zeni)',    '457',     <Rate pct={100} />,                    '4 – 8 cái'],
                ['Đồ Thần Linh',  '555–567', <Rate pct={5} color="#74c0fc" />,      '1 cái'],
                ['Đồ thường',     '230–280', <Rate pct={33} color="#fcc419" />,     '1 cái + sao pha lê'],
                ['Ngọc Rồng',     '15–20',   <Rate pct={88} />,                     '1 – 3 cái'],
                [<span><Tag color="red">+5</Tag> Event Point</span>, '—', <Rate pct={100} />, 'mỗi kill'],
              ]}
            />
            <Note>Cell Hoàn Thiện có tỷ lệ đồ thường cao nhất (33%) trong tất cả boss.</Note>
          </SubSection>

          <SubSection title="Baby (boss sự kiện)">
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
          </SubSection>

          <SubSection title="Black Goku / Cumber (+5 điểm, 2 giai đoạn)">
            <Table
              headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
              rows={[
                ['Tiền (Zeni)',          '457',         <Rate pct={100} />,                   '4 – 8 cái'],
                ['Đồ Thần Linh',         '555–567',     <Rate pct={5} color="#74c0fc" />,     '1 cái'],
                ['Đồ thường',            '230–280',     <Rate pct={5} color="#74c0fc" />,     '1 cái + sao pha lê'],
                ['Ngọc + Kachi Vua',     '15–20, 992',  <Rate pct={11} color="#fcc419" />,    '1 – 3 cái'],
                [<span><Tag color="red">+5</Tag> Event Point</span>, '—', <Rate pct={100} />, 'mỗi kill'],
              ]}
            />
            <Note>
              Item 992 (Kachi Vua) chỉ có trong pool ngọc của Baby, Black Goku và Cumber.
              Xác suất ra Kachi Vua = 11% × 1/7 ≈ <strong>1.57%</strong>.
            </Note>
          </SubSection>

          <SubSection title="Nhóm Trái Đất — BIDO, BUJIN, KOGU, ZANGYA (+5 điểm)">
            <Table
              headers={['Vật phẩm', 'ID', 'Tỷ lệ', 'Số lượng']}
              rows={[
                ['Tiền (Zeni)',                   '77',        <Rate pct={100} />, '5 – 20 cái (nhiều lần drop)'],
                ['Trang bị đặc trưng boss',       '423–426',   <Rate pct={100} />, '1 cái (BUJIN=423, KOGU=424, ZANGYA=425, BIDO=426)'],
                ['Ngọc Rồng 6 & 7 sao',           '19, 20',    <Rate pct={100} />, '1 cái mỗi loại'],
                ['Buff cao cấp (random 1 trong 5)', '1150–1154', <Rate pct={100} />, '2 – 4 cái'],
                [<span><Tag color="red">+5</Tag> Event Point</span>, '—', <Rate pct={100} />, 'mỗi kill'],
              ]}
            />
            <Table
              headers={['ID', 'Tên', 'Hiệu ứng']}
              rows={[
                ['1150', 'Cuồng nộ 2',         '+120% sức đánh gốc, tối đa 10 phút'],
                ['1151', 'Bổ khí 2',            '+120% KI, tối đa 10 phút'],
                ['1152', 'Bổ huyết 2',          '+120% HP, tối đa 10 phút'],
                ['1153', 'Giáp Xên bọ hung 2',  'Giảm 60% sát thương nhận vào, tối đa 10 phút'],
                ['1154', 'Ẩn danh 2',           'Ẩn danh +10 phút (cộng dồn, tối đa 40 phút)'],
              ]}
            />
          </SubSection>

          <SubSection title="Bojack & Siêu Bojack (+5 điểm)">
            <Table
              headers={['Boss', 'Vật phẩm', 'ID', 'Số lượng']}
              rows={[
                ['Bojack',      'Tiền (Zeni)',                      '77',      '5 – 20 cái'],
                ['Bojack',      'Trang bị Bojack',                  '427',     '1 cái'],
                ['Bojack',      'Ngọc Rồng 6 & 7 sao',             '19, 20',  '1 cái mỗi loại'],
                ['Bojack',      'Buff cao cấp random (không có 1154)', '1150–1153', '2 – 4 cái'],
                ['Siêu Bojack', 'Tiền (Zeni)',                      '77',      '5 – 15 cái'],
                ['Siêu Bojack', 'Trang bị Siêu Bojack',             '428',     '1 cái'],
                ['Siêu Bojack', 'Ngọc Rồng 6 & 7 sao',             '19, 20',  '1 cái mỗi loại'],
                ['Siêu Bojack', <span>Buff cao cấp random <Tag color="red">(không có 1154)</Tag></span>, '1150–1153', <strong>5 cái (cố định)</strong>],
              ]}
            />
            <Note>
              Bojack và Siêu Bojack chỉ drop 4 loại buff (1150 Cuồng nộ 2 / 1151 Bổ khí 2 / 1152 Bổ huyết 2 / 1153 Giáp Xên bọ hung 2) — không có 1154 Ẩn danh 2.
              Siêu Bojack drop cố định 5 cái, các boss khác ngẫu nhiên 2–4 cái.
            </Note>
          </SubSection>

          <SubSection title="Nhóm MajinBuu 12h — Mabu, Goku, Drabura, BuiBui, Yacon, Cadic">
            <Table
              headers={['Boss', 'Đồ TL', 'Đồ thường', 'Ngọc', 'Điểm đặc biệt']}
              rows={[
                ['Mabu',        <Rate pct={6} color="#fcc419"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+25 điểm Mabu'],
                ['Goku (12h)',  <Rate pct={6} color="#fcc419"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+10 điểm Mabu'],
                ['Drabura',    <Rate pct={5} color="#74c0fc"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event'],
                ['BuiBui/2',   <Rate pct={5} color="#74c0fc"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event'],
                ['Yacon/Cadic',<Rate pct={5} color="#74c0fc"/>, <Rate pct={1} color="#ff6b6b"/>, '11%, {15–20}', '+5 event'],
              ]}
            />
            <Note>Boss MajinBuu 12h tập trung vào điểm Mabu, không phải farm đồ.</Note>
          </SubSection>
        </Section>

        <Section id="co-che" title="Cơ Chế Boss Đặc Biệt">
          <SubSection title="Siêu Bọ Hung — 2 Giai Đoạn">
            <CodeBlock>{`Giai đoạn 1 (HP > 0 lần đầu):
  → Vào trạng thái AFK (bất tử)
  → Hồi HP về 100%
  → Triệu hồi 7 Xên Con vào map
  → Phải diệt hết 7 con → Cell mới ACTIVE lại

Giai đoạn 2 (HP > 0 lần 2):
  → setBom() — nổ AoE toàn map
  → Phân phát reward`}</CodeBlock>
          </SubSection>

          <SubSection title="Black Goku / Cumber — Giảm Sát Thương">
            <Table
              headers={['Giai đoạn', 'Giảm sát thương', 'Ghi chú']}
              rows={[
                ['Dạng thường', 'Không giảm', 'damage bình thường → trừ def'],
                ['Dạng Super',  '−50%',        'damage / 2 → trừ thêm rand(100,000)'],
              ]}
            />
          </SubSection>

          <SubSection title="Android 13 — Khiên Hội Tụ">
            <CodeBlock>{`Android 13 không thể bị kill nếu Android 15 còn sống.
Thứ tự bắt buộc: diệt Android 15 trước → mới diệt được 13.`}</CodeBlock>
          </SubSection>

          <SubSection title="Ninja Áo Tím — Triệu Hồi Phân Thân">
            <CodeBlock>{`Khi HP ≤ 50%:
  → Xác suất 80% triệu hồi 4–6 Clone Ninja vào map
  → Clone có HP = 10% và dame = 10% boss chính
  → Mỗi Clone rơi 11% cơ hội item 17
  → Cơ chế chỉ kích hoạt 1 lần duy nhất (calledNinja flag)`}</CodeBlock>
          </SubSection>
        </Section>

        <Section id="ket-luan" title="Tổng Kết — Nên Farm Boss Nào?">
          <Table
            headers={['Mục tiêu', 'Boss nên farm', 'Lý do']}
            rows={[
              ['Điểm sự kiện nhanh nhất', 'Black Goku / Cumber / Siêu Bọ Hung', '+5/kill — boss khó nhưng điểm tối đa'],
              ['Điểm sự kiện an toàn',    'SO1–SO4 / TDT / Fide / Xên Con', '+4/kill — trung bình, dễ farm hơn'],
              ['Điểm sự kiện dễ farm',    'Kuku / Mập Đầu Đinh / Rambo', '+3/kill — boss yếu, spawn nhanh'],
              ['Buff Cuồng nộ 2 / Bổ huyết 2 / ...', 'Tiểu Đội Namek / Nhóm Trái Đất / Bojack', '100% drop, 2–4 cái/kill — Siêu Bojack 5 cố định'],
              ['Đồ Thần Linh tốt nhất',   'Baby', '11% — cao nhất toàn server'],
              ['Đồ thường nhiều sao',      'Siêu Bọ Hung', '33% đồ + cơ hội 6 sao (3%)'],
              ['Ngọc Rồng nhiều',          'Siêu Bọ Hung / Cooler', '88%, 1–3 cái/lần'],
              ['Kachi Vua (ID 992)',        'Baby / Black Goku / Cumber', 'Pool ngọc duy nhất có 992'],
              ['Trang phục độc quyền',     'Baby', '1% — outfit duy nhất từ boss'],
              ['Điểm Mabu',                'Mabu + Goku (12h)', 'Quest chuỗi MajinBuu 12h'],
            ]}
          />
        </Section>

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
  );
}

/* ─────────────────────────────────────────────
   TAB: CƠ CHẾ TÍNH SÁT THƯƠNG (tab mới)
───────────────────────────────────────────── */
function TabDamageCalc() {
  return (
    <div style={s.body}>
      {/* TOC */}
      <aside style={s.toc}>
        <p style={s.tocTitle}>Mục lục</p>
        <ul style={s.tocList}>
          <TocItem href="#dame-co-ban">Sức Đánh Cơ Bản</TocItem>
          <TocItem href="#pipeline">Pipeline Gây Dame</TocItem>
          <TocItem href="#kynang">Dame Theo Kỹ Năng</TocItem>
          <TocItem href="#nhan-dame">Nhận Sát Thương</TocItem>
          <TocItem href="#chi-so-phu">Chỉ Số Phụ</TocItem>
          <TocItem href="#set-do">Bonus Set Đồ</TocItem>
          <TocItem href="#vi-du">Ví Dụ Thực Tế</TocItem>
        </ul>
      </aside>

      <article style={s.article}>

        {/* ── Sức đánh cơ bản ── */}
        <Section id="dame-co-ban" title="Sức Đánh Cơ Bản — Dame được tính từ đâu?">
          <p style={s.p}>
            Mỗi nhân vật có một chỉ số <strong>dame cơ bản</strong> được tính lại mỗi khi bạn
            thay đồ, dùng item buff, hoặc đổi map. Công thức tổng quát:
          </p>
          <CodeBlock>{`dame_cơ_bản = dameg + dameAdd
  → dameg:   điểm sức đánh do bạn nâng bằng tiềm năng
  → dameAdd: tổng sức đánh cộng thêm từ option trang bị (+# tấn công)

Sau đó lần lượt nhân thêm từng bonus %:
  + Mỗi option "+#% sức đánh" trên đồ    → dame += dame × tl%
  + Hợp thể Porata                        → cộng thêm dame của đệ
  + Set Tinh Ấn (5 món)                   → +15%
  + Thức ăn HP                            → +10%
  + Cuồng nộ                              → ×2
  + Rồng Xương                            → +10%
  + Phù map đấu trường                    → nhân hệ số map
  + Biến khỉ (kỹ năng Biến Khí)           → +% theo cấp khỉ
  + Set đẹp (tlSexyDame)                  → +% (áp dụng 1 lần)
  − Giảm sức đánh (giáp tập luyện, ...)   → -tlSubSD%
  ÷ 2 nếu đang ở map băng giá và không có kháng lạnh`}</CodeBlock>
          <Note>
            Dame cơ bản bị giới hạn tối đa 2,147,483,647. Nếu vượt quá, tự động cắt về mức này.
          </Note>
        </Section>

        {/* ── Pipeline gây dame ── */}
        <Section id="pipeline" title="Pipeline Gây Sát Thương — 1 đòn đánh đi qua những bước nào?">
          <p style={s.p}>
            Khi bạn nhấn đánh, server tính toán sát thương thực qua 8 bước theo thứ tự sau:
          </p>

          <PipelineStep num="1" title="Lấy dame cơ bản làm điểm xuất phát">
            Bắt đầu từ <code style={s.code}>dame_cơ_bản</code> đã tính ở trên.
          </PipelineStep>

          <PipelineStep num="2" title="Áp dụng % sát thương của kỹ năng (percentDameSkill)">
            Mỗi kỹ năng có 1 con số gọi là <strong>% dame kỹ năng</strong> (lưu trong trường{' '}
            <code style={s.code}>skill.damage</code>). Ví dụ: Kamejoko cấp 7 có thể
            gây 150% sức đánh.<br />
            <strong>Dame sau bước này</strong> = dame_cơ_bản × skill.damage% ÷ 100
          </PipelineStep>

          <PipelineStep num="3" title="Cộng thêm bonus Thiên Phú (Intrinsic)">
            Nếu thiên phú của bạn phù hợp với kỹ năng đang dùng, cộng thêm một lượng %.
            Ví dụ: thiên phú id=1 tương ứng kỹ năng Thần Long, id=2 tương ứng Kamejoko.
          </PipelineStep>

          <PipelineStep num="4" title="Cộng bonus hậu kỹ năng (dameAfter)">
            Một số kỹ năng như Dịch Chuyển Tức Thời, Thôi Miên, Sôcôla, Trói — sau khi dùng
            sẽ để lại <strong>buff dame</strong> cho đòn tiếp theo nếu thiên phú hỗ trợ.
          </PipelineStep>

          <PipelineStep num="5" title="Nhân thêm % khi đánh quái (tlDameAttMob)">
            Nếu mục tiêu là quái vật (mob), áp dụng thêm tổng % sức đánh quái từ các option
            đồ như <Tag color="blue">Tấn công +#% khi đánh quái</Tag>.
            Bùa Đệ Tử cũng nhân đôi dame pet khi đánh quái.
          </PipelineStep>

          <PipelineStep num="6" title="Chí mạng (Crit)">
            Xác suất chí mạng = chỉ số <code style={s.code}>crit</code> của bạn (tính theo %).<br />
            <strong>Nếu chí mạng:</strong> dame × 2, sau đó cộng thêm tlSDCM% (sức đánh chí mạng).<br />
            Một số trường hợp luôn chí mạng 100%: đang trói đối thủ, dùng Dịch Chuyển Tức Thời,
            hoặc biến khỉ (crit = 110%).
          </PipelineStep>

          <PipelineStep num="7" title="Bonus set đồ đặc biệt (percentXDame)">
            Một số bộ đồ đặc biệt nhân thêm dame cho kỹ năng tương ứng:<br />
            Set Songoku (5 món) + Kamejoko → +100% dame<br />
            Set Nail (cấp 5) + Masenko → +80% dame<br />
            Set Kakarot (5 món) + Galick Gun → +100% dame<br />
            Set OcTieu (5 món) + Liên Hoàn → +100% dame
          </PipelineStep>

          <PipelineStep num="8" title="Cộng nhiễu ngẫu nhiên ±5%">
            Đòn đánh thực tế không bao giờ cố định. Server cộng thêm một giá trị ngẫu nhiên
            trong khoảng ±5% của tổng dame. Điều này khiến dame luôn dao động nhẹ mỗi đòn.
          </PipelineStep>

          <Callout color="blue">
            <strong>Công thức tóm tắt:</strong><br />
            <code style={{ ...s.code, display: 'block', marginTop: 8, fontSize: 12, lineHeight: 1.8 }}>
              dame_ra = dame_cơ_bản<br />
              &nbsp;&nbsp;× skill.damage%<br />
              &nbsp;&nbsp;+ thiên_phú%<br />
              &nbsp;&nbsp;+ buff_sau_kỹ_năng%<br />
              &nbsp;&nbsp;+ mob_bonus%<br />
              &nbsp;&nbsp;× 2 (nếu chí mạng) + sdcm%<br />
              &nbsp;&nbsp;+ set_đặc_biệt%<br />
              &nbsp;&nbsp;± 5% ngẫu nhiên
            </code>
          </Callout>
        </Section>

        {/* ── Dame theo kỹ năng ── */}
        <Section id="kynang" title="Cách Tính Dame Đặc Biệt Theo Từng Kỹ Năng">
          <p style={s.p}>
            Phần lớn kỹ năng dùng pipeline trên. Tuy nhiên có 4 kỹ năng tính dame theo cơ chế
            hoàn toàn khác:
          </p>

          <SubSection title="Makankosappo (Tia Laze Xuyên Thấu)">
            <Callout color="yellow">
              Dame = <strong>KI tối đa × % kỹ năng ÷ 100</strong> — hoàn toàn không dùng sức đánh!
            </Callout>
            <p style={s.p}>
              Đây là kỹ năng duy nhất dựa vào <strong>KI tối đa</strong> thay vì sức đánh. Người
              chơi muốn tối ưu Makankosappo nên tập trung nâng KI (mpg) và đồ +% KI thay vì +% dame.
              Set Picolo cấp 5 nhân thêm 1.5× lần nữa.
            </p>
          </SubSection>

          <SubSection title="Quả Cầu Khí (Quả Cầu Kênh Khí)">
            <Callout color="yellow">
              Dame = <strong>(10% tổng HP quái trong phạm vi) + (10% tổng HP địch trong phạm vi) + dame_cơ_bản × 10</strong>
            </Callout>
            <p style={s.p}>
              Quả Cầu Khí mạnh hơn khi xung quanh có nhiều quái hoặc địch HP cao. Phạm vi được
              mở rộng theo cấp kỹ năng. Ngoài ra còn gây dame AoE lên tất cả mob trong phạm vi
              mục tiêu sau khi trúng. Set Kirin cấp 5 nhân đôi toàn bộ dame Quả Cầu.
            </p>
          </SubSection>

          <SubSection title="Dịch Chuyển Tức Thời">
            <p style={s.p}>
              Tự động chí mạng 100%, dame dao động <strong>±5%</strong> quanh dame cơ bản (không
              nhân skill%). Sau khi teleport, gây choáng cho mục tiêu. Đòn tiếp theo sau DCTT
              cũng được hưởng buff chí mạng thêm một lần nữa (<code style={s.code}>isCritTele</code>).
            </p>
          </SubSection>

          <SubSection title="Tự Sát (Bomb)">
            <Callout color="red">
              Dame = <strong>HP hiện tại của người dùng</strong> (không phải sức đánh!)
            </Callout>
            <p style={s.p}>
              Dame bom = máu còn lại của bạn tại thời điểm nổ. HP càng cao → bom càng đau.
              Set Cadic cấp 4 cộng thêm 20% HP tối đa, cấp 5 cộng thêm 50% HP tối đa vào dame bom.
              Phạm vi nổ mở rộng theo cấp kỹ năng, set Cadic cấp 2 cộng thêm 200px phạm vi.
            </p>
            <Note>
              Khi bom trúng boss: dame chỉ bằng ½ (hoặc ⅓ nếu đang biến khỉ) để tránh overpow.
            </Note>
          </SubSection>

          <SubSection title="Tổng Hợp Công Thức Theo Kỹ Năng">
            <Table
              headers={['Kỹ năng', 'Gốc dame', 'Crit?', 'Ghi chú đặc biệt']}
              rows={[
                ['Thần Long / Quỷ Vương / Galick / Kaioken / Liên Hoàn', 'Sức đánh', 'Có', 'Cận chiến, phạm vi 100px'],
                ['Kamejoko / Masenko / Atomic', 'Sức đánh', 'Có', 'Tầm xa 300px, bị vô hiệu bởi Vô Hiệu Chưởng'],
                ['Makankosappo', 'KI tối đa', 'Không', 'Không dùng dame, set Picolo ×1.5'],
                ['Quả Cầu Kênh Khí', 'HP mục tiêu + dame×10', 'Không', 'AoE phạm vi, set Kirin ×2'],
                ['Dịch Chuyển Tức Thời', 'Sức đánh ±5%', 'Luôn crit', 'Gây choáng, buff crit đòn kế'],
                ['Tự Sát', 'HP hiện tại', 'Không', 'Người dùng chết sau khi nổ'],
                ['Trứng Nở / Đệ Trứng', 'Sức đánh', 'Có', 'Set Pikkoroldaimax ×4 dame'],
              ]}
            />
          </SubSection>
        </Section>

        {/* ── Nhận dame ── */}
        <Section id="nhan-dame" title="Nhận Sát Thương — Dame thực nhận được tính thế nào?">
          <p style={s.p}>
            Dame người tấn công tính ra không phải là dame bạn thực nhận. Khi dame bay vào, server
            xử lý qua các lớp bảo vệ theo thứ tự:
          </p>

          <PipelineStep num="1" title="Kiểm tra né đòn (tlNeDon)">
            Nếu may mắn né thành công → dame = 0, bạn không nhận sát thương gì cả.<br />
            Tỷ lệ né tối đa là <strong>90%</strong>. Chỉ số Chính Xác của đối thủ làm giảm
            tỷ lệ né của bạn đi tương ứng.
          </PipelineStep>

          <PipelineStep num="2" title="Vô Hiệu Chưởng (chỉ áp dụng với kỹ năng chưởng)">
            Nếu bạn có option <Tag color="blue">Vô Hiệu Chưởng #%</Tag> và bị trúng Đại Bác /
            Masenko / Atomic → hấp thụ dame đó thành KI hồi, không mất HP.
          </PipelineStep>

          <PipelineStep num="3" title="Giảm theo % Giáp (tlGiap, tối đa 86%)">
            dame = dame × (1 − tlGiap%)<br />
            Chú ý: Xuyên Giáp Chưởng / Xuyên Giáp Cận Chiến của đối thủ sẽ cắt bớt tlGiap của bạn.
          </PipelineStep>

          <PipelineStep num="4" title="Trừ Giáp tuyệt đối (def)">
            dame = dame − def<br />
            Chỉ số def = defg × 4 + defAdd (từ option đồ). Dame tối thiểu sau bước này là 1.
          </PipelineStep>

          <PipelineStep num="5" title="Khiên Năng Lượng (nếu đang bật)">
            Nếu đang bật Khiên Năng Lượng: dame giảm về <strong>1</strong> (hoặc 10 ở map phố
            bản). Nếu dame ban đầu vượt HP tối đa → khiên bị phá vỡ và nhận dame bình thường.
          </PipelineStep>

          <PipelineStep num="6" title="Giáp Xen (nếu đang dùng)">
            Item Giáp Xen thường: giảm thêm 50%. Giáp Xen siêu cấp: chỉ nhận 40% dame.
          </PipelineStep>

          <Callout color="green">
            <strong>Thứ tự ưu tiên phòng thủ:</strong> Né đòn → Vô Hiệu Chưởng → Giáp% → Def → Khiên → Giáp Xen<br />
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              Tất cả áp dụng tuần tự — không cần chọn, mọi lớp đều được tính cùng lúc.
            </span>
          </Callout>
        </Section>

        {/* ── Chỉ số phụ ── */}
        <Section id="chi-so-phu" title="Các Chỉ Số Phụ Liên Quan Đến Dame">
          <Table
            headers={['Chỉ số', 'Ý nghĩa', 'Giới hạn', 'Nguồn gốc']}
            rows={[
              ['Chí mạng (%)', 'Xác suất đánh dame × 2', 'Không giới hạn rõ', 'Nâng bằng tiềm năng, option đồ, item'],
              ['Sức đánh chí mạng (%)', 'Nhân thêm % lên dame khi chí mạng', '—', 'Option đồ id=5, danh hiệu'],
              ['Né đòn (%)', 'Xác suất không nhận dame', 'Tối đa 90%', 'Option đồ id=108, ngọc rồng đen 7 sao'],
              ['Xuyên Giáp Chưởng (%)', 'Giảm tlGiap đối thủ khi dùng chưởng', '—', 'Option đồ id=98'],
              ['Xuyên Giáp Cận Chiến (%)', 'Giảm tlGiap đối thủ khi dùng cận chiến', '—', 'Option đồ id=99'],
              ['Chính Xác (%)', 'Giảm né đòn của đối thủ', '—', 'Option đồ id=18'],
              ['Hút HP (%)', 'Hồi HP bằng % dame gây ra', '—', 'Option đồ id=95, ngọc 3 sao'],
              ['Hút MP (%)', 'Hồi KI bằng % dame gây ra', '—', 'Option đồ id=96'],
              ['Phản Sát Thương (%)', 'Trả lại % dame nhận về cho kẻ tấn công', '—', 'Option đồ id=97, ngọc 4 sao'],
              ['Giáp (%)', 'Giảm % dame nhận vào', 'Tối đa 86%', 'Option đồ id=94'],
            ]}
          />
          <Note>
            Phản Sát Thương bị giới hạn khi trả ngược lên Boss: mỗi lần phản tối đa = HP tối đa Boss ÷ 100,
            để tránh phản kill boss instant.
          </Note>
        </Section>

        {/* ── Set đồ ── */}
        <Section id="set-do" title="Bonus Set Đồ Ảnh Hưởng Đến Dame">
          <Table
            headers={['Set đồ', 'Cấp kích hoạt', 'Hiệu ứng dame']}
            rows={[
              ['Set Songoku',         'Cấp 5', '+100% dame Kamejoko'],
              ['Set Kakarot',         'Cấp 5', '+100% dame Galick Gun'],
              ['Set OcTieu',          'Cấp 5', '+100% dame Liên Hoàn'],
              ['Set Nail',            'Cấp 5', '+80% dame Masenko'],
              ['Set Nail',            'Cấp 2+', '+10% sức đánh chí mạng (thêm vào tlSDCM)'],
              ['Set Kirin',           'Cấp 5', '×2 toàn bộ dame Quả Cầu Kênh Khí'],
              ['Set Picolo',          'Cấp 5', '×1.5 dame Makankosappo'],
              ['Set Cadic (cadicM)',  'Cấp 4', '+20% HP tối đa vào dame Tự Sát'],
              ['Set Cadic (cadicM)',  'Cấp 5', '+50% HP tối đa vào dame Tự Sát, +200px phạm vi bom'],
              ['Set Cadic (cadic)',   'Cấp 5', 'Thời gian biến khỉ ×5'],
              ['Set ThanVuTruKaio',  'Cấp 4', 'Tiêu thụ HP Kaioken giảm còn 5% (thay vì 10%)'],
              ['Set ThanVuTruKaio',  'Cấp 5', 'Tiêu thụ HP Kaioken giảm còn 3%, +30% dame Kaioken'],
              ['Set Pikkoroldaimax', 'Cấp 5', '×4 dame Đệ Trứng'],
              ['Set Nappa',          'Cấp 5', '+80% HP tối đa'],
              ['Set Tinh Ấn',        'Cấp 5', '+15% dame cơ bản'],
              ['Gogeta outfit',      'Người + Pet cùng mặc', '+10% dame, +10% HP, +10% KI'],
            ]}
          />
        </Section>

        {/* ── Ví dụ ── */}
        <Section id="vi-du" title="Ví Dụ Thực Tế — Tính Dame 1 Đòn Kamejoko">
          <p style={s.p}>
            Giả sử một nhân vật Trái Đất cấp 7 Kamejoko tấn công quái:
          </p>
          <CodeBlock>{`Cho biết:
  dameg     = 5,000   (nâng bằng tiềm năng)
  dameAdd   = 2,000   (từ đồ +# tấn công)
  tlDame    = [20%, 15%]  (2 option "+% sức đánh" trên đồ)
  skill.damage = 120%  (Kamejoko cấp 7)
  crit      = 15%     (xác suất chí mạng)
  tlSDCM    = 30%     (sức đánh chí mạng)
  tlDameAttMob = 25%  (tấn công +25% khi đánh quái)
  set Songoku cấp 5   → percentXDame = +100%

─── Bước 1: Dame cơ bản ───────────────────────────
  dame = 5000 + 2000 = 7,000
  + 20%: 7000 + 1400  = 8,400
  + 15%: 8400 + 1260  = 9,660

─── Bước 2: Nhân % kỹ năng (120%) ─────────────────
  dame = 9,660 × 120 ÷ 100 = 11,592

─── Bước 5: Bonus đánh quái (+25%) ────────────────
  dame = 11,592 + 11,592 × 25% = 14,490

─── Bước 6: Chí mạng (giả sử có) ──────────────────
  dame = 14,490 × 2 = 28,980
  + tlSDCM 30%: 28,980 + 8,694 = 37,674

─── Bước 7: Set Songoku +100% ──────────────────────
  dame = 37,674 + 37,674 × 100% = 75,348

─── Bước 8: Nhiễu ±5% ──────────────────────────────
  dao động trong khoảng: ~71,580 – ~79,115

═══ Dame cuối gây cho quái ≈ 71,000 – 79,000 ═══`}</CodeBlock>

          <p style={{ ...s.p, marginTop: 16 }}>
            Phía quái nhận dame qua pipeline phòng thủ:
          </p>
          <CodeBlock>{`Dame nhận vào: ~75,000 (lấy trung bình)

Giả sử quái có:
  tlGiap = 20%  → dame = 75,000 × 80% = 60,000
  def    = 500  → dame = 60,000 - 500 = 59,500

═══ HP quái giảm 59,500 ═══`}</CodeBlock>

          <Callout color="green">
            <strong>Kết luận:</strong> Để tối đa hóa dame Kamejoko, ưu tiên theo thứ tự:<br />
            <ol style={{ margin: '8px 0 0 16px', lineHeight: 2 }}>
              <li>Hoàn thiện set Songoku (×2 toàn bộ dame sau khi tính crit)</li>
              <li>Nâng % sức đánh chí mạng (tlSDCM) — nhân sau khi ×2 crit</li>
              <li>Nâng sức đánh cơ bản (dameg) — nền tảng cho mọi bước sau</li>
              <li>Nâng % đánh quái (tlDameAttMob) nếu chủ yếu farm quái</li>
              <li>Nâng chí mạng — nhưng sau khi đã có set Songoku và SDCM</li>
            </ol>
          </Callout>
        </Section>

        <div style={s.cta}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
            Chưa có tài khoản? Đăng ký ngay để trải nghiệm hệ thống này!
          </p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 14 }}>
            Tạo tài khoản ngay
          </Link>
        </div>
      </article>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: ĐỔI ĐỒ THẦN LINH
───────────────────────────────────────────── */
function TabDoiDoThanLinh() {
  return (
    <div style={s.body}>
      <aside style={s.toc}>
        <p style={s.tocTitle}>Mục lục</p>
        <ul style={s.tocList}>
          <TocItem href="#ddtl-gioi-thieu">Giới Thiệu</TocItem>
          <TocItem href="#ddtl-dieu-kien">Điều Kiện</TocItem>
          <TocItem href="#ddtl-npc">Vị Trí NPC</TocItem>
          <TocItem href="#ddtl-cach-doi">Cách Đổi</TocItem>
          <TocItem href="#ddtl-ket-qua">Kết Quả Nhận Được</TocItem>
          <TocItem href="#ddtl-luu-y">Lưu Ý Quan Trọng</TocItem>
        </ul>
      </aside>

      <article style={s.article}>

        <Section id="ddtl-gioi-thieu" title="Đổi Đồ Thần Linh — Lấy Đồ Kích Hoạt">
          <Callout color="blue">
            Hệ thống cho phép bạn <strong>đổi 5 món Đồ Thần Linh bất kỳ</strong> lấy{' '}
            <strong>1 món Đồ Kích Hoạt ngẫu nhiên</strong> — bộ trang bị gắn sẵn hiệu ứng set
            mà không cần phải ghép thêm Sách Kỹ Năng.
          </Callout>
          <p style={s.p}>
            Đây là cách tái chế những món Đồ Thần Linh dư thừa hoặc không phù hợp hành tinh
            của bạn, đổi lấy cơ hội nhận trang bị set có giá trị cao hơn.
          </p>
        </Section>

        <Section id="ddtl-dieu-kien" title="Điều Kiện Tham Gia">
          <SubSection title="Vật phẩm cần chuẩn bị">
            <Table
              headers={['Vật phẩm', 'Số lượng', 'Mô tả']}
              rows={[
                [
                  <span><Tag color="yellow">Đồ Thần Linh</Tag> (ID 555–567)</span>,
                  '5 món',
                  'Bất kỳ loại nào trong 13 loại đồ thần linh — áo, quần, găng, giày, nhẫn của cả 3 hành tinh'
                ],
              ]}
            />
            <Note>
              Không yêu cầu cùng loại, cùng hành tinh hay cùng bộ. 5 món bất kỳ trong phạm vi ID 555–567 đều được chấp nhận.
            </Note>
          </SubSection>

          <SubSection title="Các loại Đồ Thần Linh hợp lệ">
            <Table
              headers={['ID', 'Tên', 'Hành Tinh', 'Loại']}
              rows={[
                ['555', 'Áo Thần Linh Trái Đất',    <Tag color="green">Trái Đất</Tag>, 'Áo'],
                ['556', 'Quần Thần Linh Trái Đất',  <Tag color="green">Trái Đất</Tag>, 'Quần'],
                ['557', 'Áo Thần Linh Namek',        <Tag color="blue">Namek</Tag>,    'Áo'],
                ['558', 'Quần Thần Linh Namek',      <Tag color="blue">Namek</Tag>,    'Quần'],
                ['559', 'Áo Thần Linh Xayda',        <Tag color="red">Xayda</Tag>,     'Áo'],
                ['560', 'Quần Thần Linh Xayda',      <Tag color="red">Xayda</Tag>,     'Quần'],
                ['561', 'Nhẫn Thần Linh',            <Tag color="gray">Chung</Tag>,    'Nhẫn'],
                ['562', 'Găng Thần Linh Trái Đất',  <Tag color="green">Trái Đất</Tag>, 'Găng'],
                ['563', 'Giày Thần Linh Trái Đất',  <Tag color="green">Trái Đất</Tag>, 'Giày'],
                ['564', 'Găng Thần Linh Namek',      <Tag color="blue">Namek</Tag>,    'Găng'],
                ['565', 'Giày Thần Linh Namek',      <Tag color="blue">Namek</Tag>,    'Giày'],
                ['566', 'Găng Thần Linh Xayda',      <Tag color="red">Xayda</Tag>,     'Găng'],
                ['567', 'Giày Thần Linh Xayda',      <Tag color="red">Xayda</Tag>,     'Giày'],
              ]}
            />
          </SubSection>

          <SubSection title="Yêu cầu khác">
            <Table
              headers={['Yêu cầu', 'Chi tiết']}
              rows={[
                ['Hành trang', 'Còn ít nhất 1 ô trống để nhận đồ kết quả'],
                ['Vị trí',     'Phải đang ở làng (map 42/43/44/84) và gặp NPC Bà Hạt Mít bên cạnh làng'],
                ['Phí đổi',    'Không tốn phí zeni hay item khác — chỉ cần 5 đồ thần linh'],
              ]}
            />
          </SubSection>
        </Section>

        <Section id="ddtl-npc" title="Vị Trí NPC Bà Hạt Mít">
          <Callout color="green">
            NPC <strong>Bà Hạt Mít</strong> nằm <strong>bên cạnh làng</strong> của 3 hành tinh —
            bạn có thể tìm gặp bà ở các map sau:
          </Callout>
          <Table
            headers={['Map ID', 'Tên Map']}
            rows={[
              ['42', 'Làng Trái Đất'],
              ['43', 'Làng Namek'],
              ['44', 'Làng Xayda'],
              ['84', 'Làng (khu vực chung)'],
            ]}
          />
          <Note>
            Bà Hạt Mít có nhiều chức năng khác nhau. Chọn đúng menu <strong>"Đổi Đồ Thần Linh"</strong> để vào hệ thống đổi.
          </Note>
        </Section>

        <Section id="ddtl-cach-doi" title="Cách Đổi — Hướng Dẫn Từng Bước">
          <PipelineStep num="1" title="Đến gặp Bà Hạt Mít tại làng">
            Di chuyển đến làng của bất kỳ hành tinh nào (map ID 42, 43, 44 hoặc 84) và bấm
            vào NPC <strong>Bà Hạt Mít</strong> đứng bên cạnh làng để mở menu.
          </PipelineStep>

          <PipelineStep num="2" title='Chọn "Đổi Đồ Thần Linh" trong menu'>
            Trong danh sách menu của Bà Hạt Mít, chọn mục{' '}
            <Tag color="yellow">Đổi Đồ Thần Linh</Tag>. Giao diện tab kết hợp sẽ mở ra.
          </PipelineStep>

          <PipelineStep num="3" title="Chọn 5 món Đồ Thần Linh từ hành trang">
            Tab kết hợp hiển thị hành trang của bạn. Nhấn vào từng món đồ thần linh (ID 555–567)
            để đặt vào ô đổi. Bạn phải chọn <strong>đúng 5 món</strong> — không hơn, không kém.
          </PipelineStep>

          <PipelineStep num="4" title='Bấm "Đổi" để xác nhận'>
            Sau khi đã chọn đủ 5 món, nhấn nút <Tag color="green">Đổi</Tag> trong hộp thoại
            xác nhận. Nếu muốn hủy, nhấn <Tag color="gray">Hủy</Tag> — đồ của bạn sẽ không bị
            mất.
          </PipelineStep>

          <PipelineStep num="5" title="Nhận đồ kích hoạt ngẫu nhiên">
            Hệ thống tự động xóa 5 đồ thần linh và trao ngay <strong>1 món Đồ Kích Hoạt</strong>{' '}
            vào hành trang. Hiệu ứng đổi thành công sẽ xuất hiện trên màn hình.
          </PipelineStep>

          <Callout color="yellow">
            <strong>Lưu ý khi chọn đồ:</strong> Chỉ những vật phẩm có ID trong khoảng 555–567 mới
            được chấp nhận. Nếu bạn chọn sai hoặc chọn chưa đủ 5 món, hệ thống sẽ thông báo và
            không thực hiện đổi.
          </Callout>
        </Section>

        <Section id="ddtl-ket-qua" title="Kết Quả Nhận Được">
          <p style={s.p}>
            Đồ Kích Hoạt nhận được là trang bị thuộc một trong các bộ set của game, được gắn sẵn{' '}
            <strong>hiệu ứng set (SKH)</strong> — bạn không cần dùng thêm Sách Kỹ Năng để kích hoạt.
          </p>

          <SubSection title="Loại trang bị có thể nhận">
            <Table
              headers={['Slot', 'Mô tả']}
              rows={[
                ['Áo',        'Trang bị thân trên — đồ của cả 3 hành tinh'],
                ['Quần',      'Trang bị thân dưới — đồ của cả 3 hành tinh'],
                ['Găng tay',  'Trang bị tay — đồ của cả 3 hành tinh'],
                ['Giày',      'Trang bị chân — đồ của cả 3 hành tinh'],
                ['Nhẫn / Rada', 'Trang bị phụ — dùng chung cho tất cả hành tinh'],
              ]}
            />
          </SubSection>

          <SubSection title="Hành tinh của đồ nhận được">
            <Callout color="blue">
              Đồ kích hoạt có thể thuộc <strong>bất kỳ hành tinh nào</strong> trong 3 hành tinh:{' '}
              <Tag color="green">Trái Đất</Tag> <Tag color="blue">Namek</Tag>{' '}
              <Tag color="red">Xayda</Tag> — không phụ thuộc vào hành tinh nhân vật của bạn.
            </Callout>
            <p style={s.p}>
              Nhân vật Trái Đất vẫn có thể nhận đồ Namek hoặc Xayda, và ngược lại.
              Đây là cơ hội để thu thập đồ kích hoạt đa dạng hành tinh nhằm phục vụ
              nhiều chiến lược khác nhau.
            </p>
          </SubSection>

          <SubSection title="Đặc điểm của đồ nhận được">
            <Table
              headers={['Đặc điểm', 'Chi tiết']}
              rows={[
                ['Hiệu ứng set', 'Gắn sẵn — không cần thêm SKH'],
                ['Chỉ số',       'Đồ shop chuẩn của loại trang bị đó'],
                ['Giao dịch',    <span><Tag color="red">Không thể giao dịch</Tag> — không thể bán, tặng hay đặt vào shop</span>],
                ['Rớt khi chết', 'Theo cơ chế rớt đồ thông thường của game'],
              ]}
            />
          </SubSection>
        </Section>

        <Section id="ddtl-luu-y" title="Lưu Ý Quan Trọng">
          <Callout color="red">
            <strong>Không thể hoàn tác!</strong> Sau khi bấm "Đổi" và xác nhận, 5 món đồ thần
            linh sẽ bị xóa vĩnh viễn. Hãy chắc chắn bạn muốn đổi trước khi xác nhận.
          </Callout>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={s.pipeStep}>
              <div style={{ ...s.pipeNum, background: '#fcc419', color: '#000' }}>!</div>
              <div style={{ flex: 1 }}>
                <div style={s.pipeTitle}>Đồ nhận được không giao dịch được</div>
                <div style={s.pipeSub}>
                  Item đổi ra mang thuộc tính <strong>không thể giao dịch</strong>. Bạn không thể
                  bán, tặng hay đăng shop. Hãy cân nhắc kỹ trước khi đổi nếu bạn không có nhu cầu
                  dùng chính mình.
                </div>
              </div>
            </div>

            <div style={s.pipeStep}>
              <div style={{ ...s.pipeNum, background: '#51cf66' }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={s.pipeTitle}>5 đồ thần linh có thể khác loại nhau hoàn toàn</div>
                <div style={s.pipeSub}>
                  Bạn có thể kết hợp tự do: 2 áo + 1 quần + 1 giày + 1 nhẫn, hay bất kỳ
                  tổ hợp nào miễn là đủ 5 món trong phạm vi ID 555–567.
                </div>
              </div>
            </div>

            <div style={s.pipeStep}>
              <div style={{ ...s.pipeNum, background: '#74c0fc' }}>i</div>
              <div style={{ flex: 1 }}>
                <div style={s.pipeTitle}>Hành trang phải có ô trống</div>
                <div style={s.pipeSub}>
                  Nếu hành trang đầy, hệ thống sẽ từ chối thực hiện đổi và thông báo cho bạn.
                  Hãy dọn trống ít nhất 1 ô trước khi tiến hành.
                </div>
              </div>
            </div>

            <div style={s.pipeStep}>
              <div style={{ ...s.pipeNum, background: '#ff6b6b' }}>?</div>
              <div style={{ flex: 1 }}>
                <div style={s.pipeTitle}>Kết quả hoàn toàn ngẫu nhiên</div>
                <div style={s.pipeSub}>
                  Hành tinh, loại trang bị, và bộ set của đồ nhận được đều được chọn ngẫu nhiên.
                  Không có cách nào để ảnh hưởng đến kết quả. Mỗi lần đổi là một cơ hội độc lập.
                </div>
              </div>
            </div>
          </div>
        </Section>

        <div style={s.cta}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
            Cần thêm Đồ Thần Linh? Săn boss khó tại các map sự kiện để tích lũy!
          </p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 14 }}>
            Tạo tài khoản ngay
          </Link>
        </div>

      </article>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page — có tab navigation
───────────────────────────────────────────── */
const TABS = [
  { key: 'boss-drop',      label: 'Boss & Tỷ lệ Rơi Đồ' },
  { key: 'damage-calc',    label: 'Cơ chế Tính Sát Thương' },
  { key: 'doi-do-than-linh', label: 'Đổi Đồ Thần Linh' },
];

export default function GameGuide() {
  const [activeTab, setActiveTab] = useState('boss-drop');

  const heroTitles = {
    'boss-drop':         'Cơ chế Boss & Tỷ lệ Rơi Đồ',
    'damage-calc':       'Cơ chế Tính Sát Thương',
    'doi-do-than-linh':  'Đổi Đồ Thần Linh',
  };
  const heroSubs = {
    'boss-drop':        'Tổng hợp đầy đủ từ source code — HP, dame, tỷ lệ drop vật phẩm, Đồ Thần Linh, Ngọc Rồng, Kachi Vua và cơ chế đặc biệt của từng boss.',
    'damage-calc':      'Giải thích bằng ngôn ngữ bình thường: sức đánh cơ bản tính thế nào, 1 đòn đánh đi qua bao nhiêu bước, kỹ năng nào tính dame theo cơ chế riêng.',
    'doi-do-than-linh': 'Đem 5 món Đồ Thần Linh bất kỳ đến Bà Hạt Mít bên cạnh làng (map 42/43/44/84), đổi lấy 1 món Đồ Kích Hoạt ngẫu nhiên — không giới hạn hành tinh.',
  };

  return (
    <div style={s.page}>
      {/* ── Header ── */}
      <header style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>
            <Tag color="red">Hướng dẫn</Tag>
          </div>
          <h1 style={s.heroTitle}>{heroTitles[activeTab]}</h1>
          <p style={s.heroSub}>{heroSubs[activeTab]}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <Link to="/register" style={s.heroBtnOutline}>Tạo tài khoản</Link>
          </div>
        </div>
      </header>

      {/* ── Tab navigation ── */}
      <div style={s.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            style={activeTab === tab.key ? { ...s.tabBtn, ...s.tabBtnActive } : s.tabBtn}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'boss-drop'         && <TabBossDrop />}
      {activeTab === 'damage-calc'       && <TabDamageCalc />}
      {activeTab === 'doi-do-than-linh'  && <TabDoiDoThanLinh />}
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
  heroTag: { marginBottom: 12 },
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
    maxWidth: 640,
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
  /* Tab bar */
  tabBar: {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
    padding: '0 24px',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    fontSize: 14,
    fontWeight: 600,
    padding: '14px 20px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s, border-color 0.15s',
  },
  tabBtnActive: {
    color: 'var(--accent)',
    borderBottomColor: 'var(--accent)',
  },
  /* Layout */
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
    transition: 'color 0.15s',
  },
  article: {
    flex: 1,
    minWidth: 0,
  },
  section: { marginBottom: 48 },
  subSection: { marginTop: 24, marginBottom: 8 },
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
  /* Pipeline steps */
  pipeStep: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: '12px 14px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
  },
  pipeNum: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: '#fff',
    fontWeight: 800,
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pipeTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: 'var(--text)',
    marginBottom: 4,
  },
  pipeSub: {
    fontSize: 13,
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
};
