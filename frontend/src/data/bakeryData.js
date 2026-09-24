//feat/SPNB-CTSP(04)

export const PRODUCTS_DATA = [
  {
    id: 'p-sn-1',
    categorySlug: 'banh-sinh-nhat',
    categoryName: 'Bánh sinh nhật',
    name: 'Bánh sinh nhật Socola Cherry',
    slug: 'banh-sinh-nhat-socola-cherry',
    price: 630000,
    formattedPrice: '630.000đ',
    description: 'Tùy chỉnh bánh sinh nhật theo ý thích, tạo nên món quà ý nghĩa cho người thân cùng quả cherry đỏ mọng và lớp socola đậm đà.',
    image: '/images/sản phẩm nổi bật/banh sinh nhat.avif',
    isFeatured: true,
    rating: 5.0,
    sold: 142
  },
  {
    id: 'p-sn-2',
    categorySlug: 'banh-sinh-nhat',
    categoryName: 'Bánh sinh nhật',
    name: 'Bánh Socola mềm mịn',
    slug: 'banh-socola-mem-min',
    price: 650000,
    formattedPrice: '650.000đ',
    description: 'Tùy chỉnh bánh sinh nhật theo ý thích, cốt bánh mềm xốp phủ kem ganache socola bỉ thượng hạng.',
    image: '/images/bánh sinh nhật/sinh nhật 2.avif',
    isFeatured: true,
    rating: 4.9,
    sold: 98
  },
  {
    id: 'p-cc-1',
    categorySlug: 'banh-cupcake',
    categoryName: 'Bánh Cupcake',
    name: 'Bánh Cupcake Đào',
    slug: 'banh-cupcake-dao',
    price: 35000,
    formattedPrice: '35.000đ',
    description: 'Bánh cupcake vị đào thơm ngọt ngào phủ lớp kem bơ đào thanh mát nhẹ nhàng.',
    image: '/images/bánh cupcake/cupcake 1.avif',
    isFeatured: true,
    rating: 4.8,
    sold: 110
  },
  {
    id: 'p-dn-1',
    categorySlug: 'banh-donut',
    categoryName: 'Bánh Donut',
    name: 'Bánh Donut Socola Bạc Hà',
    slug: 'banh-donut-socola',
    price: 32000,
    formattedPrice: '32.000đ',
    description: 'Donut phủ lớp socola đen nguyên chất giòn rụm kết hợp sốt bạc hà the mát độc đáo.',
    image: '/images/bánh donut/donut 1.avif',
    isFeatured: true,
    rating: 4.9,
    sold: 215
  }
];


//feat/danh-muc(05)
export const CATEGORIES_DATA = [
  {
    id: 'banh-donut',
    slug: 'banh-donut',
    name: 'Bánh Donut',
    description: 'Miếng bánh tròn xoe, ngọt ngào, mềm xốp, ai cũng mê',
    image: '/images/danh mục sản phẩm/danh muc san pham 3.avif', // Bánh Donut
    count: 5
  },
  {
    id: 'phu-kien-banh',
    slug: 'phu-kien-banh',
    name: 'Phụ kiện bánh',
    description: 'Nến xoắn, thiệp chúc mừng và phụ kiện trang trí tiệc sinh nhật',
    image: '/images/danh mục sản phẩm/danh muc san pham 5.avif', // Phụ kiện bánh & thiệp
    count: 5
  },
  {
    id: 'banh-quy',
    slug: 'banh-quy',
    name: 'Bánh quy',
    description: 'Bánh quy bơ giòn rụm, béo ngậy chuẩn phong cách Pháp',
    image: '/images/danh mục sản phẩm/danh muc san pham 1.avif', // Đĩa bánh quy
    count: 4
  },
  {
    id: 'banh-sinh-nhat',
    slug: 'banh-sinh-nhat',
    name: 'Bánh sinh nhật',
    description: 'Kiệt tác bánh kem nghệ thuật sang trọng cho ngày đặc biệt',
    image: '/images/danh mục sản phẩm/danh muc san pham 4.avif', // Bánh sinh nhật socola
    count: 5
  },
  {
    id: 'banh-cupcake',
    slug: 'banh-cupcake',
    name: 'Bánh Cupcake',
    description: 'Chiếc bánh nhỏ xinh phủ kem bơ tươi mịn màng tan chảy',
    image: '/images/danh mục sản phẩm/danh muc san pham 2.avif', // Bánh Cupcake
    count: 4
  }
];

