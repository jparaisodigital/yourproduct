import { createClient } from 'supabase'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(
  body: unknown,
  status = 200,
) {
  return new Response(
    JSON.stringify(body),
    {
      status,

      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    },
  )
}

function getProjectKey(
  legacyVariable: string,
  keyMapVariable: string,
) {
  const legacyKey =
    Deno.env.get(legacyVariable)

  if (legacyKey) {
    return legacyKey
  }

  const rawKeyMap =
    Deno.env.get(keyMapVariable)

  if (!rawKeyMap) {
    throw new Error(
      `Missing ${keyMapVariable}.`,
    )
  }

  const keyMap =
    JSON.parse(rawKeyMap)

  const selectedKey =
    keyMap.default ||
    Object.values(keyMap)[0]

  if (typeof selectedKey !== 'string') {
    throw new Error(
      `Invalid ${keyMapVariable}.`,
    )
  }

  return selectedKey
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(
      'ok',
      {
        headers: corsHeaders,
      },
    )
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      {
        error: 'Method not allowed.',
      },
      405,
    )
  }

  try {
    const {
      username,
      password,
    } = await request.json()

    const normalizedUsername =
      String(username || '')
        .trim()
        .toLowerCase()

    if (
      !/^[a-z0-9_]{3,30}$/.test(
        normalizedUsername,
      ) ||
      typeof password !== 'string' ||
      password.length < 8
    ) {
      return jsonResponse(
        {
          error:
            'Invalid username or password.',
        },
        400,
      )
    }

    const supabaseUrl =
      Deno.env.get('SUPABASE_URL')

    if (!supabaseUrl) {
      throw new Error(
        'Missing SUPABASE_URL.',
      )
    }

    const secretKey =
      getProjectKey(
        'SUPABASE_SERVICE_ROLE_KEY',
        'SUPABASE_SECRET_KEYS',
      )

    const publishableKey =
      getProjectKey(
        'SUPABASE_ANON_KEY',
        'SUPABASE_PUBLISHABLE_KEYS',
      )

    const adminClient =
      createClient(
        supabaseUrl,
        secretKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      )

    const {
      data: profile,
      error: profileError,
    } = await adminClient
      .from('profiles')
      .select('email')
      .eq(
        'username',
        normalizedUsername,
      )
      .maybeSingle()

    if (
      profileError ||
      !profile?.email
    ) {
      return jsonResponse(
        {
          error:
            'Invalid username or password.',
        },
        400,
      )
    }

    const authClient =
      createClient(
        supabaseUrl,
        publishableKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      )

    const {
      data,
      error,
    } =
      await authClient.auth
        .signInWithPassword({
          email: profile.email,
          password,
        })

    if (
      error ||
      !data.session
    ) {
      return jsonResponse(
        {
          error:
            'Invalid username or password.',
        },
        400,
      )
    }

    return jsonResponse({
      access_token:
        data.session.access_token,

      refresh_token:
        data.session.refresh_token,
    })
  } catch (error) {
    console.error(
      'Username login failed:',
      error,
    )

    return jsonResponse(
      {
        error:
          'Unable to sign in right now.',
      },
      500,
    )
  }
})