import { ImageSourcePropType } from "react-native";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  brand: string;
  description: string;
  image: ImageSourcePropType;
  quantity: number;
  inCart: boolean;
}
