import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-redirect',
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.css'
})
export class RedirectComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
    const userStr  = localStorage.getItem('user');
    const user = JSON.parse(userStr || '');
    switch (user?.role?.name) {
      case "DIRECTOR":
        throw this.router.navigate(['/']);
      case "OFFICE":
        throw this.router.navigate(['/']);
      case "SALES":
        throw this.router.navigate(['/product']);
      case "CUTTER":
        throw this.router.navigate(['/product']);
      case "TAILOR":
        throw this.router.navigate(['/product']);
      case "COURIER":
        throw this.router.navigate(['/delivery']);
      default:
        throw this.router.navigate(['/login']);
    }
  }
}
