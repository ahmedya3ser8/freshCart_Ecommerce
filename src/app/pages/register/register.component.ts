import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ErrorMessageComponent } from "../../shared/components/ui/error-message/error-message.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, ErrorMessageComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  errorMsg: string = '';
  toggleInput: boolean = false;
  subscription: Subscription = new Subscription();
  registerForm!: FormGroup;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)]],
      rePassword: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
    }, { validators: this.confirmPassword });
  }
  register() {
    console.log(this.registerForm);
    if (this.registerForm.valid) {
      this.loading = true;
      this.subscription = this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          if(res.message === 'success') {
            this.router.navigateByUrl(`/login`);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.errorMsg = err.error.message;
        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    if (password === rePassword) {
      return null;
    } else {
      return {mismatch: true};
    }
  }
  toggle(): void {
    this.toggleInput = !this.toggleInput;
  }
  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get rePassword() {
    return this.registerForm.get('rePassword');
  }
  get phone() {
    return this.registerForm.get('phone');
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
