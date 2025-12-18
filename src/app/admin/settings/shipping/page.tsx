'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ShippingSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping & Logistics</CardTitle>
        <CardDescription>Set up shipping zones and rates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Shipping Zones</h3>
                <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Zone
                </Button>
            </div>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Zone Name</TableHead>
                            <TableHead>Regions</TableHead>
                            <TableHead>Shipping Rate</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Domestic</TableCell>
                            <TableCell>India</TableCell>
                            <TableCell>₹50.00 (Standard)</TableCell>
                             <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>International</TableCell>
                            <TableCell>USA, UK, Canada</TableCell>
                            <TableCell>₹1500.00 (Standard)</TableCell>
                             <TableCell className="text-right">
                                 <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
