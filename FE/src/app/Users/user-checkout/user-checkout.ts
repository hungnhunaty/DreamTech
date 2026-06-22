import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/orderService/order-service';

@Component({
  selector: 'app-user-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-checkout.html',
  styleUrl: './user-checkout.css',
})
export class UserCheckout implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  appliedCoupon: any = null;
  discountAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null');
    this.recalcDiscount();

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.checkoutForm = this.fb.group({
      receiverName: [userInfo.fullName || '', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      paymentMethod: ['COD']
    });
  }

  getPrice(item: any): number {
    return item.discountPrice ? item.price - item.discountPrice : item.price;
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + this.getPrice(item) * item.qty, 0);
  }

  recalcDiscount() {
    if (!this.appliedCoupon) {
      this.discountAmount = 0;
      return;
    }
    const subtotal = this.getSubtotal();
    
    // Check min order amount again
    if (subtotal < this.appliedCoupon.minOrderAmount) {
      this.discountAmount = 0;
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
  }

  getFinalTotal(): number {
    return Math.max(0, this.getSubtotal() - this.discountAmount);
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo.userId || userInfo.userID || userInfo.UserId;

    const payload = {
      userId: userId,
      couponId: this.appliedCoupon ? this.appliedCoupon.couponId : null,
      totalAmount: this.getFinalTotal(),
      discountAmount: this.discountAmount,
      receiverName: this.checkoutForm.value.receiverName,
      phone: this.checkoutForm.value.phone,
      address: this.checkoutForm.value.address,
      paymentMethod: this.checkoutForm.value.paymentMethod,
      orderItems: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.qty,
        unitPrice: this.getPrice(item)
      }))
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        alert('Đặt hàng thành công!');
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedCoupon');
        this.router.navigate(['/user/userDashboard']);
      },
      error: (err) => {
        alert('Đặt hàng thất bại: ' + (err.error?.message || 'Vui lòng thử lại'));
      }
    });
  }
}
