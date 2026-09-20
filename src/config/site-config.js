export const siteConfig = {
  brand: {
    name: 'YOUR PRODUCT',
    tagline: 'Scents That Create Opportunities',
    shortDescription:
      'Discover premium fragrances, meaningful connections, and new possibilities with Your Product.',
  },

  locale: 'en-PH',
  currency: 'PHP',

  navigation: [
    {
      label: 'Home',
      href: '#home',
    },
    {
      label: 'Discover',
      href: '#discover',
    },
    {
      label: 'Perfumes',
      href: '#shop',
    },
    {
      label: 'Packages',
      href: '#packages',
    },
    {
      label: 'Ways to Earn',
      href: '#ways-to-earn',
    },
  ],

  contact: {
    facebook: '',
    messenger: '',
    email: '',
    phone: '',
  },

  features: {
    publicLandingPage: true,
    packages: true,
    community: true,
    waysToEarn: true,

    memberRegistration: true,
    memberLogin: true,
    memberDashboard: true,

    perfumeInformation: true,
    menPerfumes: true,
    womenPerfumes: true,

    createOrder: true,
    shoppingCart: true,
    dropshipCheckout: true,
    orderHistory: true,

    directReferralCount: true,
    pointsDisplay: true,
    rewardProgress: true,

    wallet: true,
    manualPayoutRequests: true,

    automatedPayouts: false,
    automatedPayments: false,
    binarySystem: false,
    multiLevelCommission: false,
  },
}