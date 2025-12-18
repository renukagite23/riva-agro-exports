'use server';

/**
 * @fileOverview Recommends related products based on the currently viewed product.
 *
 * - getProductRecommendations - A function that retrieves product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  currentProductName: z
    .string()
    .describe('The name of the product currently being viewed.'),
  currentProductDescription: z
    .string()
    .describe('The description of the product currently being viewed.'),
  productCategory: z.string().describe('The category of the product.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(z.string())
    .describe('A list of names of recommended products.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(
  input: ProductRecommendationsInput
): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an expert in product recommendations for an e-commerce website.

  Based on the current product being viewed, suggest other products that the user might be interested in.
  Consider the product name, description, and category to provide relevant recommendations.

  Current Product Name: {{{currentProductName}}}
  Current Product Description: {{{currentProductDescription}}}
  Product Category: {{{productCategory}}}

  Please provide a list of product names that would be good recommendations.
  Do not include the current product in the list of recommendations.
  Format the output as a JSON array of strings.`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
