import { Product, Article } from './types';

export const CATEGORIES = ['Cơ Lỗ (Pool)', 'Cơ Carom', 'Cơ Snooker', 'Chuôi Cơ', 'Ngọn Cơ', 'Phụ Kiện'];

export const PRODUCTS: Product[] = [
  {
    id: 'raven-1',
    name: 'Hắc Dạ Minh Châu (Midnight Raven)',
    price: 61250000,
    category: 'Cơ Lỗ (Pool)',
    brand: 'The Grandmaster',
    description: 'Được chế tác từ gỗ Mun đen quý hiếm, mang lại độ ổn định tuyệt đối và cảm giác đánh êm ái.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrz8FFAD7CbqR7BpK7yuNk-TKEV-j6HmqbLFTjmcolVJAfW_koleG-oCfsu934Pdd37pA-yw43cyo8fcrpz-RLs--n1DsJ7IbTh5CdYhXwlhPGmJlKA5_tVVgde79LteNuzlqtcMsKNJ37VFQNPxWSh37gEhCupRYRQBi9Pp9bwrFVSSuAGDitP4ILI_yNr1KMA4Krq79J2xUqao4HxGRTLhGR9mbdel0H6Qo5Rt8CyGBT3KNSjthNhH3loEDIM5EYnGehdE3WlzS',
    specs: [
      { label: 'Ngọn', value: 'Carbon Fiber 12.5mm' },
      { label: 'Trọng lượng', value: '19oz - 21oz' },
      { label: 'Ren', value: 'Radial' },
      { label: 'Tay cầm', value: 'Da bò thật' }
    ]
  },
  {
    id: 'sovereign-1',
    name: 'The Sovereign',
    price: 96250000,
    category: 'Cơ Lỗ (Pool)',
    brand: 'The Grandmaster',
    description: 'Gỗ Mun Châu Phi & Khảm Bạc thủ công tinh xảo.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC372fbYyQBrJJLnP5CNvwczFZzAa3cbNnNxkYIv21L0n4KVEGern-RO5OH-gAejaiKOlEb-HfCN7KaQM3whapwlCAt8voumPfT09hvqR_LrtckPS7ghT2vVD_8L45Wn5uO-0I471_DiKHKU8RwJqTJ69_y-EO9FG_M1XZJNOblZYp4OOy9-vyqMlSGjfN1r1dL14UadiUVTIOEe0XDLDA09GevFSMSy308ZqfRzxpH4hBNNTW8eHhDSEx2pli5bKcIOF9dAv3QzI6o',
    specs: [
      { label: 'Ngọn', value: 'Carbon Fiber 12.5mm' },
      { label: 'Trọng lượng', value: '19oz' },
      { label: 'Ren', value: 'Radial' },
      { label: 'Tay cầm', value: 'Da bò thật' }
    ]
  },
  {
    id: 'shadow-1',
    name: 'Midnight Shadow',
    price: 30000000,
    category: 'Cơ Carom',
    brand: 'The Grandmaster',
    description: 'Hiệu suất lõi Carbon tối ưu cho những cú đánh chính xác.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX6oI6rcLBYIAfg9jMuofMxjYm4f_QbndGI-OgUmWxaQ46y58H9PZtB8UMxi8qZbeDC1EJ3KnqxjqEEGXAqjFdCiE_7I5dUxaVefG9h8bj22-chOeGpgbqlMXI3_rq1Wh9ILsXZYVz0MBkAyEX1mUbf80Uq9QN8juhFrhbA-EldeF-c086qCXCm8WesTR8net61kE9T44fvBMIpe8CKzbGN0MWwJCO_ed-sjiHosv3XPB1HKgBzG3UdbbgAtmYdjqP_VGIJXt56saf',
    specs: [
      { label: 'Ngọn', value: 'Carbon Fiber 12.0mm' },
      { label: 'Trọng lượng', value: '19oz' },
      { label: 'Ren', value: 'Radial' },
      { label: 'Tay cầm', value: 'Trơn' }
    ]
  },
  {
    id: 'butt-1',
    name: 'Chuôi Cơ Custom Ebony',
    price: 45000000,
    category: 'Chuôi Cơ',
    brand: 'The Grandmaster',
    description: 'Chuôi cơ được làm từ gỗ Mun cao cấp, khảm trai tinh xảo.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop',
    specs: [
      { label: 'Chất liệu', value: 'Gỗ Mun' },
      { label: 'Ren', value: 'Radial' },
      { label: 'Khảm', value: 'Xà cừ' }
    ]
  },
  {
    id: 'shaft-1',
    name: 'Ngọn Carbon Grandmaster Pro',
    price: 15000000,
    category: 'Ngọn Cơ',
    brand: 'The Grandmaster',
    description: 'Ngọn Carbon công nghệ mới, độ lệch cực thấp.',
    image: 'https://images.unsplash.com/photo-1609131009322-327119736694?q=80&w=2070&auto=format&fit=crop',
    specs: [
      { label: 'Đường kính', value: '12.4mm' },
      { label: 'Chất liệu', value: 'Carbon Fiber' },
      { label: 'Ren', value: 'Radial' }
    ]
  },
  {
    id: 'chalk-1',
    name: 'Phấn Kamui Beta',
    price: 700000,
    category: 'Phụ Kiện',
    brand: 'Kamui',
    description: 'Độ ma sát cực cao cho khả năng kiểm soát xoáy hoàn hảo.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2fzlIAz5hn6JmKOTCG_rduxlnoycvkMpDtMxx0nR4fb7vRQE3kX4YfKO16kCuVqM3RhVX1mf7Eds4f8TIykahmvKR270x5C8yaDY4PGizJrdB3F6x2ymEMG88-g71gH1HFhbdKKnZUdu3O13bhYNp6UYTOqKlwEk_GHpCvGye9jb-5UDQMiL3xMgrpPRnDpXY8dGLIsCetf9ISCH_WgdiCW4jEOEdo0fH0bZ_J85bHNk8X2rLvBukvmr7oV3RS2so4VBIrIRMpHHF',
    specs: [
      { label: 'Màu sắc', value: 'Xanh dương' },
      { label: 'Phiên bản', value: '0.98 Beta' }
    ]
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Nghệ Thuật Điều Bi: Kiểm Soát Lực Và Điểm Chạm',
    category: 'Kỹ Thuật',
    excerpt: 'Tìm hiểu cách các cơ thủ chuyên nghiệp điều khiển bi cái đi khắp bàn đấu chỉ với những thay đổi nhỏ trong cách cầm cơ và lực phát tay.',
    content: `Điều bi (cue ball control) là kỹ năng quan trọng nhất phân biệt giữa một người chơi phong trào và một cơ thủ chuyên nghiệp. Để làm chủ bàn đấu, bạn cần hiểu rõ về 3 yếu tố cốt lõi:

1. **Điểm chạm (Tip Position):** Việc đặt đầu cơ cao, thấp hay lệch sang hai bên sẽ tạo ra các loại xoáy (effe) khác nhau. Xoáy dưới (draw shot) giúp bi cái lùi lại, trong khi xoáy trên (follow shot) giúp bi cái tiến tới sau khi chạm bi mục tiêu.

2. **Lực phát tay (Speed Control):** Không phải lúc nào đánh mạnh cũng tốt. Các cơ thủ hàng đầu như Efren Reyes hay Shane Van Boening thường sử dụng lực vừa đủ để đưa bi cái vào vị trí thuận lợi nhất cho cú đánh tiếp theo.

3. **Góc tới và góc ra:** Hiểu về cách bi cái phản xạ sau khi chạm băng là chìa khóa để điều bi qua nhiều băng.

Hãy luyện tập các bài tập điều bi cơ bản mỗi ngày để hình thành cảm giác tay tốt nhất.`,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop',
    date: '2026-04-05'
  },
  {
    id: 'art-2',
    title: 'Efren Reyes: Huyền Thoại "Phù Thủy" Của Làng Billiards',
    category: 'Cơ Thủ',
    excerpt: 'Khám phá hành trình của Efren "Bata" Reyes, người được coi là cơ thủ vĩ đại nhất mọi thời đại với những cú đánh không tưởng.',
    content: `Efren Reyes, biệt danh "The Magician" (Phù Thủy), là một biểu tượng sống của làng billiards thế giới. Sinh ra tại Philippines, ông đã chinh phục hàng trăm danh hiệu quốc tế lớn nhỏ.

Điều làm nên sự khác biệt của Efren không chỉ là kỹ thuật cá nhân điêu luyện mà còn là tư duy chiến thuật cực kỳ thông minh. Ông có khả năng nhìn ra những đường bi mà không ai khác có thể thấy.

Những trận đấu kinh điển của ông với Earl Strickland hay Shane Van Boening luôn là bài học quý giá cho bất kỳ ai muốn theo đuổi bộ môn này. Efren dạy chúng ta rằng: "Billiards không chỉ là dùng tay, mà còn là dùng cả khối óc".`,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6V_6ojzI_Qyc_gf1iAdXRKwzQlFnSlIglg&s',
    date: '2026-04-03'
  },
  {
    id: 'art-3',
    title: 'Tâm Lý Thi Đấu: Giữ Cái Đầu Lạnh Trên Bàn Đấu',
    category: 'Mẹo Chuyên Nghiệp',
    excerpt: 'Làm thế nào để duy trì sự tập trung tuyệt đối khi đối mặt với áp lực trong những ván đấu quyết định.',
    content: `Trong một trận đấu billiards đỉnh cao, 50% chiến thắng đến từ kỹ thuật, 50% còn lại đến từ tâm lý. Khi đối thủ đang dẫn trước hoặc khi bạn đứng trước cú đánh quyết định ván đấu, áp lực sẽ cực kỳ lớn.

Các chuyên gia khuyên bạn nên:
- **Hít thở sâu:** Giúp ổn định nhịp tim và giảm căng thẳng cơ bắp.
- **Quy trình chuẩn bị (Pre-shot routine):** Luôn thực hiện các bước chuẩn bị giống hệt nhau cho mọi cú đánh để tạo sự ổn định.
- **Tập trung vào quá trình, không phải kết quả:** Đừng nghĩ về việc thắng hay thua, hãy chỉ tập trung vào việc thực hiện cú đánh hiện tại một cách tốt nhất.

Hãy nhớ rằng, ngay cả những nhà vô địch thế giới cũng từng thất bại. Quan trọng là cách bạn đứng dậy sau những sai lầm.`,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlkJjpDQ5G89lpxR2AmIY_UwlaybxCeVve-w&s',
    date: '2026-04-01'
  },
  {
    id: 'art-4',
    title: 'Phân Tích Trận Chung Kết World Pool Championship',
    category: 'Trận Đấu',
    excerpt: 'Nhìn lại những tình huống bước ngoặt trong trận chung kết kịch tính giữa các siêu sao hàng đầu thế giới.',
    content: `Trận chung kết World Pool Championship năm nay đã để lại nhiều ấn tượng sâu sắc trong lòng người hâm mộ. Sự đối đầu giữa lối chơi tấn công rực lửa và phòng thủ chặt chẽ đã tạo nên một kịch bản không thể đoán trước.

Điểm nhấn của trận đấu:
- **Cú phá bi (Break shot):** Tỷ lệ đưa bi mục tiêu vào lỗ sau cú phá là yếu tố then chốt giúp các cơ thủ làm chủ thế trận.
- **Những tình huống chạy đạn (Safety play):** Khi không có đường ăn rõ ràng, việc giấu bi cái sau bi mục tiêu khác để làm khó đối thủ là một nghệ thuật.
- **Bản lĩnh ở những ván cuối (Hill-hill):** Khi tỷ số hòa và chỉ còn ván đấu cuối cùng, ai bản lĩnh hơn người đó sẽ giành chiến thắng.

Đây thực sự là một bữa tiệc billiards mãn nhãn cho tất cả những ai yêu mến bộ môn này.`,
    image: 'https://wpapool.com/wp-content/uploads/2024/02/WPC2024-Website-3.jpg',
    date: '2026-03-28'
  },
  {
    id: 'art-5',
    title: 'Giải Billiards 9 Bi Mở Rộng - CLB The Grandmaster',
    category: 'Giải Đấu',
    excerpt: 'Cơ hội giao lưu và tranh tài cho các cơ thủ phong trào và bán chuyên tại khu vực TP.HCM với tổng giải thưởng hấp dẫn.',
    content: `Chào mừng các cơ thủ đến với giải đấu 9 bi mở rộng lần thứ I tại CLB The Grandmaster. Đây là sân chơi bổ ích để các bạn cọ xát và nâng cao trình độ.

Giải đấu sẽ được tổ chức theo thể lệ quốc tế, đảm bảo tính công bằng và chuyên nghiệp nhất. Mọi trang thiết bị tại CLB đều đạt chuẩn thi đấu, từ bàn, bi cho đến ánh sáng.

Chúng tôi rất mong nhận được sự tham gia nhiệt tình của tất cả các bạn!`,
    location: 'CLB The Grandmaster, 123 Đường Billiards, Quận 1, TP.HCM',
    time: '08:00 AM - 20:00 PM',
    date: '2026-04-15',
    rules: 'Thi đấu 9 bi, chạm 7, phá luân phiên. Áp dụng luật WPA.',
    fee: '500.000 VNĐ / người',
    participants: '64 cơ thủ',
    prizes: 'Nhất: 10.000.000đ + Cúp | Nhì: 5.000.000đ | Ba: 2.000.000đ',
    image: 'https://poolplayers.com/wp-content/uploads/2022/08/2022-9ball-champs.jpg'
  },
  {
    id: 'art-6',
    title: 'Hệ Thống Nhắm Ghost Ball: Bí Quyết Cho Cú Đánh Chính Xác',
    category: 'Kỹ Thuật',
    excerpt: 'Làm thế nào để xác định điểm chạm hoàn hảo trên bi mục tiêu bằng phương pháp hình dung "bi ma".',
    content: `Ghost Ball là một trong những hệ thống nhắm mục tiêu phổ biến và hiệu quả nhất trong bida lỗ. 

**Cách hoạt động:**
1. Hãy tưởng tượng một quả "bi ma" nằm ngay cạnh bi mục tiêu sao cho đường nối tâm của bi ma và bi mục tiêu hướng thẳng vào lỗ.
2. Nhiệm vụ của bạn là đánh bi cái vào đúng vị trí của quả bi ma đó.

**Lưu ý:**
- Cần tính đến độ lệch (squirt) nếu bạn sử dụng xoáy.
- Luyện tập hình dung quả bi ma ở các góc độ khác nhau sẽ giúp bạn cải thiện độ chính xác đáng kể.`,
    image: 'https://mediaen.vietnamplus.vn/images/f452454bbd6fc5e39be208129221a2f46a9f3e9308be95c2e4bed485a7255efb8f853bdb05b02301cf6a081b2c0c1ddf22f4c6fd3680fd7865dd7046fa3f2f69/437648-5219968594518889-image.png',
    date: '2026-03-25'
  },
  {
    id: 'art-7',
    title: 'Ronnie O\'Sullivan: Thiên Tài Snooker Và Những Kỷ Lục',
    category: 'Cơ Thủ',
    excerpt: 'Tìm hiểu về "The Rocket" - người đã định nghĩa lại tốc độ và sự hoa mỹ trong bộ môn Snooker.',
    content: `Ronnie O'Sullivan được coi là cơ thủ tài năng nhất trong lịch sử Snooker. Với khả năng đánh tốt cả hai tay và tốc độ ra cơ cực nhanh, ông đã giành được 7 chức vô địch thế giới.

Ronnie không chỉ nổi tiếng với những danh hiệu mà còn với những cú "Maximum Break" (147 điểm) nhanh nhất lịch sử. Lối chơi của ông là sự kết hợp hoàn hảo giữa bản năng thiên tài và kỹ thuật thượng thừa.

Dù Snooker có bàn lớn hơn và lỗ nhỏ hơn bida lỗ, nhưng tư duy điều bi và cách kiểm soát áp lực của Ronnie là bài học quý giá cho mọi cơ thủ.`,
    image: 'https://images.unsplash.com/photo-1516640993998-ff162ce06c4b?q=80&w=2070&auto=format&fit=crop',
    date: '2026-03-20'
  },
  {
    id: 'art-8',
    title: 'Lựa Chọn Ngọn Cơ Carbon: Xu Hướng Mới Của Thời Đại',
    category: 'Kỹ Thuật',
    excerpt: 'Tại sao các cơ thủ chuyên nghiệp đang dần chuyển sang sử dụng ngọn cơ sợi carbon thay vì gỗ phong truyền thống.',
    content: `Sợi carbon đang tạo nên một cuộc cách mạng trong sản xuất cơ bida. 

**Ưu điểm vượt trội:**
- **Độ lệch thấp (Low Deflection):** Giúp bi cái đi thẳng hơn khi sử dụng xoáy.
- **Độ bền:** Không bị cong vênh do thời tiết hay độ ẩm.
- **Cảm giác đánh:** Cung cấp phản hồi lực nhất quán trong mọi cú đánh.

Tuy nhiên, cảm giác âm thanh và độ rung của cơ carbon khác biệt hoàn toàn so với gỗ. Việc lựa chọn giữa carbon và gỗ phong vẫn phụ thuộc nhiều vào sở thích cá nhân của mỗi cơ thủ.`,
    image: 'https://images.unsplash.com/photo-1609131009322-327119736694?q=80&w=2070&auto=format&fit=crop',
    date: '2026-03-15'
  }
];
