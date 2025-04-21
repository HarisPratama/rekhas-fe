import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {UserService} from '../../services/user/user.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {InputOtpModule} from 'primeng/inputotp';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputOtpModule, ToastModule, ButtonModule, DividerModule, InputNumberModule, InputGroupModule, InputGroupAddonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent {
  hash: string = '';
  otp = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
  verifyOtp: boolean = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private messageService: MessageService, private router: Router) {
    this.form = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,13}$/)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const phoneNumber = '62' + this.form.value.phone;
      console.log('Submit phone:', phoneNumber);
      this.userService.loginByWhatsApp(phoneNumber)
      .subscribe({
        next: (resp) => {
          console.log(resp)
          this.verifyOtp = true;
          if (resp?.hash) {
            this.hash = resp.hash;
            this.messageService.add({detail: 'The otp successfully send to your whatsapp'});
          }
        },
        error: err => {
          this.messageService.add({detail: err?.error?.message || 'Failed to login', severity: 'error'});
        }
      })
    }
  }

  submitOtp() {
    if (this.otp.valid && this.otp.value) {
      console.log(this.otp.value)
      console.log(this.hash)
      this.userService.verifyOtp(this.hash, this.otp.value)
      .subscribe({
        next: (resp) => {
          if (resp?.accessToken) {
            localStorage.setItem('accessToken', resp.accessToken);
            localStorage.setItem('user', JSON.stringify(resp.user));
            this.router.navigate(['/']);
          }
        },
        error: err => {
          this.messageService.add({detail: err?.error?.message || 'Failed to login'});
        }
      })
    }
  }
}
