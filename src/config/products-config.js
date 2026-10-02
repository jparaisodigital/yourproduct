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

const perfumeDetailsBySku = {
  M01: {
    name: 'Red Rush',
    inspiredBy: 'Lacoste Red · Lacoste',
    notes: 'Fresh, fruity, woody',
  },
  M02: {
    name: 'Eros',
    inspiredBy: 'Eros · Versace',
    notes: 'Fresh, minty, sweet',
  },
  M03: {
    name: 'Happy Man',
    inspiredBy: 'Happy for Men · Clinique',
    notes: 'Citrus, fresh, clean',
  },
  M04: {
    name: 'Aventus Style',
    inspiredBy: 'Aventus · Creed',
    notes: 'Fruity, smoky, woody',
  },
  M05: {
    name: '212 Sexy',
    inspiredBy: '212 Sexy Men · Carolina Herrera',
    notes: 'Spicy, warm, seductive',
  },
  M06: {
    name: 'Fresh Sauvage',
    inspiredBy: 'Sauvage · Dior',
    notes: 'Fresh, spicy, woody',
  },
  M07: {
    name: 'Acqua Blue',
    inspiredBy: 'Acqua di Gio · Giorgio Armani',
    notes: 'Aquatic, citrus, fresh',
  },
  M08: {
    name: 'Million Gold',
    inspiredBy: '1 Million · Paco Rabanne',
    notes: 'Sweet, spicy, warm',
  },
  M09: {
    name: 'Y Fresh',
    inspiredBy: 'Y · Yves Saint Laurent',
    notes: 'Fresh, aromatic, woody',
  },
  M10: {
    name: 'Bleu Style',
    inspiredBy: 'Bleu de Chanel · Chanel',
    notes: 'Citrus, aromatic, woody',
  },
  W01: {
    name: 'La Vie',
    inspiredBy: 'La Vie Est Belle · Lancôme',
    notes: 'Sweet, floral, vanilla',
  },
  W02: {
    name: 'Good Girl',
    inspiredBy: 'Good Girl · Carolina Herrera',
    notes: 'Sweet, warm, seductive',
  },
  W03: {
    name: 'Chance',
    inspiredBy: 'Chance · Chanel',
    notes: 'Fresh, floral, elegant',
  },
  W04: {
    name: 'Coco Bloom',
    inspiredBy: 'Coco Mademoiselle · Chanel',
    notes: 'Citrus, floral, woody',
  },
  W05: {
    name: 'Idôle',
    inspiredBy: 'Idôle · Lancôme',
    notes: 'Fresh, rose, clean',
  },
  W06: {
    name: 'Libre',
    inspiredBy: 'Libre · Yves Saint Laurent',
    notes: 'Lavender, floral, vanilla',
  },
  W07: {
    name: 'Miss Dior',
    inspiredBy: 'Miss Dior · Dior',
    notes: 'Floral, rose, fresh',
  },
  W08: {
    name: 'Bombshell',
    inspiredBy: "Bombshell · Victoria's Secret",
    notes: 'Fruity, floral, fresh',
  },
  W09: {
    name: 'Daisy',
    inspiredBy: 'Daisy · Marc Jacobs',
    notes: 'Fruity, floral, fresh',
  },
  W10: {
    name: 'Fantasy',
    inspiredBy: 'Fantasy · Britney Spears',
    notes: 'Sweet, fruity, vanilla',
  },
}

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

  const perfumeDetails =
  perfumeDetailsBySku[sku] || {
    name: sku,
    inspiredBy: '',
    notes: '',
  }
  
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
    name: perfumeDetails.name,
    category,
    collectionLabel,

    shortDescription: perfumeDetails.inspiredBy
      ? `Inspired by ${perfumeDetails.inspiredBy}.`
      : '',
    scentProfile: perfumeDetails.notes,
    scentCharacter: perfumeDetails.notes,
    bestFor: perfumeDetails.inspiredBy
      ? `For customers who enjoy ${perfumeDetails.inspiredBy}.`
      : '',
    
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