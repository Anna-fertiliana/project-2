import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";

export default function Home() {
  return (
    <>
      <Navbar />

      <main
        className="
          max-w-xl
          mx-auto
          px-4
          pt-24
          pb-28
          md:max-w-2xl
          min-h-screen
        "
      >
        <Feed />
      </main>
    </>
  );
}