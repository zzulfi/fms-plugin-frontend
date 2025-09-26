import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "../../../shared/utils/utils"
import { Button } from "../../../shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../shared/components/ui/card"
import { Input } from "../../../shared/components/ui/input"
import { Label } from "../../../shared/components/ui/label"
import { useAuth } from "../../../shared/hooks/AuthContext"
import { LoginFormProps } from "../../../shared/types"
import logoImg from '/logo.svg'
import textLogo from '/logo with text.svg'

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin()) {
        navigate('/admin', { replace: true })
      } else {
        navigate('/team', { replace: true })
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate])

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success && result.user) {
      // Redirect based on user role
      if (result.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/team')
      }
    } else {
      setError(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <LoginForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={handleSubmit}
          className=""
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
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-lg">
        <CardHeader className="flex flex-col items-center justify-center gap-6 pt-8 pb-6">
          <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-2xl shadow-inner">
            <img src={logoImg} alt="Festie Logo" className="w-12 h-12 drop-shadow-lg" />
            <img src={textLogo} alt="Festie Text Logo" className="w-28 drop-shadow-lg" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600">Sign in to fest management dashboard</p>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 rounded-xl transition-all duration-200 bg-gray-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required 
                  className="h-12 border-2 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 rounded-xl transition-all duration-200 bg-gray-50/50"
                />
              </div>
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing you in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </div>
                  )}
                </Button>
              </div>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}