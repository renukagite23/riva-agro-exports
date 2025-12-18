'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GeneralSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your store's general settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="store-name">Store Name</Label>
          <Input id="store-name" defaultValue="Riva Agro Exports" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="store-email">Contact Email</Label>
          <Input id="store-email" type="email" defaultValue="contact@rivaagro.com" />
        </div>
         <div className="space-y-2">
            <Label htmlFor="currency">Store Currency</Label>
            <Select defaultValue="INR">
                <SelectTrigger id="currency" className="w-full md:w-1/2">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
            </Select>
         </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
