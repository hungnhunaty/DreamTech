import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userInfo = localStorage.getItem('userInfo');

  // Gắn token vào header nếu có
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
  }

  // Nếu backend trả 401 => đá về login
  return next(req).pipe(
    tap({ error: (err) => {
      if (err.status === 401) {
        localStorage.removeItem('userInfo');
        router.navigate(['/login']);
      }
    }})
  );
};
