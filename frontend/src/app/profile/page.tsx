"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, LogOut, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("isAuth");
    router.push("/login");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Profil Pengelola</h1>
        <p className="text-muted-foreground mt-1">Kelola informasi akun dan pengaturan sistem Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm md:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20 mb-4">
              A
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-6">Admin KostMan</h3>
            
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="nama" defaultValue="Admin KostMan" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" defaultValue="admin@kost.com" className="pl-10" disabled />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-semibold mb-4">Ganti Kata Sandi</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Pindahkan ke halaman pengaturan kata sandi untuk memperbarui kredensial login Anda dengan sistem keamanan (hashing) kami.
              </p>
              <Button 
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
