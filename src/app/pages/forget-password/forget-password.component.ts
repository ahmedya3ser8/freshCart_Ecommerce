import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessageComponent } from "../../shared/components/ui/error-message/error-message.component";

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
  errorMsg: string = '';
  step: number = 1;
  toggleInput: boolean = false;
  verifyEmailForm!: FormGroup;
  verifyCodeForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  ngOnInit(): void {
    this.verifyEmailForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
    this.verifyCodeForm = this.formBuilder.group({
      resetCode: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
    this.resetPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      newPassword: [null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)]]
    });
  }
  submitVerifyEmail() {
    if (this.verifyEmailForm.valid) {
      const emailValue = this.verifyEmail?.value;
      this.resetEmail?.patchValue(emailValue);
      this.errorMsg = '';
      this.authService.verifyEmail(this.verifyEmailForm.value).subscribe({
        next: (res) => {
          if (res.statusMsg === 'success') {
            this.step = 2;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error.message.split(" ", 9).join(" ");
        }
      })
    } else {
      this.verifyEmailForm.markAllAsTouched();
    }
  }
  submitVerifyCode() {
    if (this.verifyCodeForm.valid) {
      this.errorMsg = '';
      this.authService.verifyCode(this.verifyCodeForm.value).subscribe({
        next: (res) => {
          if (res.status === 'Success') {
            this.step = 3;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error.message;
        }
      })
    } else {
      this.verifyCodeForm.markAllAsTouched();
    }
  }
  submitResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.errorMsg = '';
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res) => {
          localStorage.setItem("token", res.token);
          this.authService.getUserData();
          this.router.navigateByUrl('/home');
        }
      })
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
  toggle(): void {
    this.toggleInput = !this.toggleInput;
  }
  get verifyEmail() {
    return this.verifyEmailForm.get('email');
  }
  get resetCode() {
    return this.verifyCodeForm.get('resetCode');
  }
  get resetEmail() {
    return this.resetPasswordForm.get('email');
  }
  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }
}
