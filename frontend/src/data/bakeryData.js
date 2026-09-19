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