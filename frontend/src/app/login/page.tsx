"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTransitionContext } from "@/components/RouteTransitionProvider";

export default function LoginPage() {
  const router = useRouter();
  const { startTransition } = useTransitionContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      // Login berhasil, simpan sesi
      sessionStorage.setItem("isAuth", "true");
      
      // Munculkan loading screen animasi rumah
      startTransition();

      // Jeda 1200ms untuk memastikan animasi rumah (1.1s) sudah selesai digambar mulus 
      // sebelum Next.js memblokir memori utama untuk memuat halaman dashboard.
      setTimeout(() => {
        router.push("/");
      }, 1200);
      
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] dark:bg-background relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 w-full max-w-[400px] p-4">
        <div className="bg-white dark:bg-card rounded-2xl border border-zinc-200 dark:border-border shadow-xl shadow-black/5 overflow-hidden">
          
          {/* Main Form Content */}
          <div className="p-6 pt-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-medium text-xs">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email address" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-lg border-zinc-200 dark:border-border placeholder:text-zinc-400 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-300"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-medium text-xs">Password</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-lg border-zinc-200 dark:border-border pr-10 placeholder:text-zinc-400 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-300"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm font-medium text-red-500 text-center">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-[#18181b] hover:bg-[#27272a] text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
