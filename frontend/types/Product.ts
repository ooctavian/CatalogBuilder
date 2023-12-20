export type Product = {
  uuid: string;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateProduct = Omit<
  Product,
  "uuid" | "createdAt" | "updatedAt" | "imageUrls"
>;

export interface UpdateProduct {
  name?: string;
  description?: string;
  imageUrls?: string[];
  price: number;
  url?: string;
}
