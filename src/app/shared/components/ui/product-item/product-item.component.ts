import { Component, inject, input, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../../interfaces/iproduct';
import { CartService } from '../../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-item',
  imports: [RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnDestroy {
  product = input.required<IProduct>();
  subscription: Subscription = new Subscription();
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  addToCart(id: string): void {
    this.subscription = this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message);
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
