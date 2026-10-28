import { createClient } from 'supabase'

function getSecretKey() {
  const legacyKey =
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (legacyKey) {
    return legacyKey
  }

  const rawKeyMap =
    Deno.env.get('SUPABASE_SECRET_KEYS')

  if (!rawKeyMap) {
    throw new Error(
      'Missing Supabase secret key.',
    )
  }

  const keyMap =
    JSON.parse(rawKeyMap)

  const selectedKey =
    keyMap.default ||
    Object.values(keyMap)[0]

  if (typeof selectedKey !== 'string') {
    throw new Error(
      'Invalid Supabase secret key.',
    )
  }

  return selectedKey
}

async function cleanupTable(
  supabase: ReturnType<typeof createClient>,
  tableName: 'orders' | 'membership_applications',
) {
  const cutoff =
    new Date(
      Date.now() -
        15 * 24 * 60 * 60 * 1000,
    ).toISOString()

  const {
    data: rows,
    error: selectError,
  } = await supabase
    .from(tableName)
    .select(
      'id, payment_proof_path, payment_proof_uploaded_at',
    )
    .not('payment_proof_path', 'is', null)
    .is('payment_proof_deleted_at', null)
    .lte(
      'payment_proof_uploaded_at',
      cutoff,
    )
    .limit(100)

  if (selectError) {
    throw selectError
  }

  let deleted = 0
  let failed = 0

  for (const row of rows || []) {
    const proofPath =
      row.payment_proof_path

    if (!proofPath) {
      continue
    }

    const {
      error: storageError,
    } = await supabase.storage
      .from('payment-proofs')
      .remove([proofPath])

    if (storageError) {
      console.error(
        `Failed to delete ${tableName} proof:`,
        row.id,
        storageError,
      )

      failed += 1
      continue
    }

    const {
      error: updateError,
    } = await supabase
      .from(tableName)
      .update({
        payment_proof_path: null,
      })
      .eq('id', row.id)
      .eq(
        'payment_proof_path',
        proofPath,
      )

    if (updateError) {
      console.error(
        `Failed to clear ${tableName} proof path:`,
        row.id,
        updateError,
      )

      failed += 1
      continue
    }

    deleted += 1
  }

  return {
    checked: rows?.length || 0,
    deleted,
    failed,
  }
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return Response.json(
      {
        error: 'Method not allowed.',
      },
      {
        status: 405,
      },
    )
  }

  const expectedSecret =
    Deno.env.get('CLEANUP_CRON_SECRET')

  const suppliedSecret =
    request.headers.get(
      'x-cleanup-secret',
    )

  if (
    !expectedSecret ||
    suppliedSecret !== expectedSecret
  ) {
    return Response.json(
      {
        error: 'Unauthorized.',
      },
      {
        status: 401,
      },
    )
  }

  try {
    const supabaseUrl =
      Deno.env.get('SUPABASE_URL')

    if (!supabaseUrl) {
      throw new Error(
        'Missing SUPABASE_URL.',
      )
    }

    const supabase =
      createClient(
        supabaseUrl,
        getSecretKey(),
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      )

    const orders =
      await cleanupTable(
        supabase,
        'orders',
      )

    const memberships =
      await cleanupTable(
        supabase,
        'membership_applications',
      )

    return Response.json({
      success: true,
      retention_days: 15,
      orders,
      membership_applications:
        memberships,
    })
  } catch (error) {
    console.error(
      'Payment proof cleanup failed:',
      error,
    )

    return Response.json(
      {
        success: false,
        error:
          'Payment proof cleanup failed.',
      },
      {
        status: 500,
      },
    )
  }
})
