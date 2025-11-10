import React from "react";

export enum Theme {
  Light = "light",
  Dark = "dark",
  Urban = "urban",
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  sizes: number[];
  image: string;
  description: string;
}

export interface User {
  id: string;
  username: string;
  role: "user" | "admin";
  token: string;
}

export interface CartItem extends Product {
  quantity: number;
  size?: number;
}

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingService: ShippingService;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "completed" | "cancelled";
  statusHistory: StatusHistory[];
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  size: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface ShippingService {
  name: string;
  cost: number;
  estimatedDays: string;
}

export interface StatusHistory {
  status: string;
  note: string;
  updatedAt: string;
}

export interface RegionComponent {
  id: string;
  component: React.ComponentType;
}
