import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/orderService/order-service';

@Component({
  selector: 'app-admin-order',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin-order.html',
  styleUrl: './admin-order.css',
})
export class AdminOrder {
  updateStatusForm!: FormGroup;
  updatePaymentForm!: FormGroup;
  showUpdateStatus: boolean = false;
  showUpdatePayment: boolean = false;

  listOfOrders: any[] = [];
  filteredOrders: any[] = [];

  // Filter properties
  searchText: string = '';
  selectedStatus: string = '';

  constructor(private _orderService: OrderService, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadOrders();

    this.updateStatusForm = this.fb.group({
      OrderId: ['', Validators.required],
      Status: ['', Validators.required]
    });

    this.updatePaymentForm = this.fb.group({
      OrderId: ['', Validators.required],
      PaymentStatus: ['', Validators.required]
    });
  }

  loadOrders() {
    this._orderService.getAllOrders().subscribe({
      next: (data) => {
        this.listOfOrders = data;
        this.applyFilters();
      },
      error: (err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  applyFilters() {
    let result = this.listOfOrders;

    if (this.selectedStatus) {
      result = result.filter(o => o.status?.toLowerCase() === this.selectedStatus.toLowerCase());
    }

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase().trim();
      result = result.filter(o =>
        o.orderId.toString().includes(q) ||
        o.receiverName?.toLowerCase().includes(q) ||
        o.phone?.includes(q)
      );
    }

    this.filteredOrders = result;
    this.cd.detectChanges();
  }

  openCloseUpdateStatusModal() {
    this.showUpdateStatus = !this.showUpdateStatus;
  }

  openCloseUpdatePaymentModal() {
    this.showUpdatePayment = !this.showUpdatePayment;
  }

  updateOrderStatus() {
    if (this.updateStatusForm.invalid) {
      this.updateStatusForm.markAllAsTouched();
      alert("Vui lòng chọn đơn hàng và trạng thái");
      return;
    }

    this._orderService.updateOrderStatus(this.updateStatusForm.value).subscribe({
      next: (data) => {
        console.log(data);
        alert("Cập nhật trạng thái đơn hàng thành công");
        this.loadOrders();
      },
      error: (err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  updatePaymentStatus() {
    if (this.updatePaymentForm.invalid) {
      this.updatePaymentForm.markAllAsTouched();
      alert("Vui lòng chọn đơn hàng và trạng thái thanh toán");
      return;
    }

    const payload = {
      orderId: Number(this.updatePaymentForm.value.OrderId),
      paymentStatus: this.updatePaymentForm.value.PaymentStatus
    };

    this._orderService.updatePaymentStatus(payload).subscribe({
      next: (data) => {
        alert("Cập nhật trạng thái thanh toán thành công");
        this.showUpdatePayment = false;
        this.loadOrders();
      },
      error: (err) => {
        alert("Lỗi: " + (err.error?.message || "Cập nhật không thành công"));
      }
    });
  }

  getStatusBadge(status: string): { label: string, color: string } {
    switch (status?.toLowerCase()) {
      case 'pending': return { label: 'CHỜ XÁC NHẬN', color: '#f59e0b' };
      case 'approved': return { label: 'ĐÃ XÁC NHẬN', color: '#00d4ff' };
      case 'shipping': return { label: 'ĐANG GIAO HÀNG', color: '#a78bfa' };
      case 'completed': return { label: 'HOÀN THÀNH', color: '#34d399' };
      case 'cancelled': return { label: 'ĐÃ HỦY', color: '#ff3d5a' };
      default: return { label: status, color: '#8888aa' };
    }
  }

  getPaymentStatusColor(status: string): string {
    if (status?.toLowerCase() === 'paid' || status?.toLowerCase() === 'đã thanh toán') return 'text-green-500';
    if (status?.toLowerCase() === 'chờ xác nhận') return 'text-[#00d4ff]';
    return 'text-[#f59e0b]';
  }
}
