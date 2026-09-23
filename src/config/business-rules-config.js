export const businessRules = {
  packageProducts: {
    allowAssortedScents: true,

    assortmentMode: 'company',

    customerCanChooseScents: false,

    assortmentNotice:
      'Scents are assorted by the company based on available inventory.',
  },

  paymentVerification: {
    minimumHours: 24,
    maximumHours: 48,

    notice:
      'Payment verification may take 24 to 48 hours.',
  },

  nonMemberCancellation: {
    allowedStatuses: [
      'pending-verification',
      'processing',
    ],

    requiresAdminApproval: false,

    paidOrderRefundMode: 'manual',

    notice:
      'Non-member orders may be cancelled directly before shipment. Refunds for verified payments are processed manually.',
  },

  nonMemberAccountExpiry: {
    unpaidExpiryHours: 72,

    exemptCustomerTypes: [
      'member',
    ],

    exemptOrderStatuses: [
      'processing',
      'shipped',
      'delivered',
    ],

    action: 'deactivate',

    notice:
      'Unpaid non-member accounts are deactivated after 3 days.',
  },
}