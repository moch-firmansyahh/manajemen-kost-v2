"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, LogOut, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile`);
        if (res.ok) {
          const data = await res.json();
          setNama(data.nama);
          setEmail(data.email);
          localStorage.setItem("adminName", data.nama);
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isAuth");
    localStorage.removeItem("isAuth");
    router.push("/login");
  };

  // Ambil inisial nama pengelola
  const getInitial = (name: string) => {
    if (!name) return "A";
    return name.trim().charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#567134]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Profil Pengelola</h1>
        <p className="text-muted-foreground mt-1">Kelola informasi akun dan pengaturan sistem Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm md:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#567134] to-[#7c9e50] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#567134]/20 mb-4">
              {getInitial(nama)}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-6">{nama || "Admin Kost"}</h3>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar (Logout)
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="nama" 
                      value={nama} 
                      className="pl-10 h-11 bg-muted/50 cursor-not-allowed" 
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Alamat Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      className="pl-10 h-11 bg-muted/50 cursor-not-allowed" 
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border">
              <h4 className="text-sm font-semibold mb-2">Ganti Kata Sandi</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Pindahkan ke halaman pengaturan kata sandi untuk memperbarui kredensial login Anda dengan sistem keamanan kami.
              </p>
              <Button 
                asChild
                className="bg-[#567134] hover:bg-[#455b2a] text-white h-11 px-6 rounded-lg transition-colors font-medium"
              >
                <Link href="/profile/ganti-sandi">
                  <Key className="mr-2 h-4 w-4" />
                  Perbarui Kata Sandi
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
