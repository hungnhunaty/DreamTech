import { Component } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return localStorage.getItem('userInfo') !== null;
  }

  getUserName(): string {
    const info = localStorage.getItem('userInfo');
    if (info) {
      return JSON.parse(info).fullName || '';
    }
    return '';
  }

  isAdmin(): boolean {
    const info = localStorage.getItem('userInfo');
    if (info) {
      return JSON.parse(info).role?.toLowerCase() === 'admin';
    }
    return false;
  }

  logout() {
    localStorage.removeItem('userInfo');
    alert("Đăng xuất thành công!");
    this.router.navigate(['/login']);
  }
}
