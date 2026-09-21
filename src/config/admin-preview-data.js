export const membershipApplications = [
    {
      id: 'membership-app-001',
      customer_id: 'customer-001',
      customer_name: 'Juan Dela Cruz',
      customer_email: 'juan@example.com',
      customer_mobile: '09171234567',
  
      package_id: 'builder',
      amount: 5000,
  
      status: 'pending-verification',
  
      payment_method: 'e-wallet',
      payment_provider: 'GCash',
      sender_name: 'Juan Dela Cruz',
      reference_number: 'GCASH-48290175',
      payment_proof_url: null,
      payment_proof_file_name: 'payment-proof-builder.jpg',
  
      cancellation_reason: null,
      refund_status: null,
  
      submitted_at: '2026-09-21T02:30:00.000Z',
      updated_at: '2026-09-21T02:30:00.000Z',
    },
  
    {
      id: 'membership-app-002',
      customer_id: 'customer-002',
      customer_name: 'Maria Santos',
      customer_email: 'maria@example.com',
      customer_mobile: '09181234567',
  
      package_id: 'prestige',
      amount: 50000,
  
      status: 'pending-verification',
  
      payment_method: 'bank-transfer',
      payment_provider: 'BDO',
      sender_name: 'Maria Santos',
      reference_number: 'BDO-73918420',
      payment_proof_url: null,
      payment_proof_file_name: 'payment-proof-prestige.png',
  
      cancellation_reason: null,
      refund_status: null,
  
      submitted_at: '2026-09-21T03:15:00.000Z',
      updated_at: '2026-09-21T03:15:00.000Z',
    },
  
    {
      id: 'membership-app-003',
      customer_id: 'customer-003',
      customer_name: 'Carlo Reyes',
      customer_email: 'carlo@example.com',
      customer_mobile: '09191234567',
  
      package_id: 'starter',
      amount: 1000,
  
      status: 'cancellation-requested',
  
      payment_method: 'e-wallet',
      payment_provider: 'Maya',
      sender_name: 'Carlo Reyes',
      reference_number: 'MAYA-19463827',
      payment_proof_url: null,
      payment_proof_file_name: 'payment-proof-starter.webp',
  
      cancellation_reason:
        'I selected the wrong package and would like to cancel my application.',
  
      refund_status: 'manual-review',
  
      submitted_at: '2026-09-20T08:45:00.000Z',
      updated_at: '2026-09-21T04:10:00.000Z',
    },
  ]
  
  export const membershipStatusLabels = {
    'awaiting-payment': 'Awaiting Payment',
    'pending-verification': 'Pending Verification',
    'cancellation-requested': 'Cancellation Requested',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  }
  
  export const paymentMethodLabels = {
    'e-wallet': 'E-wallet',
    'bank-transfer': 'Bank Transfer',
  }