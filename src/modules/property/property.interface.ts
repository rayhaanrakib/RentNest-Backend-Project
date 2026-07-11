import { PropertyStatus } from "../../../generated/prisma/enums";

export interface ICreatePropertyPayload {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  rentAmount: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  status?: PropertyStatus;

  // Foreign Keys
  landlordId: string;
  categoryId: string;
}

export interface IUpdatePropertyPayload {
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  rentAmount?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  images?: string[];
  status?: PropertyStatus;
  categoryId?: string;
}

export interface IPropertyListQuery {
  // Location
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Filters
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  amenities?: string;
  status?: PropertyStatus;

  // Search
  search?: string;

  // Pagination & Sorting
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
