import { IOrder } from './../../shared/interfaces/iorder';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-all-orders',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit {
  products: IOrder[] = [];
  private readonly cartService = inject(CartService);
  userId = localStorage.getItem('userId')?.toString()!;
  ngOnInit(): void {
    this.cartService.getUserOrders(this.userId).subscribe({
      next: (res) => {
        this.cartService.cartCount.set(0);
        this.products = res;
      }
    })
  }
}
