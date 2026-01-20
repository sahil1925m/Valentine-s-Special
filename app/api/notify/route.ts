import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase Admin Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { proposalId, partnerName, message, date } = await request.json();

        if (!proposalId) {
            return NextResponse.json({ error: "Missing Proposal ID" }, { status: 400 });
        }

        // 1. Fetch the Proposal to get the Creator's Email
        const { data: proposal, error: fetchError } = await supabase
            .from("proposals")
            .select("creator_email, partner_name, email_sent")
            .eq("id", proposalId)
            .single();

        if (fetchError || !proposal) {
            // Don't block the user experience - just log and return success
            console.warn("Could not fetch proposal for email notification:", fetchError?.message || "No data");
            return NextResponse.json({ success: true, skipped: "proposal_not_found" });
        }

        // 2. Check if email was already sent (prevent spam)
        if (proposal.email_sent) {
            console.log("Email already sent for this proposal. Skipping.");
            return NextResponse.json({ success: true, alreadySent: true });
        }

        const creatorEmail = proposal.creator_email;
        const recipientName = proposal.partner_name || partnerName;

        // 3. If no creator email was provided, just log and return success
        if (!creatorEmail) {
            console.log("No creator email found. Skipping notification.");
            return NextResponse.json({ success: true, noEmail: true });
        }

        // 4. If RESEND_API_KEY is missing, simulate success
        if (!process.env.RESEND_API_KEY) {
            console.log("MOCK EMAIL SENT:", { to: creatorEmail, partnerName: recipientName, message, date });
            return NextResponse.json({ success: true, mock: true });
        }

        // 5. Send the email notification
        const { data, error } = await resend.emails.send({
            from: "Cupid <onboarding@resend.dev>",
            to: creatorEmail,
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
                            <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">📅 <strong>Date:</strong> ${date || "Not specified"}</p>
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

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error }, { status: 500 });
        }

        // 6. Mark email as sent to prevent duplicate sends
        await supabase
            .from("proposals")
            .update({ email_sent: true })
            .eq("id", proposalId);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
