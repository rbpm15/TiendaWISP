export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get fullName() {
    return this.props.fullName;
  }

  get role() {
    return this.props.role;
  }

  get isActive() {
    return this.props.isActive;
  }

  toPrimitives(): UserProps {
    return { ...this.props };
  }
}
