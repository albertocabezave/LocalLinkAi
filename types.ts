
export interface LatLngPosition {
  lat: number;
  lng: number;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  location: LatLngPosition;
}

export interface Vehicle {
  businessId: string;
  model: string;
  plate: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: Vehicle;
  location: LatLngPosition; // Initial location
}

export interface Product {
  id: string;
  name: string;
  price: number;
  businessId: string;
}

export type DeliveryStatus = "Pending" | "Picking up" | "On the way" | "Delivered";
