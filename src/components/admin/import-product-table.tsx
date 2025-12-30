'use client';

import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export function ImportProductTable({ data, onEdit, onDelete }: any) {
  return (
    <table className="w-full border text-sm">
      <thead className="bg-muted">
        <tr>
          <th>Image</th>
          <th>Category</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Shipping</th>
          <th>Tax</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d: any) => (
          <tr key={d._id} className="border-t">
            <td>
              {d.images?.[0] && (
                <img src={d.images[0]} className="h-10 w-10 rounded" />
              )}
            </td>
            <td>{d.categoryName}</td>
            <td>{d.productName}</td>
            <td>{d.totalQuantity}</td>
            <td>{d.purchasePrice}</td>
            <td>{d.shippingCost}</td>
            <td>{d.taxAmount}</td>
            <td className="flex gap-2">
              <Eye className="h-4 cursor-pointer" />
              <Pencil className="h-4 cursor-pointer" onClick={() => onEdit(d)} />
              <Trash2 className="h-4 cursor-pointer" onClick={() => onDelete(d._id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
