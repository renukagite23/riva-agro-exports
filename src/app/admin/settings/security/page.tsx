'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SecuritySettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your store's security options.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="2fa-enabled" className="flex flex-col space-y-1">
                <span>Two-Factor Authentication (2FA)</span>
                <span className="text-xs font-normal text-muted-foreground">Require a second verification step for admin logins.</span>
            </Label>
            <Switch id="2fa-enabled" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="min-password-length">Minimum Admin Password Length</Label>
            <Input id="min-password-length" type="number" defaultValue="12" className="w-32" />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
