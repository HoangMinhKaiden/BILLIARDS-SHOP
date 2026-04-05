import { Product, Article } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'midnight-ebony-ii',
    name: 'Midnight Ebony II',
    price: 1250,
    category: 'Pool',
    brand: 'Predator',
    description: 'Special Edition',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIY-gK047SMYi3PQPH0jhpuYMAMAQ7pXElB9oNmYTdMq-tpOjiopFmyqcMp0icxSB1M-XtExydmHhMj6mrsoIh94c-hdufl3CJvyziY2HqawCVZZo15qkeKDjGJYy0Hx9aK4Sc7ZlkFjiHhSDs72DR1HBMDtJQlzHkXRJ4GHJpEfBQLwJHN6A6_3bEdBnhZHU3xWsrlYWhB5PLUzq6XbtWiImhYqx1_kWA45w1LblJPqRjeoNJVAYOsmBFTS3iCwDsHC8W_IdTanp1',
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'bespoke-maple-drift',
    name: 'Bespoke Maple Drift',
    price: 890,
    category: 'Pool',
    brand: 'Lucasi',
    description: 'Custom Series',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ28pX4BA5wsHjULuWKiZnzzvIO7UKTyH-ur8pa5hTMrulKxJjKlJ5mzWvujyAXZLAmqjOKhxJ7u0QcG0VWftbG0g-uY3l1BFJg8QAVAoq-cr4zxaIyb72i3AUG_q9CWwqs9polDaIIftsSdd9jv3bsNkswuBgUykMWrY1ErupwVLvNwRBemb_CSKTTn3kMu8u80HBBEcbg3bgkaDYvFhst9Xy2P9pTGUAC-Olee_EaM8miSqNFal8lZ7pT0oV0dhMJUBJ9cY9BNMX',
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'phantom-carbon-pro',
    name: 'Phantom Carbon Pro',
    price: 2100,
    category: 'Pool',
    brand: 'Mezz',
    description: 'Performance',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSN7wFmXPli55ZT5AhGL1wL2BM_kjl3VY69YXoDqksIhYgyofdm13s89lBQWxmlMxR4PfvTb_Nz8ZeJCbusEupppsMDQ7iYusbS-bRBXkF2q3GI3sy02rDhTNWvl4Rs8f40sOT2bekbDsCEMoqmLoV1HzuxJMkrXoQ3UsfkpLyMnI_H4cJm738Y6citC7mJBMjvVTfod6yrATOYZYT9MtrpBUgmsxh1xt9ujoHsY3y52GNuCa94kpaAo19orTwu5nK4UBNmr3XVRtX',
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'royal-cocobolo',
    name: 'Royal Cocobolo',
    price: 3400,
    category: 'Pool',
    brand: "The Grandmaster's Own",
    description: "The Grandmaster's Own",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-771X3_AtiG4noDkCsoRAIdfql0qXtgfcwNlqbLP5DrtLykcwZmxQMwrdfKuJrfe9-bzFV0IhIL0bdowozJonnWfSCznZI_kSoTXHP6UFnRRDd-5T7HR-8WLJgMZixADwhQfMUW1YzALPe6CwwDvafYK6vbUGV7xTurgxwnY36nnhlf46jsU3ejhoZ7eV4jJfOn-MEysIPdn80WunpXw3O5E3lFDZIyXlG8p5kwChJSkgZoOf4s3NffIWKROmUCO_vT_A4wo01G3u',
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'venom-series-s1',
    name: 'Venom Series S1',
    price: 1150,
    category: 'Pool',
    brand: 'Predator',
    description: 'Special Edition',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuD1jwua8kzlieJ41Iyz0aa3gjPBsl2ksYzfzoFpZodZJY6qjQZHRNa6s295uq0eM3XawtF6Nz1HfikElXgvvL490RRyUj4IP96VZQqFWHkvW45ptXUGJ9CKmKpkgkRyaoG9-oJ5IlY3lyIPo0Q64ZW-bVYAVtNc1gf6bReG39giWAqdw_OutOVs_SQY4NJkQNsI5XJ5r_ZOvYWLInDCjRpFtPAal4ngibKvrZQItSJpDsT_fmWENXEJ1AxK03NswHa9kV7wlQkusV',
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'legacy-rosewood',
    name: 'Legacy Rosewood',
    price: 2250,
    category: 'Pool',
    brand: 'Custom Boutique',
    description: 'Custom Boutique',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz5MAGZu7aZymwK2DbzlX0GtulZDlNKiMV8yQMPWuV93vDeD3Wke6SCoogN_hkC8JWM0OVrm405MfYZ9K1i8eTWycIpyI3EKNe2PzpBvp-sF661XD5u-piDwww5obUy-jq8yMxccg6_cZYKujI9EsM0-IyG9Ea-tslhkKg5zeWXTOsFhnd4I6kEY_zAEjGMM56rMOidMML_KAVr4r-T9HSaABrSHDfZ5iRbzEa-izcZogdo7k-44swrrTg2aQy-6WHa5bgp50geKdS',
    weight: ['19oz', '20oz', '21oz']
  },
  {
    id: 'midnight-raven',
    name: 'The Midnight Raven Custom Cue',
    price: 2850,
    category: 'Professional Series',
    brand: 'The Grandmaster',
    description: 'Meticulously hand-crafted over 140 hours.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrz8FFAD7CbqR7BpK7yuNk-TKEV-j6HmqbLFTjmcolVJAfW_koleG-oCfsu934Pdd37pA-yw43cyo8fcrpz-RLs--n1DsJ7IbTh5CdYhXwlhPGmJlKA5_tVVgde79LteNuzlqtcMsKNJ37VFQNPxWSh37gEhCupRYRQBi9Pp9bwrFVSSuAGDitP4ILI_yNr1KMA4Krq79J2xUqao4HxGRTLhGR9mbdel0H6Qo5Rt8CyGBT3KNSjthNhH3loEDIM5EYnGehdE3WlzS',
    specs: [
      { label: 'Tip', value: 'Moori Hard' },
      { label: 'Shaft', value: 'Carbon Fiber' },
      { label: 'Wrap', value: 'Irish Linen' },
      { label: 'Joint', value: 'Radial Titanium' },
      { label: 'Butt Wood', value: 'Gabon Ebony' },
      { label: 'Inlays', value: 'Mother of Pearl' }
    ],
    weight: ['19oz', '20oz', '21oz']
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'physics-of-break-shot',
    title: 'The Physics of the Break Shot',
    category: 'Technique',
    excerpt: 'Understanding kinetic energy transfer and cue ball trajectory to consistently clear the rack on your first strike.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgYVyDUB1zxdFW4gJpVXg2wOKE-pTEOQnPjSaKGnAjy9K3CcpRao-ykWr_VnVck06e2PWAIMChO-A4yVjJ62gIGQievi8oRUCtEwjreWRhgHEeLQ30JwS3DszHchVSN5AqouFGIhpEtzOWVhdZB7ocZNJ7pwpJo1HUeo3Pg0vrvjVqiNFjXwyjnffD1F-lq5eRXYhzuqhiXqzXe8FiqEDY1tBoRxjSCh4kJSBBXAbVb2uii_kozrt8KvlY5RhIrY_fd4CzAiEAakD2',
    date: '2024-05-01'
  },
  {
    id: 'choosing-carbon-fiber-cue',
    title: 'Choosing Your First Carbon Fiber Cue',
    category: 'Equipment',
    excerpt: 'Modern precision meets classic control. We break down the top models of 2024.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTBpHwmhaJOeQPxohq0IIbQv11bVX5QwZKK3bf1zAEY7jzZb0M1AC_O-zGlMPzGlmNimHSVdURETDxPyGlSr3ZetGm5l1vG37D7CGzxn7vafiYHyksJa_Ditjb68hfL8OuSDabz49ZdOlfl1SoryKdrMMoSjnW8Qc0NElNq-wpVKANf5l4gCmjGEsNQg0YM0wpR8kCFjtkf2wfAk7Go9xHyxvlJ3o19iShCx67WSZT5lSkGH3Ijl5qFLXQgnDkXI9OGmEypWhoBKmX',
    date: '2024-04-25'
  },
  {
    id: 'precision-drills',
    title: 'Precision Drills for Every Level',
    category: 'Pro Tips',
    excerpt: 'Master the fundamentals with these five essential drills designed by The Grandmaster.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCobnmrUS7rGpf9WG5Gqh2DGC30ZKPrRXT1LWwR3cx4CGLfVGed4RyHBkG0OAI4Ertpo9urEH5D3NBIlXt6P-hf2qkzslw-lKS6xHw2AIFj2I1w7s_Zym-UgJmnw_iHIZgJVhxPBoaMimQmMnpxEL7toRSVBlP0DOSm9qEJw7fgi--gXdXIGyvRqxjVSefCtdOfTMgIaDUyjjkbsyUqm6XJVTPc93jztlXqXBrCseUx5ov7xNcL608XJo-KRkFoC2qqtSUmYynGgQT',
    date: '2024-04-20'
  },
  {
    id: 'cue-shaft-burnishing',
    title: 'The Art of Cue Shaft Burnishing',
    category: 'Maintenance',
    excerpt: 'Maintaining the silky-smooth glide of your cue shaft is paramount for consistent play.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA7WlppRQ2ch9LodoEC5K6-iigu2XmgvAlWarAFPStdQ77rCtw_m3MrHHh1PT1stIcOvSP2B-h9DbiJRkPoasbuTBqniQZism1ydEVcTBWn09L1eAL601vARP2Xta5I5knjlObwMY3nP6WRkBs7IXJKw8dgTs5WFJJ9Z4cE1X31uRRujs9LV22_XzU0aOXo_9LTtXlPTsGwwF36nHmUMLfRz3oRG5_UuN5t1Yg1mSHg5JLQzvxEkXAcdZiw3fgRVSTJg8xhsSFECH1',
    date: '2024-04-15'
  },
  {
    id: 'psychology-of-tournament',
    title: 'Psychology of the Tournament',
    category: 'Strategy',
    excerpt: 'Managing nerves and maintaining focus during high-stakes championship rounds.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4X3VE1KjD-xfrfbgH_lKRYpn6B9AM5uy-DZmsRlrF4Iog4plpAJH3FvYymNrW2ZREZXCfsggXqQJPvuTMhu_7JKr97UzQPlutLWDzRJCMj1VgN5rzJPZYs8bO_ID8liZKHIrXCkn9_pPBF6R-Zlt7zur1AmAAGW51LP9_XEckl0Yh72Lv_U7GLismWe0DQp7Wt3ISQ3ugwDk7vDZnx1D9qqJA2xmlrWF9porAN4wNt5mqsuuwR7_DwKE5KjrxpnIIc2CU6-5EMxnK',
    date: '2024-04-10'
  }
];
