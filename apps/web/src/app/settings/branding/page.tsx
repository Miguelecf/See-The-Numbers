'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';

const DEFAULT_BRANDING = {
  storeName: 'SeeTheNumbers',
  profileImage: '',
};

export default function BrandingSettingsPage() {
  const [storeName, setStoreName] = useState(DEFAULT_BRANDING.storeName);
  const [profileImage, setProfileImage] = useState(DEFAULT_BRANDING.profileImage);

  useEffect(() => {
    const saved = localStorage.getItem('stn-branding');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setStoreName(parsed.storeName || DEFAULT_BRANDING.storeName);
      setProfileImage(parsed.profileImage || DEFAULT_BRANDING.profileImage);
    } catch {
      setStoreName(DEFAULT_BRANDING.storeName);
      setProfileImage(DEFAULT_BRANDING.profileImage);
    }
  }, []);

  const handleImageFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setProfileImage(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const saveBranding = () => {
    localStorage.setItem(
      'stn-branding',
      JSON.stringify({
        storeName: storeName.trim() || DEFAULT_BRANDING.storeName,
        profileImage,
      })
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Identidad del local"
        text="Personaliza nombre y foto para el menú principal"
      />

      <Card className="max-w-2xl rounded-3xl border-white/40 bg-white/60 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="store-name">Nombre del local</Label>
            <Input id="store-name" value={storeName} maxLength={15} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-image">Foto de perfil</Label>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
              }}
            />
            <p className="text-xs text-muted-foreground">Se guarda localmente en este equipo.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-auto min-w-[4rem] px-4 items-center justify-center overflow-hidden rounded-2xl bg-primary/90 text-primary-foreground">
              {profileImage ? (
                <img src={profileImage} alt={storeName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-semibold">{storeName.slice(0, 15)}</span>
              )}
            </div>
            <Button className="rounded-2xl" onClick={saveBranding}>
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
