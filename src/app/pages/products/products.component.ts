import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductItemComponent } from "../../shared/components/ui/product-item/product-item.component";

@Component({
  selector: 'app-products',
  imports: [ProductItemComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  private readonly productsService = inject(ProductsService);
  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
      }
    })
  }
}
