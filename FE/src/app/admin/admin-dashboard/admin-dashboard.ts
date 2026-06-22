import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/orderService/order-service';
import { AccountService } from '../../services/accountService/account-service';
import { ProductService } from '../../services/productService/product-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  totalRevenue: number = 0;
  totalOrders: number = 0;
  totalUsers: number = 0;
  lowStockCount: number = 0;
  recentOrders: any[] = [];

  // Monthly revenue filter variables
  allOrders: any[] = [];
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  monthlyRevenue: number = 0;

  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years: number[] = [2024, 2025, 2026, 2027];

  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.allOrders = orders;
        this.totalOrders = orders.length;
        
        // Calculate all-time revenue (only completed or approved/paid orders)
        // Wait, for simplicity, sum all non-cancelled orders totalAmount or all orders.
        // Let's sum all orders except Cancelled ones
        this.totalRevenue = orders
          .filter((o: any) => o.status.toLowerCase() !== 'cancelled')
          .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

        this.calculateMonthlyRevenue();

        // Filter for pending orders (unapproved) and sort by date/id descending
        this.recentOrders = orders
          .filter((o: any) => o.status.toLowerCase() === 'pending')
          .sort((a: any, b: any) => b.orderId - a.orderId);
        this.cd.detectChanges();
      }
    })

    this.accountService.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      }
    });

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.lowStockCount = products.filter((p: any) => p.quantity < 5).length;
      }
    });
  }

  calculateMonthlyRevenue() {
    this.monthlyRevenue = this.allOrders
      .filter((o: any) => {
        if (o.status.toLowerCase() === 'cancelled') return false;
        const date = new Date(o.createdAt);
        return (date.getMonth() + 1) === Number(this.selectedMonth) && date.getFullYear() === Number(this.selectedYear);
      })
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);
    
    this.cd.detectChanges()
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
