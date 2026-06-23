import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Kiểm tra token hết hạn chưa
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() > payload.exp * 1000;
  } catch {
    return true;
  }
}

// Guard cho User
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userInfo = localStorage.getItem('userInfo');

  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.token && !isTokenExpired(parsed.token)) {
      return true;
    }
    localStorage.removeItem('userInfo');
    alert('Phiên đăng nhập đã hết hạn!');
  } else {
    alert('Vui lòng đăng nhập!');
  }

  router.navigate(['/login']);
  return false;
};

// Guard cho Admin
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userInfo = localStorage.getItem('userInfo');

  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.token && !isTokenExpired(parsed.token) && parsed.role?.toLowerCase() === 'admin') {
      return true;
    }
    localStorage.removeItem('userInfo');
  }

  alert('Bạn không có quyền truy cập!');
  router.navigate(['/login']);
  return false;
};
