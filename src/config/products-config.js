import perfumeMenImage from '../assets/products/perfume-men.png'
import perfumeWomenImage from '../assets/products/perfume-women.png'

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
    name: 'Red Rush',
    category: 'men',
    collectionLabel: "Men's Collection",
    shortDescription: 'A fresh, fruity, and woody everyday scent.',
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
    name: 'La Vie',
    category: 'women',
    collectionLabel: "Women's Collection",
    shortDescription: 'A sweet floral scent with warm vanilla notes.',
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
]