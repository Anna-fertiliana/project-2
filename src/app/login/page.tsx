import AuthCard from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-purple-900">
      <AuthCard
        title="Welcome Back!"
        buttonText="Login"
        footerText="Don't have an account?"
        footerLink="/register"
        footerLinkText="Register"
      />
    </main>
  );
}