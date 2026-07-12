export interface Ride {
  platform: string;
  vehicle: string | null;
  capacity: number | null;
  eta: string | null;
  description: string | null;

  price: number | null;
  originalPrice: number | null;
  discount: number | null;

  currency: string;
  image: string | null;
  priceText: string;
}