import { IProduct } from "./iproduct"

export interface ICart {
  _id: string
  cartOwner: string
  products: Product[]
  createdAt: string
  updatedAt: string
  __v: number
  totalCartPrice: number
}

export interface Product {
  count: number
  _id: string
  product: IProduct
  price: number
}
