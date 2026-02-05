import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing Supabase environment variables for account deletion')
            return NextResponse.json(
                { error: 'Server configuration error. Contact support.' },
                { status: 500 }
            )
        }

        // Initialize regular client to verify the user's session
        const supabase = createClient(supabaseUrl, supabaseAnonKey!)
        const { data: { user }, error: authError } = await supabase.auth.getUser(
            request.headers.get('Authorization')?.split(' ')[1] || ''
        )

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Initialize admin client to delete the user from auth.users
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

        if (deleteError) {
            console.error('Error deleting user from Auth:', deleteError)
            return NextResponse.json({ error: deleteError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Account deleted permanently' })
    } catch (err: any) {
        console.error('Unexpected error during account deletion:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
