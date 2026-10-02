import men1Image from '../assets/men/1.png'
import men2Image from '../assets/men/2.png'
import men3Image from '../assets/men/3.png'
import men4Image from '../assets/men/4.png'
import men5Image from '../assets/men/5.png'
import men6Image from '../assets/men/6.png'
import men7Image from '../assets/men/7.png'
import men8Image from '../assets/men/8.png'
import men9Image from '../assets/men/9.png'
import men10Image from '../assets/men/10.png'

import women1Image from '../assets/women/1.png'
import women2Image from '../assets/women/2.png'
import women3Image from '../assets/women/3.png'
import women4Image from '../assets/women/4.png'
import women5Image from '../assets/women/5.png'
import women6Image from '../assets/women/6.png'
import women7Image from '../assets/women/7.png'
import women8Image from '../assets/women/8.png'
import women9Image from '../assets/women/9.png'
import women10Image from '../assets/women/10.png'

import testerKitImage from '../assets/products/tester-kit.png'

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

const menImages = [
  men1Image,
  men2Image,
  men3Image,
  men4Image,
  men5Image,
  men6Image,
  men7Image,
  men8Image,
  men9Image,
  men10Image,
]

const womenImages = [
  women1Image,
  women2Image,
  women3Image,
  women4Image,
  women5Image,
  women6Image,
  women7Image,
  women8Image,
  women9Image,
  women10Image,
]

function createProduct({
  number,
  category,
  image,
}) {
  const paddedNumber = String(number).padStart(
    2,
    '0',
  )
  
  const categoryCode =
  category === 'men' ? 'M' : 'W'
  
  const sku =
  `${categoryCode}${paddedNumber}`
  
  const collectionLabel =
  category === 'men'
  ? "Men's Collection"
  : "Women's Collection"
  
  let stockQuantity = 20
  
  // Low-stock product for the current admin preview.
  if (sku === 'M02') {
    stockQuantity = 4
  }
  
  // Three W02 units are already reflected in
  // the approved processing preview order.
  if (sku === 'W02') {
    stockQuantity = 17
  }
  
  return {
    // Preserve these IDs because the current admin
    // orders and inventory records depend on them.
    id:
    `sample-${category}-${paddedNumber}`,
    
    sku,
    slug: sku.toLowerCase(),
    name: sku,
    category,
    collectionLabel,
    
    // Keep product information empty until the
    // client confirms the official scent details.
    shortDescription: '',
    scentProfile: '',
    scentCharacter: '',
    bestFor: '',
    
    regularPrice: 349,
    memberPrice: 199,
    
    // Product cost is not available yet.
    // Profit reporting stays disabled until confirmed.
    costPrice: null,
    
    image,
    
    isFeatured: number === 1,
    isActive: true,
    
    // Keep disabled until the qualified-bottle
    // points rules are finalized.
    isPointsQualified: false,
    pointsPerUnit: 0,
    
    stockQuantity,
    lowStockThreshold: 5,
    
    isSample: false,
  }
}

const testerKitProduct = {
  id: 'tester-kit',
  sku: 'TK01',
  slug: 'tester-kit',
  name: 'Premium Tester Kit',
  category: 'tester-kit',
  collectionLabel: 'Tester Kit',

  shortDescription:
    '20-piece 5ml tester kit for exploring the full scent lineup.',
  scentProfile: '',
  scentCharacter: '',
  bestFor: 'Product sampling and scent discovery.',

  regularPrice: 700,
  memberPrice: 700,
  fixedPrice: true,

  costPrice: null,

  image: testerKitImage,

  isFeatured: true,
  isActive: true,
  isPointsQualified: true,
  pointsPerUnit: 10,

  stockQuantity: 0,
  lowStockThreshold: 5,

  isSample: false,
  isStandaloneOffer: true,
}

export const products = [
  testerKitProduct,
  ...menImages.map((image, index) =>
    createProduct({
    number: index + 1,
    category: 'men',
    image,
  }),
),

...womenImages.map((image, index) =>
  createProduct({
  number: index + 1,
  category: 'women',
  image,
}),
),
]