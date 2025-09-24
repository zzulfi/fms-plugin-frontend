import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "../../contexts/AuthContext"
import logoImg from '/image.png'
import textLogo from '/logo.png'

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      // Redirect based on user access level
      if (result.user.accessLevel === 'Full') {
        navigate('/admin')
      } else {
        navigate('/team')
      }
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  className,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className={"flex flex-row items-center justify-center gap-3"}>
          <img src={logoImg} alt="Festie Logo" className='w-10' />
          <img src={textLogo} alt="Festie Text Logo" className='w-24' />
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="cursor-pointer w-full bg-yellow-400 hover:bg-yellow-300 text-white" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" className="w-full hidden" type="button">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
            <div className="mt-4 text-center text-sm">
              <p className="mb-2 text-gray-600">Demo Credentials:</p>
              <p className="text-xs text-gray-500">
                Admin: admin@example.com / admin123<br />
                Team Lead: team1@example.com / user123
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}