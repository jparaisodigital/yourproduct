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

    description:
      'Perfect start for new partners.',

    productQuantity: 5,

    ...packageProductRules,

    fixedInventoryItems: [],

    inclusions: [
      '5 Assorted Bottles (85ml)',
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

    description:
      'Build today. A stronger tomorrow.',

    productQuantity: 27,

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
      '27 Assorted Bottles (85ml)',
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

    description:
      'Maximize today. Multiply tomorrow.',

    productQuantity: 250,

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
      '250 Assorted Bottles (85ml)',
      '1 Tarpaulin',
      '1 Mini Stall',
      'Business Programs',
    ],

    isFeatured: true,
    isActive: true,
  },
]
