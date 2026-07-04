"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/utils";

export default function GantiSandiPage() {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword);
  
  const isValidPassword = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSymbol;
  const isMatch = newPassword === confirmPassword && newPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Kata sandi saat ini harus diisi.");
      return;
    }

    if (!isValidPassword) {
      setError("Kata sandi baru tidak memenuhi kriteria keamanan.");
      return;
    }

    if (!isMatch) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengubah kata sandi");
      }
      
      // Jika berhasil, langsung alihkan ke halaman profile tanpa jeda popup
      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean, text: string }) => (
    <div className={`flex items-center text-sm ${isValid ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
      {isValid ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2 opacity-50" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Perbarui Kata Sandi</h1>
          <p className="text-muted-foreground mt-1">Tingkatkan keamanan akun Anda dengan kata sandi yang kuat.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Formulir Keamanan</CardTitle>
          <CardDescription>Kata sandi Anda akan langsung diperbarui secara aman di database.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
              <div className="relative">
                <Input 
                  id="currentPassword" 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10 h-11"
                  placeholder="Masukkan sandi saat ini"
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* New Passwords */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                  <div className="relative">
                    <Input 
                      id="newPassword" 
                      type={showNew ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10 h-11"
                      placeholder="Sandi baru"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirm ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 h-11"
                      placeholder="Ulangi sandi baru"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Validation Criteria */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-foreground mb-3">Kriteria Keamanan:</h4>
                <ValidationItem isValid={hasMinLength} text="Minimal 8 karakter" />
                <ValidationItem isValid={hasUppercase} text="Ada huruf kapital (A-Z)" />
                <ValidationItem isValid={hasLowercase} text="Ada huruf kecil (a-z)" />
                <ValidationItem isValid={hasNumber} text="Ada angka (0-9)" />
                <ValidationItem isValid={hasSymbol} text="Ada simbol khusus (!@#...)" />
                <div className="pt-2 border-t border-border mt-2">
                  <ValidationItem isValid={isMatch} text="Konfirmasi sandi cocok" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button 
                type="submit" 
                className="w-full bg-[#567134] hover:bg-[#455b2a] text-white h-11 rounded-lg font-medium transition-colors"
                disabled={isLoading || !isValidPassword || !isMatch || !currentPassword}
              >
                {isLoading ? "Memproses..." : "Simpan & Perbarui Sandi"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
