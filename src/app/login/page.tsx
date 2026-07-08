import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="container min-h-[calc(100vh-var(--navbar-height)-300px)] flex items-center justify-center py-20">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-brand)] mb-2">
            Sharod<span className="text-[var(--text-gold)]">Darshan</span>
          </h1>
          <p className="text-[var(--text-secondary)] font-medium">
            Welcome back to the visual directory
          </p>
        </div>
        
        <LoginForm />
        
        <p className="text-center text-sm text-[var(--text-tertiary)] mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
