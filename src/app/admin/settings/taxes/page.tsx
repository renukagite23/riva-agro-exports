'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function TaxSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax & Compliance</CardTitle>
        <CardDescription>Manage tax rates and compliance settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="auto-tax" className="flex flex-col space-y-1">
                <span>Automate Tax Calculation</span>
                <span className="text-xs font-normal text-muted-foreground">Automatically calculate taxes at checkout.</span>
            </Label>
            <Switch id="auto-tax" defaultChecked />
        </div>
         <div className="space-y-2">
            <Label htmlFor="gst-number">GST Number</Label>
            <Input id="gst-number" placeholder="e.g., 22AAAAA0000A1Z5" />
        </div>
         <div className="space-y-2">
            <Label htmlFor="default-tax-rate">Default Tax Rate (%)</Label>
            <Input id="default-tax-rate" type="number" defaultValue="18" className="w-32" />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
