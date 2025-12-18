'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function PaymentSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
        <CardDescription>Configure your payment gateways.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
                <Label htmlFor="stripe-active" className="text-lg font-medium">Stripe</Label>
                <Switch id="stripe-active" defaultChecked />
            </div>
            <div className="space-y-2">
                <Label htmlFor="stripe-pk">Publishable Key</Label>
                <Input id="stripe-pk" placeholder="pk_live_..." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="stripe-sk">Secret Key</Label>
                <Input id="stripe-sk" type="password" placeholder="••••••••••••••••" />
            </div>
        </div>

         <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
                <Label htmlFor="razorpay-active" className="text-lg font-medium">Razorpay</Label>
                <Switch id="razorpay-active" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="razorpay-key-id">Key ID</Label>
                <Input id="razorpay-key-id" placeholder="rzp_live_..." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="razorpay-key-secret">Key Secret</Label>
                <Input id="razorpay-key-secret" type="password" placeholder="••••••••••••••••" />
            </div>
        </div>

        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
