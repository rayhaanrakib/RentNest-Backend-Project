import { Prisma } from "../../../generated/prisma/client";
import { IPropertyListQuery } from "./property.interface";

// PROPERTY SELECT DATA
export const SPECIFIC_PROPERTY_SELECT = {
  id: true,
  title: true,
  description: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  rentAmount: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  amenities: true,
  images: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  landlord: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      reviews: true,
      rentals: true,
    },
  },
};
export const CREATE_PROPERTY_SELECT = {
  id: true,
  title: true,
  city: true,
  rentAmount: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  status: true,
  landlord: {
    select: {
      id: true,
      name: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};
export const ALL_PROPERTY_SELECT = {
  id: true,
  title: true,
  address: true,
  city: true,
  state: true,
  rentAmount: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  status: true,
  landlord: {
    select: {
      id: true,
      name: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};
export const UPDATE_PROPERTY_SELECT = {
  id: true,
  title: true,
  description: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  rentAmount: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  amenities: true,
  images: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

// SEARCH AND FILTERING CLAUSE
export const BUILD_PROPERTY_CLAUSE = (
  query: IPropertyListQuery,
): Prisma.PropertyWhereInput => {
  const where: Prisma.PropertyWhereInput = {};

  // Location
  if (query.address) {
    where.address = {
      contains: query.address,
      mode: "insensitive",
    };
  }

  if (query.city) {
    where.city = {
      contains: query.city,
      mode: "insensitive",
    };
  }

  if (query.state) {
    where.state = {
      contains: query.state,
      mode: "insensitive",
    };
  }

  if (query.zipCode) {
    where.zipCode = {
      contains: query.zipCode,
      mode: "insensitive",
    };
  }

  if (query.country) {
    where.country = {
      contains: query.country,
      mode: "insensitive",
    };
  }

  // Price Range
  if (query.minPrice || query.maxPrice) {
    where.rentAmount = {};

    if (query.minPrice) {
      where.rentAmount.gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      where.rentAmount.lte = Number(query.maxPrice);
    }
  }

  // Property Type
  if (query.category) {
    where.category = {
      name: {
        equals: query.category,
        mode: "insensitive",
      },
    };
  }

  // Bedrooms
  if (query.bedrooms) {
    where.bedrooms = Number(query.bedrooms);
  }

  // Amenities
  if (query.amenities) {
    where.amenities = {
      hasEvery: query.amenities.split(",").map((item) => item.trim()),
    };
  }

  // Status
  if (query.status) {
    where.status = query.status;
  }

  // Search
  if (query.search) {
    where.title = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  return where;
};

export const BUILD_PROPERTY_ORDER_BY_CLAUSE = (
  query: IPropertyListQuery,
): Prisma.PropertyOrderByWithRelationInput => ({
  [query.sortBy || "createdAt"]: query.sortOrder || "desc",
});
