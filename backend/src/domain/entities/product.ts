export interface ProductProps {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  brandId: string | null;
  categoryId: string;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  constructor(private readonly props: ProductProps) {}

  get id() {
    return this.props.id;
  }

  get sku() {
    return this.props.sku;
  }

  get name() {
    return this.props.name;
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get price() {
    return this.props.price;
  }

  get isActive() {
    return this.props.isActive;
  }

  toPrimitives(): ProductProps {
    return { ...this.props };
  }
}
