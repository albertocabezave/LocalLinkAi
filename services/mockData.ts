
import type { Business, Driver } from '../types';

export const mockBusinesses: Business[] = [
  { id: 'b1', name: 'Panadería La Andina', category: 'Bakery', location: { lat: 8.625, lng: -71.645 } },
  { id: 'b2', name: 'Farmacia El Sol', category: 'Pharmacy', location: { lat: 8.618, lng: -71.65 } },
  { id: 'b3', name: 'Supermercado Gigante', category: 'Grocery', location: { lat: 8.61, lng: -71.658 } },
  { id: 'b4', name: 'Pizzería Napolitana', category: 'Restaurant', location: { lat: 8.605, lng: -71.642 } },
];

export const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Carlos Pérez',
    rating: 4.8,
    vehicle: { businessId: 'b3', model: 'Bera SBR', plate: 'AC1D23G' },
    location: { lat: 8.611, lng: -71.657 }
  },
  {
    id: 'd2',
    name: 'Ana García',
    rating: 4.9,
    vehicle: { businessId: 'b4', model: 'Empire Horse', plate: 'AB2E45H' },
    location: { lat: 8.606, lng: -71.641 }
  },
  {
    id: 'd3',
    name: 'Luis Rodríguez',
    rating: 4.7,
    vehicle: { businessId: 'b1', model: 'Skygo 150', plate: 'AD3F67I' },
    location: { lat: 8.624, lng: -71.646 }
  },
  {
    id: 'd4',
    name: 'Maria Hernandez',
    rating: 5.0,
    vehicle: { businessId: 'b2', model: 'Suzuki GN 125', plate: 'AE4G89J' },
    location: { lat: 8.619, lng: -71.651 }
  },
];
