import { Product, Article } from './types';

export const CATEGORIES = ['Cơ Lỗ (Pool)', 'Cơ Carom', 'Cơ Snooker', 'Phụ Kiện'];

export const PRODUCTS: Product[] = [
  {
    id: 'raven-1',
    name: 'Hắc Dạ Minh Châu (Midnight Raven)',
    price: 2450,
    category: 'Cơ Lỗ (Pool)',
    brand: 'The Grandmaster',
    description: 'Được chế tác từ gỗ Mun đen quý hiếm, mang lại độ ổn định tuyệt đối và cảm giác đánh êm ái.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrz8FFAD7CbqR7BpK7yuNk-TKEV-j6HmqbLFTjmcolVJAfW_koleG-oCfsu934Pdd37pA-yw43cyo8fcrpz-RLs--n1DsJ7IbTh5CdYhXwlhPGmJlKA5_tVVgde79LteNuzlqtcMsKNJ37VFQNPxWSh37gEhCupRYRQBi9Pp9bwrFVSSuAGDitP4ILI_yNr1KMA4Krq79J2xUqao4HxGRTLhGR9mbdel0H6Qo5Rt8CyGBT3KNSjthNhH3loEDIM5EYnGehdE3WlzS',
    specs: [
      { label: 'Ngọn', value: 'Carbon Fiber 12.5mm' },
      { label: 'Trọng lượng', value: '19oz - 21oz' },
      { label: 'Ren', value: 'Radial' },
      { label: 'Tay cầm', value: 'Da bò thật' }
    ],
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'sovereign-1',
    name: 'The Sovereign',
    price: 3850,
    category: 'Cơ Lỗ (Pool)',
    brand: 'The Grandmaster',
    description: 'Gỗ Mun Châu Phi & Khảm Bạc thủ công tinh xảo.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC372fbYyQBrJJLnP5CNvwczFZzAa3cbNnNxkYIv21L0n4KVEGern-RO5OH-gAejaiKOlEb-HfCN7KaQM3whapwlCAt8voumPfT09hvqR_LrtckPS7ghT2vVD_8L45Wn5uO-0I471_DiKHKU8RwJqTJ69_y-EO9FG_M1XZJNOblZYp4OOy9-vyqMlSGjfN1r1dL14UadiUVTIOEe0XDLDA09GevFSMSy308ZqfRzxpH4hBNNTW8eHhDSEx2pli5bKcIOF9dAv3QzI6o',
    specs: [
      { label: 'Ngọn', value: 'Carbon Fiber 12.5mm' },
      { label: 'Trọng lượng', value: '19oz' },
      { label: 'Ren', value: 'Radial' },
      { label: 'Tay cầm', value: 'Da bò thật' }
    ],
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'shadow-1',
    name: 'Midnight Shadow',
    price: 1200,
    category: 'Cơ Carom',
    brand: 'The Grandmaster',
    description: 'Hiệu suất lõi Carbon tối ưu cho những cú đánh chính xác.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX6oI6rcLBYIAfg9jMuofMxjYm4f_QbndGI-OgUmWxaQ46y58H9PZtB8UMxi8qZbeDC1EJ3KnqxjqEEGXAqjFdCiE_7I5dUxaVefG9h8bj22-chOeGpgbqlMXI3_rq1Wh9ILsXZYVz0MBkAyEX1mUbf80Uq9QN8juhFrhbA-EldeF-c086qCXCm8WesTR8net61kE9T44fvBMIpe8CKzbGN0MWwJCO_ed-sjiHosv3XPB1HKgBzG3UdbbgAtmYdjqP_VGIJXt56saf',
    specs: [
      { label: 'Ngọn', value: 'Carbon Fiber 12.0mm' },
      { label: 'Trọng lượng', value: '19oz' },
      { label: 'Ren', value: 'Radial' },
      { label: 'Tay cầm', value: 'Trơn' }
    ],
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'chalk-1',
    name: 'Phấn Kamui Beta',
    price: 28,
    category: 'Phụ Kiện',
    brand: 'Kamui',
    description: 'Độ ma sát cực cao cho khả năng kiểm soát xoáy hoàn hảo.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2fzlIAz5hn6JmKOTCG_rduxlnoycvkMpDtMxx0nR4fb7vRQE3kX4YfKO16kCuVqM3RhVX1mf7Eds4f8TIykahmvKR270x5C8yaDY4PGizJrdB3F6x2ymEMG88-g71gH1HFhbdKKnZUdu3O13bhYNp6UYTOqKlwEk_GHpCvGye9jb-5UDQMiL3xMgrpPRnDpXY8dGLIsCetf9ISCH_WgdiCW4jEOEdo0fH0bZ_J85bHNk8X2rLvBukvmr7oV3RS2so4VBIrIRMpHHF',
    specs: [
      { label: 'Màu sắc', value: 'Xanh dương' },
      { label: 'Phiên bản', value: '0.98 Beta' }
    ],
    weight: []
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Nghệ Thuật Điều Bi: Kiểm Soát Lực Và Điểm Chạm',
    category: 'Kỹ Thuật',
    excerpt: 'Tìm hiểu cách các cơ thủ chuyên nghiệp điều khiển bi cái đi khắp bàn đấu chỉ với những thay đổi nhỏ trong cách cầm cơ.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8',
    date: '05/04/2026'
  },
  {
    id: 'art-2',
    title: 'Bảo Quản Cơ Carbon: Những Điều Cần Lưu Ý',
    category: 'Thiết Bị',
    excerpt: 'Cơ carbon bền bỉ nhưng vẫn cần sự chăm sóc đúng cách để duy trì độ chính xác theo thời gian.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8Z_z8',
    date: '03/04/2026'
  }
];
