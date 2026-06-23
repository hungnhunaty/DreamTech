import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/orderService/order-service';
import { ReviewService } from '../../services/reviewService/review-service';

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {
  orders: any[] = [];
  userId!: number;

  // Review modal variables
  showReviewModal: boolean = false;
  selectedOrder: any = null;
  orderItems: any[] = [];
  selectedProductToReview: any = null;
  newRating: number = 5;
  newComment: string = '';

  constructor(
    private orderService: OrderService,
    private reviewService: ReviewService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userInfo);
    this.userId = user.userId || user.userID || user.UserId;
    this.loadUserOrders();
  }

  loadUserOrders() {
    this.orderService.getOrdersByUser(this.userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Lỗi khi tải lịch sử đơn hàng", err);
      }
    });
  }

  cancelOrder(orderId: number) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      return;
    }

    this.orderService.updateOrderStatus({ orderId: orderId, status: 'Cancelled' }).subscribe({
      next: () => {
        alert('Đã hủy đơn hàng thành công!');
        this.loadUserOrders();
      },
      error: (err) => {
        alert('Hủy đơn hàng thất bại: ' + (err.error?.message || 'Vui lòng thử lại'));
      }
    });
  }

  // Open review modal for an order
  openReviewModal(order: any) {
    this.selectedOrder = order;
    this.orderItems = [];
    this.selectedProductToReview = null;
    this.newComment = '';
    this.newRating = 5;
    this.showReviewModal = true;

    this.orderService.getOrderDetails(order.orderId).subscribe({
      next: (items) => {
        this.orderItems = items;
        this.cd.detectChanges();
      },
      error: (err) => {
        alert('Lỗi khi lấy chi tiết đơn hàng: ' + (err.error?.message || 'Vui lòng thử lại'));
      }
    });
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.selectedOrder = null;
    this.orderItems = [];
    this.selectedProductToReview = null;
    this.newComment = '';
    this.newRating = 5;
  }

  selectProductForReview(item: any) {
    this.selectedProductToReview = item;
    this.newComment = '';
    this.newRating = 5;
  }

  submitReview() {
    if (!this.selectedProductToReview) return;
    if (!this.newComment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá!');
      return;
    }

    const payload = {
      userId: this.userId,
      productId: this.selectedProductToReview.productId,
      rating: this.newRating,
      comment: this.newComment
    };

    this.reviewService.addReview(payload).subscribe({
      next: () => {
        alert('Đánh giá sản phẩm thành công! Cảm ơn ý kiến của bạn.');
        this.selectedProductToReview = null;
        this.newComment = '';
        this.newRating = 5;
        this.cd.detectChanges();
      },
      error: (err) => {
        alert('Đánh giá thất bại: ' + (err.error?.message || 'Vui lòng thử lại'));
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'approved': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'shipping': return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'Chờ xử lý';
      case 'approved': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao hàng';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}
