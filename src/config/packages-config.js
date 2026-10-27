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
    pointsRewardLabel: 'Earn 20 points for incentives',
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
      'Option A: 4 Assorted Bottles with box (60ml each)',
      'Option B: 1 Starter Tester Kit + 2 Assorted Bottles with box',
      'Each perfume comes with its own box',
      '30% reseller bottle pricing',
      '20 points for member incentives',
      'Access for Business Programs',
      'Earn 10% Income from Your Supplier',
      'Your Product University',
      'Your Events',
      'Your Business Centre',
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
    pointsRewardLabel: 'Earn 125 points for incentives',
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
      '25 Assorted Bottles (60ml)',
      '35% Reseller Bottle Pricing',
      '125 points for member incentives',
      'Each perfume comes with its own box',
      'Earn 10% Income from Your Supplier',
      'Access for Business Programs',
      'Your Product University',
      'Your Events',
      'Your Business Centre',
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
    pointsRewardLabel: 'Earn 250 points for incentives',
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
      '55 Assorted Bottles (60ml)',
      '40% Reseller Bottle Pricing',
      'Each perfume comes with its own box',
      'Earn 10% Income from Your Supplier',
      '250 points for member incentives',
      'Unlock Your Product Own Business',
      'Own Bottle Name',
      'Own Perfume Business',
      '1 Business Name Tarpaulin from you',
      'Business Programs',
      'Your Product University',
      'Your Events',
      'Your Business Centre',
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
    pointsRewardLabel: 'Earn 1,200 points for incentives',
    discountLabel: '50% off per bottle',

    description:
      'Lead your way to greater success.',

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
      '2 Tester Kit',
      '240 Assorted Bottles (60ml)',
      '50% Reseller Bottle Pricing',
      'Each perfume comes with its own box',
      'Earn 10% Income from Your Supplier',
      '1,200 points for member incentives',
      'Unlock Your Product Own Business',
      '1 Business Name Tarpaulin from you',
      'Own Bottle Name',
      'Own Perfume Business',
      '1 Official Business Tarpaulin',
      '1 Stall Brand New',
      '1 Rolling Tarpaulin',
      'Business Programs',
      'Your Product University',
      'Your Events',
      'Your Business Centre',
    ],

    isFeatured: true,
    isActive: true,
  },
]