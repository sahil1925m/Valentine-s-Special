import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Initialize Supabase Admin Client (Service Role)
// If SERVICE_ROLE_KEY is missing, it falls back to ANON key (which might fail RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);

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
                email_sent: false // Reset (or keep) to ensure we can send notification if needed
            })
            .eq('id', proposalId);

        if (updateError) {
            console.error("Supabase Update Error:", updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // 2. Fetch Proposal to get Creator Email
        const { data: proposal, error: fetchError } = await supabase
            .from("proposals")
            .select("creator_email, partner_name, email_sent")
            .eq("id", proposalId)
            .single();

        if (fetchError || !proposal) {
            console.warn("Could not fetch proposal for email:", fetchError);
            return NextResponse.json({ success: true, warning: "Proposal updated but email skipped (no data)" });
        }

        // 3. Send Email Notification (if creator email exists and not already sent)
        if (proposal.creator_email && !proposal.email_sent && process.env.RESEND_API_KEY) {
            const recipientName = proposal.partner_name || partnerName;

            const { error: emailError } = await resend.emails.send({
                from: "Cupid <onboarding@resend.dev>",
                to: proposal.creator_email,
                subject: `💖 ${recipientName} said YES! - Your Valentine Proposal`,
                html: `
                    <div style="font-family: 'Georgia', serif; padding: 30px; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #fff5f5 0%, #fff 100%); border-radius: 16px; border: 1px solid #fecdd3;">
                        <div style="text-align: center; margin-bottom: 24px;">
                            <span style="font-size: 48px;">💘</span>
                            <h1 style="color: #be123c; margin: 16px 0 8px; font-size: 28px;">Congratulations!</h1>
                            <p style="color: #6b7280; margin: 0;">Your Valentine proposal was accepted!</p>
                        </div>
                        
                        <div style="background: white; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #ffe4e6;">
                            <p style="margin: 0 0 16px; color: #374151;">
                                <strong style="color: #be123c;">${recipientName}</strong> just said YES to your proposal!
                            </p>
                            
                            <div style="border-left: 3px solid #f43f5e; padding-left: 16px; margin: 16px 0;">
                                <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">📅 <strong>Date:</strong> ${date} at ${time}</p>
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">💌 <strong>Their message:</strong></p>
                                <p style="margin: 8px 0 0; color: #374151; font-style: italic;">"${message || "No message provided"}"</p>
                            </div>
                        </div>
                        
                        <p style="text-align: center; color: #9ca3af; font-size: 14px; margin-top: 24px;">
                            Time to celebrate! 🎉
                        </p>
                    </div>
                `,
            });

            if (!emailError) {
                // Mark email sent
                await supabase.from("proposals").update({ email_sent: true }).eq("id", proposalId);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
