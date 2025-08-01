import { Product } from '@/types/product';
import { Stock } from '@/types/stock';
import { Order } from '@/types/order';
import { User } from '@/types/user';

/**
 * Filter products by various criteria
 */
export function filterProducts(
  products: Product[],
  filters: {
    search?: string;
    category?: string;
    isActive?: boolean;
    priceRange?: { min?: number; max?: number };
  }
): Product[] {
  return products.filter((product) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Active status filter
    if (filters.isActive !== undefined && product.isActive !== filters.isActive) {
      return false;
    }

    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined && product.price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== undefined && product.price > filters.priceRange.max) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter stock items by criteria
 */
export function filterStock(
  stock: Stock[],
  filters: {
    search?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
  }
): Stock[] {
  return stock.filter((item) => {
    // Search filter (by product name if available)
    if (filters.search && item.product) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = item.product.name.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Low stock filter
    if (filters.lowStock && item.quantity > item.minQuantity) {
      return false;
    }

    // Out of stock filter
    if (filters.outOfStock && item.quantity > 0) {
      return false;
    }

    return true;
  });
}

/**
 * Filter orders by criteria
 */
export function filterOrders(
  orders: Order[],
  filters: {
    status?: string;
    dateRange?: { start?: Date; end?: Date };
    minTotal?: number;
  }
): Order[] {
  return orders.filter((order) => {
    // Status filter
    if (filters.status && order.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const orderDate = new Date(order.createdAt);
      if (filters.dateRange.start && orderDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && orderDate > filters.dateRange.end) {
        return false;
      }
    }

    // Minimum total filter
    if (filters.minTotal !== undefined && order.total < filters.minTotal) {
      return false;
    }

    return true;
  });
}

/**
 * Filter users by criteria
 */
export function filterUsers(
  users: User[],
  filters: {
    search?: string;
    role?: string;
    isActive?: boolean;
  }
): User[] {
  return users.filter((user) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters.role && user.role !== filters.role) {
      return false;
    }

    // Active status filter
    if (filters.isActive !== undefined && user.isActive !== filters.isActive) {
      return false;
    }

    return true;
  });
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}
