import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client (Service Role)
// If SERVICE_ROLE_KEY is missing, it falls back to ANON key (which might fail RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const { proposalId, partnerName, date, time, message } = await request.json();

        if (!proposalId) {
            return NextResponse.json({ error: "Missing Proposal ID" }, { status: 400 });
        }

        console.log("Processing Response for:", proposalId);

        // 1. Securely Update the Proposal in Database
        const { error: updateError } = await supabase
            .from('proposals')
            .update({
                response_date: date,
                response_time: time,
                response_message: message,
            })
            .eq('id', proposalId);

        if (updateError) {
            console.error("Supabase Update Error:", updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
