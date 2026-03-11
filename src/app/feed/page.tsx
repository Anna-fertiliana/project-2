"use client";

import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";

export default function FeedPage() {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-4">
        <Feed />
      </main>

      <BottomNav />

    </div>
  );
}