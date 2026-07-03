"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Check, X, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function GantiSandiPage() {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword);
  
  const isValidPassword = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSymbol;
  const isMatch = newPassword === confirmPassword && newPassword !== "";

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate network request and hashing
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Redirect back after 2 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    }, 1500);
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
          <CardDescription>Kata sandi Anda akan dienkripsi menggunakan metode hashing terkini.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Sandi Berhasil Diperbarui!</h3>
              <p className="text-muted-foreground max-w-sm">Kata sandi Anda telah berhasil di-hash dan disimpan dengan aman. Mengalihkan kembali ke profil...</p>
            </div>
          ) : (
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
                    className="pr-10"
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
                        className="pr-10"
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
                        className="pr-10"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading || !isValidPassword || !isMatch || !currentPassword}
                >
                  {isLoading ? "Memproses Hashing..." : "Simpan & Enkripsi Sandi"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
