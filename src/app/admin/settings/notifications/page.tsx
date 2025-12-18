'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NotificationSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you and your customers receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
            <h3 className="text-lg font-medium mb-4">Customer Notifications</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="order-confirmation" className="flex flex-col space-y-1">
                        <span>Order Confirmation</span>
                        <span className="text-xs font-normal text-muted-foreground">Sent to customers after they place an order.</span>
                    </Label>
                    <Switch id="order-confirmation" defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="shipping-update" className="flex flex-col space-y-1">
                        <span>Shipping Update</span>
                        <span className="text-xs font-normal text-muted-foreground">Sent when an order's shipping status is updated.</span>
                    </Label>
                    <Switch id="shipping-update" defaultChecked />
                </div>
            </div>
        </div>
         <div>
            <h3 className="text-lg font-medium mb-4">Admin Notifications</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="new-order-admin" className="flex flex-col space-y-1">
                        <span>New Order</span>
                        <span className="text-xs font-normal text-muted-foreground">Receive an email when a new order is placed.</span>
                    </Label>
                    <Switch id="new-order-admin" defaultChecked />
                </div>
            </div>
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
