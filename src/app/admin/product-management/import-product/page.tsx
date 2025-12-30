'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ImportProductModal } from '@/components/admin/import-product-modal';

/* ================= TYPES ================= */

type ImportProduct = {
  _id: string;
  categoryId: string;
  categoryName: string;
  productName: string;
  totalQuantity: number;
  purchasePrice: number;
  shippingCost: number;
  taxAmount: number;
  images: string[];
};

/* ================= PAGE ================= */

export default function ImportProductPage() {
  const [products, setProducts] = React.useState<ImportProduct[]>([]);
  const [loading, setLoading] = React.useState(false);

  /* MODAL STATE */
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('add');
  const [selected, setSelected] = React.useState<ImportProduct | null>(null);

  /* PAGINATION STATE */
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;

  /* ================= FETCH DATA ================= */

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/import-products');
    const data = await res.json();
    setProducts(data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= PAGINATION LOGIC ================= */

  const totalPages = Math.ceil(products.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedProducts = products.slice(startIndex, endIndex);

  /* RESET PAGE WHEN DATA CHANGES */
  React.useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  /* ================= ACTION HANDLERS ================= */

  const openAdd = () => {
    setMode('add');
    setSelected(null);
    setOpen(true);
  };

  const openEdit = (row: ImportProduct) => {
    setMode('edit');
    setSelected(row);
    setOpen(true);
  };

  const openView = (row: ImportProduct) => {
    setMode('view');
    setSelected(row);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this import product?')) return;

    await fetch(`/api/import-products?id=${id}`, {
      method: 'DELETE',
    });

    fetchProducts();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Import Product Management</h2>
        
        <Button onClick={openAdd}>+ Import Product</Button>
      </div>

      {/* TABLE */}
      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-center">Purchase</th>
              <th className="px-4 py-3 text-center">Shipping</th>
              <th className="px-4 py-3 text-center">Tax</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  No import products found
                </td>
              </tr>
            )}

            {paginatedProducts.map((p) => (
              <tr
                key={p._id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                {/* IMAGE */}
                <td className="px-4 py-3">
                  <img
                    src={p.images?.[0] || '/placeholder.png'}
                    alt={p.productName}
                    className="h-10 w-10 rounded border object-cover"
                  />
                </td>

                {/* PRODUCT */}
                <td className="px-4 py-3 font-medium">
                  {p.productName}
                </td>

                {/* CATEGORY */}
                <td className="px-4 py-3">
                  {p.categoryName}
                </td>

                {/* QTY */}
                <td className="px-4 py-3 text-center">
                  {p.totalQuantity}
                </td>

                {/* PURCHASE */}
                <td className="px-4 py-3 text-center">
                  ₹{p.purchasePrice}
                </td>

                {/* SHIPPING */}
                <td className="px-4 py-3 text-center">
                  ₹{p.shippingCost}
                </td>

                {/* TAX */}
                <td className="px-4 py-3 text-center">
                  ₹{p.taxAmount}
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 text-center space-x-3">
                  <Eye
                    className="inline h-4 w-4 cursor-pointer text-gray-600 hover:text-black"
                    onClick={() => openView(p)}
                  />
                  <Pencil
                    className="inline h-4 w-4 cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => openEdit(p)}
                  />
                  <Trash2
                    className="inline h-4 w-4 cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(p._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* MODAL */}
      <ImportProductModal
        open={open}
        mode={mode}
        data={selected}
        onClose={() => setOpen(false)}
        onSaved={fetchProducts}
      />
    </div>
  );
}



// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { ImportProductModal } from '@/components/admin/import-product-modal';
// import { Eye, Pencil } from 'lucide-react';

// /* ================= TYPES ================= */

// type ImportProduct = {
//   _id: string;
//   categoryName: string;
//   productName: string;
//   totalQuantity: number;
//   purchasePrice: number;
// };

// /* ================= PAGE ================= */

// export default function ImportProductPage() {
//   const [products, setProducts] = useState<ImportProduct[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
//   const [selected, setSelected] = useState<any>(null);

//   /* ================= FETCH TABLE DATA ================= */

//   const fetchProducts = async () => {
//     setLoading(true);
//     const res = await fetch('/api/import-products');
//     const data = await res.json();
//     setProducts(data || []);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   /* ================= UI ================= */

//   return (
//     <div className="p-6 space-y-4">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl font-semibold">Import Products</h1>
//         <Button
//           onClick={() => {
//             setMode('add');
//             setSelected(null);
//             setOpen(true);
//           }}
//         >
//           + Import Product
//         </Button>
//       </div>

//       {/* TABLE */}
//       <div className="border rounded-md overflow-hidden bg-white">
//         {loading ? (
//           <p className="p-4 text-sm text-muted-foreground">
//             Loading...
//           </p>
//         ) : products.length === 0 ? (
//           <p className="p-4 text-sm text-muted-foreground">
//             No import products found
//           </p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="px-4 py-2 text-left">Product</th>
//                 <th className="px-4 py-2 text-left">Category</th>
//                 <th className="px-4 py-2 text-right">
//                   Quantity
//                 </th>
//                 <th className="px-4 py-2 text-right">
//                   Purchase Price
//                 </th>
//                 <th className="px-4 py-2 text-center">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.map((p) => (
//                 <tr
//                   key={p._id}
//                   className="border-b last:border-0"
//                 >
//                   <td className="px-4 py-2">
//                     {p.productName}
//                   </td>
//                   <td className="px-4 py-2">
//                     {p.categoryName}
//                   </td>
//                   <td className="px-4 py-2 text-right">
//                     {p.totalQuantity}
//                   </td>
//                   <td className="px-4 py-2 text-right">
//                     ₹{p.purchasePrice}
//                   </td>
//                   <td className="px-4 py-2 text-center space-x-3">
//                     {/* VIEW */}
//                     <Eye
//                       className="inline h-4 w-4 cursor-pointer text-gray-600 hover:text-black"
//                       onClick={() => {
//                         setSelected(p);
//                         setMode('view');
//                         setOpen(true);
//                       }}
//                     />

//                     {/* EDIT */}
//                     <Pencil
//                       className="inline h-4 w-4 cursor-pointer text-gray-600 hover:text-black"
//                       onClick={() => {
//                         setSelected(p);
//                         setMode('edit');
//                         setOpen(true);
//                       }}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* MODAL */}
//       <ImportProductModal
//         open={open}
//         mode={mode}
//         data={selected}
//         onClose={() => setOpen(false)}
//         onSaved={fetchProducts}
//       />
//     </div>
//   );
// }

