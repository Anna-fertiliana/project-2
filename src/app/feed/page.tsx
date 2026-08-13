"use client";

import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";


export default function FeedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main
        className="
          flex-1 w-full
          max-w-xl mx-auto
          px-4
          pt-36
          pb-28
          md:max-w-2xl
          md:pt-24
          md:pb-24
        "
      >
        <Feed />
      </main>
    </div>
  );
}