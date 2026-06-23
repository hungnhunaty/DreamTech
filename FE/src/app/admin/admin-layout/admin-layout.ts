import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AdminHeader } from '../admin-header/admin-header';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AdminHeader],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('userInfo');
    alert("Đăng xuất thành công!");
    this.router.navigate(['/login']);
  }
}
