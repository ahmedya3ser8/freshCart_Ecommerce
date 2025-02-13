import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../../interfaces/iproduct';
import { CartService } from '../../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-item',
  imports: [RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  product = input.required<IProduct>();
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  addToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message);
        }
      }
    })
  }
}
