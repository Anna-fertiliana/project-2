import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <Feed />
      <BottomNav />
    </main>
  );
}