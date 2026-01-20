"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, ProposalRecord, checkSupabaseConfigured } from "@/lib/supabase";
import { ProposalViewer } from "./ProposalViewer";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Heart, HeartCrack } from "lucide-react";
import { ThemeType } from "@/lib/types";

export default function ProposalPage() {
    const params = useParams();
    const id = params.id as string;

    const [proposal, setProposal] = useState<ProposalRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchProposal() {
            if (!id) {
                setError(true);
                setLoading(false);
                return;
            }

            // Wait for Supabase config to load (it fetches from /api/config)
            const isConfigured = await checkSupabaseConfigured();
            if (!isConfigured) {
                console.error("Supabase not configured");
                setError(true);
                setLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from("proposals")
                .select("*")
                .eq("id", id)
                .single();

            if (fetchError || !data) {
                console.error("Error fetching proposal:", fetchError);
                setError(true);
            } else {
                setProposal(data as ProposalRecord);
            }
            setLoading(false);
        }

        fetchProposal();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="text-rose-500 animate-spin" size={48} />
            </div>
        );
    }

    if (error || !proposal) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-8">
                <div className="relative mb-8">
                    <HeartCrack className="text-rose-600 animate-pulse" size={80} />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
                    Heartbreak 💔
                </h1>

                <p className="text-gray-400 text-lg max-w-md mb-8">
                    This proposal doesn't exist or the link may have expired.
                    Perhaps it wasn't meant to be...
                </p>

                <Link
                    href="/"
                    className="px-6 py-3 bg-rose-600 text-white rounded-full font-medium hover:bg-rose-700 transition flex items-center gap-2"
                >
                    <Heart size={18} />
                    Create Your Own Proposal
                </Link>
            </div>
        );
    }

    // Convert to the format our components expect
    const slides = proposal.image_urls.map((url, index) => ({
        id: `slide-${index}`,
        image: url,
        text: proposal.messages[index] || "",
    }));

    return (
        <ProposalViewer
            partnerName={proposal.partner_name}
            partnerGender={proposal.partner_gender as "female" | "male" | "neutral" | undefined}
            introMessage={proposal.intro_message}
            slides={slides}
            theme={proposal.theme as ThemeType | undefined}
            proposalId={proposal.id}
        />
    );
}
