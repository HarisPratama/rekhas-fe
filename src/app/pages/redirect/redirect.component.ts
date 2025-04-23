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
    const user = JSON.parse(userStr || '{}');
    if (!userStr) {
      this.router.navigate(['/login']);
    }
    switch (user?.role?.name) {
      case "DIRECTOR":
        return this.router.navigate(['/stock']);
      case "OFFICE":
        return this.router.navigate(['/stock']);
      case "SALES":
        return this.router.navigate(['/product']);
      case "CUTTER":
        return this.router.navigate(['/product']);
      case "TAILOR":
        return this.router.navigate(['/product']);
      case "COURIER":
        return this.router.navigate(['/delivery']);
      default:
        return this.router.navigate(['/login']);
    }
  }
}
