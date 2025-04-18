export interface Customer {
  id?: number;
  "name": string,
  "address": string,
  "email": string,
  "num_of_orders"?: number,
  "num_of_items"?: number,
  "outstanding"?: number,
  "phone": string,
  "revenue"?: number
}

export interface CustomerMeasurementImage {
  id: string;
  url: string;
  full_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerMeasurement {
  id: string;
  code: string;
  length: number;
  waist: number;
  chest: number;
  collar: number;
  shoulder: number;
  sleeveLength: number;
  upperSleeveRim: number;
  lowerSleeveRim: number;
  thigh: number;
  knee: number;
  foot: number;
  hip: number;
  armLength: number;
  cuff: number;
  kriss: number;
  createdAt: string;
  updatedAt: string;
  images: CustomerMeasurementImage[];
}

