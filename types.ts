import React from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Urban = 'urban',
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  sizes: number[];
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface RegionComponent {
  id: string;
  component: React.ComponentType;
}
