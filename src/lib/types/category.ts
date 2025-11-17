export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
  display_order?: number;
  subcategories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

