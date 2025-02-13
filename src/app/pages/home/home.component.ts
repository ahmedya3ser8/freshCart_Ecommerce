import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { map, Subscription } from 'rxjs';
import { ICategory } from '../../shared/interfaces/icategory';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ProductsService } from '../../core/services/products/products.service';
import { ProductItemComponent } from "../../shared/components/ui/product-item/product-item.component";

@Component({
  selector: 'app-home',
  imports: [CarouselModule, ProductItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  categories: ICategory[] = [];
  subscriptions: Subscription[] = [];
  imagesUrl: string[] = ['/images/img1.avif', '/images/img2.avif', '/images/img3.avif', '/images/img4.avif', '/images/img5.avif', '/images/img6.avif', '/images/img7.avif'];
  customCategoriesOptions: OwlOptions = {
    loop: true,
    margin: 15,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 5
      }
    },
    nav: true
  }
  customMainOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false
  }
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }
  getProducts() {
    this.subscriptions.push(this.productsService.getAllProducts().pipe(map(data => data.data.slice(0, 12))).subscribe({
      next: (res) => {
        this.products = res;
      }
    }))
  }
  getCategories() {
    this.subscriptions.push(this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      }
    }))
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }
}
