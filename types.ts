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
}

export interface RegionComponent {
  id: string;
  component: React.ComponentType;
}
