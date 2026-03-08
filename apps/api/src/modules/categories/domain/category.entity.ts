export interface Category {
  _id?: string;
  name: string;
  slug: string;
  parentId: string | null;
  path: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
