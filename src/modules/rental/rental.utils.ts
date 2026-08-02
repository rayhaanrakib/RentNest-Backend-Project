export const CREATE_REQUEST = {
  id: true,
  moveInDate: true,
  duration: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  property: {
    select: {
      id: true,
      title: true,
      rentAmount: true,
      address: true,
    },
  },
};

export const ALL_RENTAL_REQUESTS = {
  id: true,
  moveInDate: true,
  duration: true,
  message: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  property: {
    select: {
      id: true,
      title: true,
      rentAmount: true,
      address: true,
      city: true,
      images: true,
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  },
  payment: {
    select: { id: true, status: true, amount: true, paidAt: true },
  },
};

export const RENTAL_REQUEST_DETAIL = {
  id: true,
  moveInDate: true,
  duration: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  property: {
    select: {
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
    },
  },
  payment: {
    select: {
      id: true,
      status: true,
      amount: true,
      paidAt: true,
    },
  },
};

export const LANDLORD_RENTAL_REQUESTS_DETAIL = {
  status: true,
  id: true,
  moveInDate: true,
  duration: true,
  message: true,
  createdAt: true,
  updatedAt: true,
  property: {
    select: {
      id: true,
      title: true,
      rentAmount: true,
      address: true,
      city: true,
      images: true,
    },
  },
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  payment: {
    select: { id: true, status: true, amount: true, paidAt: true },
  },
};
export const LANDLORD_ALL_RENTAL_REQUESTS = {
  status: true,
  id: true,
  property: {
    select: {
      id: true,
      title: true,
      rentAmount: true,
      address: true,
    },
  },
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  payment: {
    select: { id: true, status: true, amount: true, paidAt: true },
  },
};
