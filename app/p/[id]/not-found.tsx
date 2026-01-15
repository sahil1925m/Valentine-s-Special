import Link from "next/link";
import { Heart, HeartCrack } from "lucide-react";

export default function NotFound() {
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
