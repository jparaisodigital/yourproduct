export const customerOrders = [
  {
    id: 'order-001',
    order_number: 'YP-2026-0001',

    customer_id: 'customer-001',
    customer_name: 'Juan Dela Cruz',
    customer_email: 'juan@example.com',
    customer_mobile: '09171234567',
    customer_type: 'regular',

    status: 'pending-verification',

    items: [
      {
        id: 'order-item-001',
        product_id: 'sample-men-01',
        product_name: 'Sample 1',
        product_category: "Men's Collection",
        product_image_url: null,

        pricing_type: 'regular',

        quantity: 2,
        unit_price: 299,

        // Cost snapshot when the order was created.
        unit_cost: 90,

        line_total: 598,
      },
    ],

    item_count: 2,
    subtotal: 598,
    delivery_fee: 0,
    total_amount: 598,

    fulfillment_type: 'dropship',
    delivery_region: 'NCR',

    recipient_name: 'Juan Dela Cruz',

    delivery_address:
      '123 Sample Street, Barangay Example, Quezon City',

    delivery_note:
      'Please call before delivery.',

    payment_method: 'e-wallet',
    payment_provider: 'GCash',
    sender_name: 'Juan Dela Cruz',
    reference_number: 'GCASH-38472910',

    payment_proof_url: null,
    payment_proof_file_name:
      'order-001-payment.jpg',

    admin_note: null,
    reviewed_at: null,
    approved_at: null,

    submitted_at: '2026-09-21T05:30:00.000Z',
    updated_at: '2026-09-21T05:30:00.000Z',
  },

  {
    id: 'order-002',
    order_number: 'YP-2026-0002',

    customer_id: 'customer-002',
    customer_name: 'Maria Santos',
    customer_email: 'maria@example.com',
    customer_mobile: '09181234567',
    customer_type: 'member',

    status: 'pending-verification',

    items: [
      {
        id: 'order-item-002',
        product_id: 'sample-women-01',
        product_name: 'Sample 2',
        product_category: "Women's Collection",
        product_image_url: null,

        pricing_type: 'member',

        quantity: 1,
        unit_price: 149,
        unit_cost: 90,
        line_total: 149,
      },

      {
        id: 'order-item-003',
        product_id: 'sample-men-02',
        product_name: 'Sample 3',
        product_category: "Men's Collection",
        product_image_url: null,

        pricing_type: 'member',

        quantity: 1,
        unit_price: 149,
        unit_cost: 90,
        line_total: 149,
      },
    ],

    item_count: 2,
    subtotal: 298,
    delivery_fee: 0,
    total_amount: 298,

    fulfillment_type: 'dropship',
    delivery_region: 'LUZON',

    recipient_name: 'Maria Santos',

    delivery_address:
      '45 Sample Avenue, Barangay Test, Calamba, Laguna',

    delivery_note: '',

    payment_method: 'bank-transfer',
    payment_provider: 'BDO',
    sender_name: 'Maria Santos',
    reference_number: 'BDO-72910483',

    payment_proof_url: null,
    payment_proof_file_name:
      'order-002-payment.png',

    admin_note: null,
    reviewed_at: null,
    approved_at: null,

    submitted_at: '2026-09-21T06:15:00.000Z',
    updated_at: '2026-09-21T06:15:00.000Z',
  },

  {
    id: 'order-003',
    order_number: 'YP-2026-0003',

    customer_id: 'customer-003',
    customer_name: 'Carlo Reyes',
    customer_email: 'carlo@example.com',
    customer_mobile: '09191234567',
    customer_type: 'regular',

    status: 'processing',

    items: [
      {
        id: 'order-item-004',
        product_id: 'sample-women-02',
        product_name: 'Sample 4',
        product_category: "Women's Collection",
        product_image_url: null,

        pricing_type: 'regular',

        quantity: 3,
        unit_price: 299,
        unit_cost: 90,
        line_total: 897,
      },
    ],

    item_count: 3,
    subtotal: 897,
    delivery_fee: 0,
    total_amount: 897,

    fulfillment_type: 'dropship',
    delivery_region: 'VISAYAS',

    recipient_name: 'Carlo Reyes',

    delivery_address:
      '78 Demo Road, Barangay Sample, Cebu City',

    delivery_note:
      'Deliver during office hours.',

    payment_method: 'e-wallet',
    payment_provider: 'Maya',
    sender_name: 'Carlo Reyes',
    reference_number: 'MAYA-91827463',

    payment_proof_url: null,
    payment_proof_file_name:
      'order-003-payment.webp',

    admin_note:
      'Payment verified. Prepare items for shipment.',

    reviewed_at: '2026-09-21T07:10:00.000Z',
    approved_at: '2026-09-21T07:10:00.000Z',

    submitted_at: '2026-09-20T09:45:00.000Z',
    updated_at: '2026-09-21T07:10:00.000Z',
  },
]

export const orderStatusLabels = {
  'pending-verification': 'Pending Verification',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
}

export const fulfillmentTypeLabels = {
  dropship: 'Dropship Delivery',
  pickup: 'Pickup',
}

export const orderPaymentMethodLabels = {
  'e-wallet': 'E-wallet',
  'bank-transfer': 'Bank Transfer',
}

export const customerTypeLabels = {
  regular: 'Regular Customer',
  member: 'Member',
}

export const pricingTypeLabels = {
  regular: 'Regular Price',
  member: 'Member Price',
}