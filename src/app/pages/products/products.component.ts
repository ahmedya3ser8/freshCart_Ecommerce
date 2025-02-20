import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductItemComponent } from "../../shared/components/ui/product-item/product-item.component";
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [ProductItemComponent, SearchPipe, FormsModule, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  subscription!: Subscription;
  searchInput!: string;
  page: number = 1;
  limit: number = 10;
  total!: number;
  private readonly productsService = inject(ProductsService);
  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts(): void {
    this.subscription = this.productsService.getAllProducts(this.page, this.limit).subscribe({
      next: (res) => {
        this.total = res.results;
        this.products = res.data;
      }
    })
  }
  changePage(event: any) {
    this.page = event;
    this.getAllProducts();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
