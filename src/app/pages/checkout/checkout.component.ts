import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessageComponent } from "../../shared/components/ui/error-message/error-message.component";

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  loading: boolean = false;
  errorMsg: string = '';
  currentId: string = '';
  payment: string = '';
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  checkoutForm!: FormGroup;
  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: [null, [Validators.required]]
    });
    this.activatedRoute.queryParamMap.subscribe({
      next: (params) => {
        this.payment = params.get('payment')!;
      }
    });
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.currentId = paramMap.get('id')!;
      }
    });
  }
  checkoutOnline(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      this.cartService.checkoutOnline(this.currentId, this.checkoutForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toastrService.success('order has been done!');
            open(res.session.url, '_self');
            this.loading = false;
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err;
        }
      })
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
  checkoutCash(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      this.cartService.checkoutCash(this.currentId, this.checkoutForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.loading = false;
            this.toastrService.success('order has been done!');
            this.router.navigateByUrl(`/allorders`);
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err;
        }
      })
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
  get details() {
    return this.checkoutForm.get('details');
  }
  get phone() {
    return this.checkoutForm.get('phone');
  }
  get city() {
    return this.checkoutForm.get('city');
  }
}
