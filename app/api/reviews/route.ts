import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with Service Role Key for admin privileges (bypassing RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, designation, rating, message } = body;

        // Basic validation
        if (!name || !message || !rating) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { data, error } = await supabaseAdmin
            .from("reviews")
            .insert({
                name,
                designation: designation || "Student",
                rating,
                message,
                // created_at is auto-generated
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase Write Error:", error);

            // Check for specific error codes
            // 42P01: undefined_table (Table does not exist)
            if (error.code === "42P01") {
                return NextResponse.json(
                    { error: "Database table 'reviews' not found. Please run the setup SQL script." },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { error: error.message || "Failed to submit review" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });

    } catch (e: any) {
        console.error("Review API Error:", e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Optional: Get reviews via API if client-side fails
    const { data, error } = await supabaseAdmin
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
