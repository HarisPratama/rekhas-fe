import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {AnimationLoader, LottieComponent} from 'ngx-lottie'; // Lottie file

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  imports: [CommonModule, ButtonModule, LottieComponent],
  providers: [AnimationLoader]
})
export class UnauthorizedComponent {
  lottieOptions = {
    path: 'assets/lottie/unauthorized.json',
    renderer: 'svg' as const,
    loop: true,
    autoplay: true,
  };

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