//feat/heroslide(09)
export const SLIDES_DATA = [
  {
    id: 1,
    type: 'image',
    src: '/images/slide/slide1.avif',
    tagline: 'BÁNH DÀNH CHO MÙA LỄ HỘI',
    title: 'Cùng nhau mở ra sự kỳ diệu!',
    ctaText: 'Khám phá Phụ kiện bánh',
    ctaLink: '#categories',
  },
  {
    id: 2,
    type: 'video',
    src: '/images/slide/slide2.mp4',
    tagline: 'TINH HOA NGHỆ THUẬT BÁNH NGỌT',
    title: 'Ngọt ngào từng khoảnh khắc!',
    ctaText: 'Xem Sản phẩm nổi bật',
    ctaLink: '#featured',
  },
  {
    id: 3,
    type: 'image',
    src: '/images/slide/slide3.avif',
    tagline: 'NGUYÊN LIỆU THƯỢNG HẠNG 100%',
    title: 'Hương vị chạm đến trái tim!',
    ctaText: 'Khám phá Bánh sinh nhật',
    ctaLink: '#categories',
  },
  {
    id: 4,
    type: 'image',
    src: '/images/slide/slide4.avif',
    tagline: 'BÁNH TƯƠI RA LÒ MỖI NGÀY',
    title: 'Món quà trọn vẹn yêu thương!',
    ctaText: 'Đặt bánh ngay',
    ctaLink: '#featured',
  },
  {
    id: 5,
    type: 'image',
    src: '/images/slide/slide5.avif',
    tagline: 'ĐẲNG CẤP TIỆM BÁNH THỦ CÔNG',
    title: 'Đậm đà phong vị Yuu Cake!',
    ctaText: 'Xem toàn bộ bánh',
    ctaLink: '#categories',
  }
];

export const TICKER_ITEMS = [
  { icon: '📞', text: 'Đặt bánh gọi ngay 0944100001' },
  { icon: '📦', text: 'Miễn phí vận chuyển trong phạm vi 2km' },
  { icon: '🎂', text: 'Bánh nướng tươi mỗi ngày, chuẩn vị thủ công' },
  { icon: '📞', text: 'Đặt bánh gọi ngay 09441000011' },
  { icon: '📦', text: 'Miễn phí vận chuyển trong phạm vi 2km' },
  { icon: '✨', text: 'Tặng kèm dao dĩa & nến nghệ thuật cho mỗi đơn bánh sinh nhật' }
];

//feat/blog-va-tin-tuc(10)
export const BLOG_POSTS_DATA = [
  {
    id: 1,
    tag: 'Tin tức',
    title: 'Giáng sinh ngập tràn - Nhận ưu đãi giảm giá',
    excerpt: 'Mùa Giáng Sinh an lành đang đến gần, không khí se lạnh hòa cùng niềm hân hoan của mỗi nhà. Tiệm bánh YuuCake gửi tặng bạn voucher khủng giảm tới 50% cho tất cả các mẫu bánh mùa lễ hội...',
    content: 'Những chiếc bánh khúc cây socola bồng bềnh, bánh kem ông già Noel và bánh quy gừng thơm lừng đã sẵn sàng trên kệ. Hãy ghé ngay tiệm bánh của Vy hoặc đặt hàng trực tuyến để nhận ưu đãi lên đến 50% ngay hôm nay!',
    image: '/images/blog/blog 1.avif',
    author: {
      name: 'Vy Vy (Chủ tiệm)',
      avatar: '/images/danh mục sản phẩm/danh muc san pham 1.avif'
    },
    date: '23/12/2024',
    isHero: true
  },
  {
    id: 2,
    tag: 'Mẹo hay',
    title: 'Bí quyết chọn size bánh sinh nhật vừa vặn cho từng bữa tiệc',
    excerpt: 'Làm thế nào để chọn chiếc bánh vừa vặn số lượng khách mà vẫn giữ trọn nét tinh tế, sang trọng? Cùng YuuCake khám phá hướng dẫn chọn bánh chuẩn xác...',
    content: 'Chọn bánh 16cm cho tiệc gia đình 4-6 người, 20cm cho nhóm bạn 8-12 người và bánh 2 tầng lộng lẫy cho các bữa tiệc sinh nhật đông vui trên 20 khách...',
    image: '/images/blog/blog 2.avif',
    author: {
      name: 'Yuu Baker',
      avatar: '/images/danh mục sản phẩm/danh muc san pham 2.avif'
    },
    date: '18/12/2024',
    isHero: false
  },
  {
    id: 3,
    tag: 'Câu chuyện',
    title: 'Hành trình tìm kiếm socola Bỉ thượng hạng cho chiếc bánh của Vy',
    excerpt: 'Mỗi chiếc bánh kem socola tại Yuu Cake đều khởi nguồn từ những thanh sô-cô-la Bỉ nguyên chất 70%, kết tinh hương vị đắng êm dịu và thơm ngậy khó quên...',
    content: 'Chúng tôi tin rằng nguyên liệu tử tế tạo nên hương vị chân thực. Từng mẻ kem ganache được khuấy bằng tay tỉ mỉ mỗi sáng để đảm bảo độ bóng mịn hoàn hảo...',
    image: '/images/blog/blog 3.avif',
    author: {
      name: 'Vy Vy (Chủ tiệm)',
      avatar: '/images/danh mục sản phẩm/danh muc san pham 1.avif'
    },
    date: '10/12/2024',
    isHero: false
  }
];
