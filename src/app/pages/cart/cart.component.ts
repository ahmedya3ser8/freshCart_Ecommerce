import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  imports: [DatePipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartProducts: ICart = <ICart>{};
  cartProductsCount: number = 0;
  dicount: number = 10;
  payment: string = 'online';
  date: Date = new Date();
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  ngOnInit(): void {
    this.getAllCartProducts();
  }
  getAllCartProducts(): void {
    this.cartService.getAllCartProducts().subscribe({
      next: (res) => {
        this.cartProductsCount = res.numOfCartItems;
        this.cartProducts = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  updateQuantity(id: string, quantity: number): void {
    this.cartService.updateCartProductQuantity(id, quantity).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartProducts = res.data;
          this.toastrService.success('quantity updated successfully');
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  removeProduct(id: string): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeProductFromCart(id).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.cartProductsCount = res.numOfCartItems;
              this.cartProducts = res.data;
              Swal.fire({
                title: "Deleted!",
                text: "Your product has been deleted.",
                icon: "success"
              });
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    });
  }
  clearCart(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart().subscribe({
          next: (res) => {
            if (res.message === 'success') {
              this.cartProductsCount = 0;
              this.cartProducts = {} as ICart;
              Swal.fire({
                title: "Deleted!",
                text: "Your All Products has been deleted.",
                icon: "success"
              });
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    });
  }
  paymentMethod(event: Event): void {
    let e = (event.target as HTMLSelectElement).value;
    this.payment = e;
  }
  calculateDiscount() {
    return ((this.cartProducts.totalCartPrice / 100) * this.dicount).toFixed(2);
  }
  calculateTotal() {
    return (this.cartProducts.totalCartPrice - (this.cartProducts.totalCartPrice / 100) * this.dicount).toFixed(2);
  }
}
