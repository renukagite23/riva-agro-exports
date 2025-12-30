import { Schema, model, models } from 'mongoose';

const ImportProductSchema = new Schema(
  {
    categoryId: String,
    categoryName: String,

    productId: String,
    productName: String,

    totalQuantity: Number,
    purchasePrice: Number,
    shippingCost: Number,
    taxAmount: Number,

    images: [String],
  },
  { timestamps: true }
);

export const ImportProduct =
  models.ImportProduct || model('ImportProduct', ImportProductSchema);
