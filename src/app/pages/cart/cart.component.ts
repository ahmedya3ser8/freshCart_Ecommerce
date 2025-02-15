import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';

@Component({
  selector: 'app-cart',
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  cartProducts: ICart = <ICart>{};
  cartProductsCount: number = 0;
  dicount: number = 10;
  payment: string = 'online';
  date: Date = new Date();
  subscriptions: Subscription[] = [];
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  ngOnInit(): void {
    this.getAllCartProducts();
  }
  getAllCartProducts(): void {
    this.subscriptions.push(this.cartService.getAllCartProducts().subscribe({
      next: (res) => {
        this.cartProductsCount = res.numOfCartItems;
        this.cartProducts = res.data;
      }
    }))
  }
  updateQuantity(id: string, quantity: number): void {
    this.subscriptions.push(this.cartService.updateCartProductQuantity(id, quantity).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartProducts = res.data;
          this.toastrService.success('quantity updated successfully');
        }
      }
    }))
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
        this.subscriptions.push(this.cartService.removeProductFromCart(id).subscribe({
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
          }
        }))
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
        this.subscriptions.push(this.cartService.clearCart().subscribe({
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
          }
        }))
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
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
