import {
  businessRules,
} from './business-rules-config.js'

const packageProductRules =
  businessRules.packageProducts

export const packages = [
  {
    id: 'starter',
    name: 'Your Starter',
    shortLabel: 'Starter',
    price: 1000,
    pointsReward: 20,
    discountLabel: '30% off per bottle',

    description:
      'Perfect for beginners who want to start small.',

    productQuantity: 4,

    ...packageProductRules,

    fixedInventoryItems: [],

    options: [
      {
        id: 'starter-option-a',
        label: 'Option A',
        title: '4 Bottles',
        description: '4 assorted bottles, 60ml each.',
        productQuantity: 4,
        fixedInventoryItems: [],
      },
      {
        id: 'starter-option-b',
        label: 'Option B',
        title: 'Starter Tester Kit + 2 Bottles',
        description:
          '1 Starter Tester Kit with 20 pcs 5ml testers plus 2 assorted bottles, 60ml each.',
        productQuantity: 2,
        fixedInventoryItems: [
          {
            inventoryItemId: 'supply-tester-kit',
            name: 'Starter Tester Kit',
            quantity: 1,
          },
        ],
      },
    ],

    inclusions: [
      'Option A: 4 Assorted Bottles (60ml each)',
      'Option B: 1 Starter Tester Kit + 2 Assorted Bottles',
      'Business Access',
    ],

    isFeatured: false,
    isActive: true,
  },

  {
    id: 'builder',
    name: 'Your Builder',
    shortLabel: 'Builder',
    price: 5000,
    pointsReward: 125,
    discountLabel: '35% off per bottle',

    description:
      'Build today. A stronger tomorrow.',

    productQuantity: 25,

    ...packageProductRules,

    fixedInventoryItems: [
      {
        inventoryItemId: 'supply-tester-kit',
        name: 'Tester Kit',
        quantity: 1,
      },
    ],

    inclusions: [
      '1 Tester Kit',
      '25 Assorted Bottles (85ml)',
      'Business Programs',
    ],

    isFeatured: false,
    isActive: true,
  },

  {
    id: 'leader',
    name: 'Your Leader',
    shortLabel: 'Leader',
    price: 10000,
    pointsReward: 250,
    discountLabel: '40% off per bottle',

    description:
      'Lead your way to greater success.',

    productQuantity: 55,

    ...packageProductRules,

    fixedInventoryItems: [
      {
        inventoryItemId: 'supply-tester-kit',
        name: 'Tester Kit',
        quantity: 1,
      },
      {
        inventoryItemId: 'supply-tarpaulin',
        name: 'Tarpaulin',
        quantity: 1,
      },
    ],

    inclusions: [
      '1 Tester Kit',
      '55 Assorted Bottles (85ml)',
      '1 Tarpaulin',
      'Business Programs',
    ],

    isFeatured: false,
    isActive: true,
  },

  {
    id: 'prestige',
    name: 'Your Prestige',
    shortLabel: 'Prestige',
    price: 50000,
    pointsReward: 1200,
    discountLabel: '50% off per bottle',

    description:
      'Maximize today. Multiply tomorrow.',

    productQuantity: 240,

    ...packageProductRules,

    fixedInventoryItems: [
      {
        inventoryItemId: 'supply-tester-kit',
        name: 'Tester Kit',
        quantity: 2,
      },
      {
        inventoryItemId: 'supply-tarpaulin',
        name: 'Tarpaulin',
        quantity: 1,
      },
      {
        inventoryItemId: 'supply-mini-stall',
        name: 'Mini Stall',
        quantity: 1,
      },
    ],

    inclusions: [
      '2 Tester Kits',
      '240 Assorted Bottles (85ml)',
      '1 Tarpaulin',
      '1 Mini Stall',
      'Business Programs',
    ],

    isFeatured: true,
    isActive: true,
  },
]
