import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CouponService } from '../../services/couponService/coupon-service';

@Component({
  selector: 'app-user-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-cart.html',
  styleUrl: './user-cart.css',
})
export class UserCart implements OnInit {
  cartItems: any[] = [];
  couponCode: string = '';
  appliedCoupon: any = null;
  discountAmount: number = 0;

  constructor(
    private couponService: CouponService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.loadCoupon();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.recalcDiscount();
  }

  changeQty(index: number, change: number) {
    this.cartItems[index].qty += change;
    if (this.cartItems[index].qty <= 0) {
      this.cartItems.splice(index, 1);
    }
    this.saveCart();
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.saveCart();
  }

  getPrice(item: any): number {
    return item.discountPrice ? item.price - item.discountPrice : item.price;
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + this.getPrice(item) * item.qty, 0);
  }

  getFinalTotal(): number {
    return Math.max(0, this.getSubtotal() - this.discountAmount);
  }

  applyCoupon() {
    if (!this.couponCode.trim()) {
      alert('Vui lòng nhập mã giảm giá!');
      return;
    }

    this.couponService.getAllCoupons().subscribe({
      next: (coupons) => {
        const match = coupons.find((c: any) => c.code.toLowerCase() === this.couponCode.toLowerCase().trim());
        if (!match) {
          alert('Mã giảm giá không chính xác!');
          return;
        }

        const now = new Date();
        const start = new Date(match.startDate);
        const end = new Date(match.endDate);
        if (now < start) {
          alert('Mã giảm giá chưa đến thời gian áp dụng!');
          return;
        }
        if (now > end || !match.isActive) {
          alert('Mã giảm giá đã hết hạn hoặc ngưng hoạt động!');
          return;
        }

        const subtotal = this.getSubtotal();
        if (subtotal < match.minOrderAmount) {
          alert('Đơn hàng tối thiểu để áp dụng mã giảm giá này là ' + match.minOrderAmount.toLocaleString() + '₫');
          return;
        }

        this.appliedCoupon = match;
        localStorage.setItem('appliedCoupon', JSON.stringify(match));
        this.recalcDiscount();
        
        const label = match.discountType === 'Percent' ? match.discountValue + '%' : match.discountValue.toLocaleString() + '₫';
        alert('Áp dụng mã giảm giá thành công! Giảm ' + label);
        this.cd.detectChanges();
      },
      error: () => alert('Lỗi khi lấy thông tin mã giảm giá!')
    });
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.couponCode = '';
    this.discountAmount = 0;
    localStorage.removeItem('appliedCoupon');
    this.cd.detectChanges();
  }

  loadCoupon() {
    const saved = localStorage.getItem('appliedCoupon');
    if (saved) {
      this.appliedCoupon = JSON.parse(saved);
      this.couponCode = this.appliedCoupon.code;
      this.recalcDiscount();
    }
  }

  recalcDiscount() {
    if (!this.appliedCoupon) {
      this.discountAmount = 0;
      this.cd.detectChanges();
      return;
    }
    const subtotal = this.getSubtotal();
    
    // Check min order amount again
    if (subtotal < this.appliedCoupon.minOrderAmount) {
      this.discountAmount = 0;
      this.cd.detectChanges();
      return;
    }

    if (this.appliedCoupon.discountType === 'Percent') {
      let calc = (subtotal * this.appliedCoupon.discountValue) / 100;
      if (this.appliedCoupon.maxDiscountAmount && this.appliedCoupon.maxDiscountAmount > 0) {
        calc = Math.min(calc, this.appliedCoupon.maxDiscountAmount);
      }
      this.discountAmount = calc;
    } else {
      // Fixed
      this.discountAmount = Math.min(subtotal, this.appliedCoupon.discountValue);
    }
    this.cd.detectChanges();
  }

  goCheckout() {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng đang trống!');
      return;
    }
    this.router.navigate(['/user/checkout']);
  }
}
