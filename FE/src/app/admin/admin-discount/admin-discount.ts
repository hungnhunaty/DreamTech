import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CouponService } from '../../services/couponService/coupon-service';

@Component({
  selector: 'app-admin-discount',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin-discount.html',
  styleUrl: './admin-discount.css',
})
export class AdminDiscount {
  addCouponForm!:FormGroup;
  updateCouponForm!:FormGroup;

  showAddCoupon: boolean = false;
  showUpdateCoupon: boolean = false;

  listOfCoupons: any[] = [];
  filteredCoupons: any[] = [];

  // Filter properties
  searchText: string = '';
  selectedStatus: string = '';

  constructor(private _couponService:CouponService, private fb:FormBuilder, private cd: ChangeDetectorRef){}

  ngOnInit(){
    this.loadCoupons();

    this.addCouponForm = this.fb.group({
      Code: ['', Validators.required],
      Description: [''],
      DiscountType: ['Percent', Validators.required],
      DiscountValue: ['', Validators.required],
      MinOrderAmount: [0],
      MaxDiscountAmount: [''],
      UsageLimit: [0],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    });

    this.updateCouponForm = this.fb.group({
      CouponId: ['', Validators.required],
      Code: ['', Validators.required],
      Description: [''],
      DiscountType: ['Percent', Validators.required],
      DiscountValue: ['', Validators.required],
      MinOrderAmount: [0],
      MaxDiscountAmount: [''],
      UsageLimit: [0],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      IsActive: [true]
    });
  }

  onSubmit(){
    if(this.addCouponForm.invalid){
      this.addCouponForm.markAllAsTouched();
      alert("Vui lòng nhập đầy đủ thông tin mã khuyến mãi!");
      return;
    }

    this._couponService.addCoupon(this.addCouponForm.value).subscribe({
      next:(data) => {
        console.log(data);
        alert("Thêm mã khuyến mãi thành công");
        this.loadCoupons();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  loadCoupons(){
    this._couponService.getAllCoupons().subscribe({
      next:(data) => {
        this.listOfCoupons = data;
        this.applyFilters();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  applyFilters() {
    let result = this.listOfCoupons;

    if (this.selectedStatus) {
      const now = new Date();
      if (this.selectedStatus === 'active') {
        result = result.filter(c => c.isActive && now >= new Date(c.startDate) && now <= new Date(c.endDate));
      } else if (this.selectedStatus === 'upcoming') {
        result = result.filter(c => c.isActive && now < new Date(c.startDate));
      } else if (this.selectedStatus === 'expired') {
        result = result.filter(c => !c.isActive || now > new Date(c.endDate));
      }
    }

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase().trim();
      result = result.filter(c => 
        c.code.toLowerCase().includes(q) || 
        c.description?.toLowerCase().includes(q)
      );
    }

    this.filteredCoupons = result;
    this.cd.detectChanges();
  }

  openCloseAddCouponModal(){
    this.showAddCoupon = !this.showAddCoupon;
  }

  openCloseUpdateCouponModal(){
    this.showUpdateCoupon = !this.showUpdateCoupon;
  }

  openUpdateCouponModal(coupon: any) {
    this.showUpdateCoupon = true;
    
    // Format dates to YYYY-MM-DD for <input type="date">
    const startDateFormatted = coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '';
    const endDateFormatted = coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '';

    this.updateCouponForm.patchValue({
      CouponId: coupon.couponId,
      Code: coupon.code,
      Description: coupon.description,
      DiscountType: coupon.discountType,
      DiscountValue: coupon.discountValue,
      MinOrderAmount: coupon.minOrderAmount,
      MaxDiscountAmount: coupon.maxDiscountAmount || '',
      UsageLimit: coupon.usageLimit,
      StartDate: startDateFormatted,
      EndDate: endDateFormatted,
      IsActive: coupon.isActive
    });
    this.cd.detectChanges();
  }

  deleteCoupon(id:number){
    if(confirm("Bạn chắc chắn muốn xóa mã khuyến mãi này?")){
      this._couponService.deleteCoupon(id).subscribe({
        next:(data) => {
          alert("Xóa mã khuyến mãi thành công");
          this.loadCoupons();
        },
        error:(err) => {
          alert("Error: " + err.error.message);
        }
      })
    }
  }

  updateCoupon(){
    if(this.updateCouponForm.invalid){
      this.updateCouponForm.markAllAsTouched();
      alert("Vui lòng nhập đầy đủ thông tin để cập nhật");
      return;
    }

    this._couponService.updateCoupon(this.updateCouponForm.value).subscribe({
      next:(data) => {
        console.log(data);
        alert("Cập nhật mã khuyến mãi thành công");
        this.loadCoupons();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  getCouponStatus(coupon:any):{label:string, color:string} {
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    if(!coupon.isActive || now > end) return {label: 'ĐÃ KẾT THÚC', color: '#8888aa'};
    if(now < start) return {label: 'SẮP TỚI', color: '#f59e0b'};
    return {label: 'ĐANG DIỄN RA', color: '#34d399'};
  }
}
