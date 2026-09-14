import perfumeMenImage from '../assets/products/perfume-men.png'
import perfumeWomenImage from '../assets/products/perfume-women.png'
import perfume1Image from '../assets/products/perfume1.png'
import perfume2Image from '../assets/products/perfume2.png'

export const productCategories = [
  {
    id: 'all',
    label: 'All Scents',
  },
  {
    id: 'men',
    label: 'For Him',
  },
  {
    id: 'women',
    label: 'For Her',
  },
]

export const products = [
  {
    id: 'sample-men-01',
    sku: 'M01',
    slug: 'red-rush',
    name: 'Sample 1',
    category: 'men',
    collectionLabel: "Men's Collection",
    shortDescription:
      'A fresh, fruity, and woody everyday scent.',
    regularPrice: 599,
    memberPrice: 499,
    image: perfumeMenImage,
    isFeatured: true,
    isActive: true,
    isPointsQualified: true,
    pointsPerUnit: 5,
    stockQuantity: 20,
    isSample: true,
  },
  {
    id: 'sample-women-01',
    sku: 'W01',
    slug: 'la-vie',
    name: 'Sample 2',
    category: 'women',
    collectionLabel: "Women's Collection",
    shortDescription:
      'A sweet floral scent with warm vanilla notes.',
    regularPrice: 599,
    memberPrice: 499,
    image: perfumeWomenImage,
    isFeatured: true,
    isActive: true,
    isPointsQualified: true,
    pointsPerUnit: 5,
    stockQuantity: 20,
    isSample: true,
  },
  {
    id: 'sample-men-02',
    sku: 'M02',
    slug: 'sample-3',
    name: 'Sample 3',
    category: 'men',
    collectionLabel: "Men's Collection",
    shortDescription:
      'A warm woody scent with smooth amber notes.',
    regularPrice: 599,
    memberPrice: 499,
    image: perfume1Image,
    isFeatured: false,
    isActive: true,
    isPointsQualified: true,
    pointsPerUnit: 5,
    stockQuantity: 20,
    isSample: true,
  },
  {
    id: 'sample-women-02',
    sku: 'W02',
    slug: 'sample-4',
    name: 'Sample 4',
    category: 'women',
    collectionLabel: "Women's Collection",
    shortDescription:
      'A fresh aquatic scent with clean citrus notes.',
    regularPrice: 599,
    memberPrice: 499,
    image: perfume2Image,
    isFeatured: false,
    isActive: true,
    isPointsQualified: true,
    pointsPerUnit: 5,
    stockQuantity: 20,
    isSample: true,
  },
]