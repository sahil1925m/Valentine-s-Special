"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreatorForm } from "@/components/CreatorForm";
import { ScrollyCanvas } from "@/components/ScrollyCanvas";
import { Overlay } from "@/components/Overlay";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ProposalSection } from "@/components/ProposalSection";
import { Preloader } from "@/components/Preloader";
import { SocialUnlockModal } from "@/components/SocialUnlockModal";
import { SuccessModal } from "@/components/SuccessModal";
import { Slide, ThemeType } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Pencil, Rocket } from "lucide-react";
import { PoetryHero } from "@/components/PoetryHero";

type ViewMode = "FORM" | "PREVIEW" | "SUCCESS";

interface PreviewData {
  partnerName: string;
  introMessage: string;
  slides: Slide[];
  theme: ThemeType;
  files: File[];
}

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("FORM");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [preloaderUnlocked, setPreloaderUnlocked] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [createdProposalId, setCreatedProposalId] = useState<string | null>(null);

  // Handle preview request from form
  const handlePreview = (data: PreviewData) => {
    setPreviewData(data);
    setViewMode("PREVIEW");
    setPreloaderUnlocked(false);
  };

  // Handle social unlock and upload
  const handleCreateLink = async () => {
    if (!previewData || !isSupabaseConfigured()) {
      alert("Supabase is not configured!");
      return;
    }

    setIsUploading(true);

    try {
      const proposalId = crypto.randomUUID();

      // Upload images to Supabase Storage
      const imageUrls: string[] = [];
      for (let i = 0; i < previewData.files.length; i++) {
        const file = previewData.files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${proposalId}/slide-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("valentine-assets")
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Failed to upload: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("valentine-assets")
          .getPublicUrl(fileName);

        imageUrls.push(publicUrlData.publicUrl);
      }

      // Insert into database
      const messages = previewData.slides.map((s) => s.text);
      const { error } = await supabase.from("proposals").insert({
        id: proposalId,
        partner_name: previewData.partnerName,
        intro_message: previewData.introMessage,
        messages,
        image_urls: imageUrls,
        theme: previewData.theme,
      });

      if (error) {
        throw new Error(`Failed to save: ${error.message}`);
      }

      // Success!
      setCreatedProposalId(proposalId);
      setShowSocialModal(false);
      setViewMode("SUCCESS");
    } catch (err) {
      console.error(err);
      alert(`Something went wrong: ${err}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setViewMode("FORM");
    setPreviewData(null);
    setPreloaderUnlocked(false);
    setCreatedProposalId(null);
  };

  // FORM MODE
  if (viewMode === "FORM") {
    return <CreatorForm onPreview={handlePreview} />;
  }

  // SUCCESS MODE
  if (viewMode === "SUCCESS" && createdProposalId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center">
        <SuccessModal proposalId={createdProposalId} onClose={handleReset} />
      </main>
    );
  }

  // PREVIEW MODE
  if (viewMode === "PREVIEW" && previewData) {
    // Show preloader first
    if (!preloaderUnlocked) {
      return <Preloader onUnlock={() => setPreloaderUnlocked(true)} />;
    }

    return (
      <>
        <div className="relative bg-black">
          {/* Section 1: The Tunnel (Images first) */}
          <div className="relative min-h-[400vh]">
            {/* Background Layer */}
            <ScrollyCanvas slides={previewData.slides} theme={previewData.theme} />

            {/* Atmosphere Layer */}
            <FloatingParticles />

            {/* Scrollable Content Layer */}
            <Overlay slides={previewData.slides} />
          </div>

          {/* Section 2: Poetry Hero (The Prologue) - After images */}
          <PoetryHero poem={previewData.introMessage} partnerName={previewData.partnerName} />

          {/* Section 3: Proposals End Section */}
          <ProposalSection
            partnerName={previewData.partnerName}
            onRestart={() => setViewMode("FORM")}
          />
        </div>

        {/* Sticky Bottom Bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-lg border-t border-white/10"
        >
          <div className="max-w-md mx-auto flex gap-3">
            <button
              onClick={() => setViewMode("FORM")}
              className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition flex items-center justify-center gap-2"
            >
              <Pencil size={18} />
              Edit
            </button>
            <button
              onClick={() => setShowSocialModal(true)}
              className="flex-1 py-3 px-4 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition flex items-center justify-center gap-2"
            >
              <Rocket size={18} />
              Create Link
            </button>
          </div>
        </motion.div>

        {/* Social Unlock Modal */}
        <SocialUnlockModal
          isOpen={showSocialModal}
          onClose={() => setShowSocialModal(false)}
          onUnlock={handleCreateLink}
          isUploading={isUploading}
        />
      </>
    );
  }

  return null;
}
