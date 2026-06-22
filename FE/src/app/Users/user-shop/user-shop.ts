import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/productService/product-service';
import { CategoryService } from '../../services/categoryService/category-service';
import { ReviewService } from '../../services/reviewService/review-service';
import { OrderService } from '../../services/orderService/order-service';

@Component({
  selector: 'app-user-shop',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-shop.html',
  styleUrl: './user-shop.css',
})
export class UserShop implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  selectedCategoryId: number | null = null;
  searchText: string = '';

  // Detail & Reviews
  selectedProduct: any = null;
  reviews: any[] = [];
  newRating: number = 5;
  newComment: string = '';
  canReview: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private reviewService: ReviewService,
    private orderService: OrderService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.categoryService.getCategory().subscribe({
      next: (data) => {
        this.categories = data;
        this.cd.detectChanges();
      }
    });

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.cd.detectChanges();
      }
    });
  }

  filterProducts() {
    let result = this.products;

    if (this.selectedCategoryId !== null) {
      result = result.filter(p => p.categoryId === this.selectedCategoryId);
    }

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    this.filteredProducts = result;
  }

  selectCategory(id: number | null) {
    this.selectedCategoryId = id;
    this.filterProducts();
  }

  addToCart(product: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    let cart: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = cart.find(item => item.productId === product.productId);

    if (found) {
      found.qty += 1;
    } else {
      cart.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        imageUrl: product.imageUrl,
        qty: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm "' + product.name + '" vào giỏ hàng!');
  }

  buyNow(product: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    let cart = [{
      productId: product.productId,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      imageUrl: product.imageUrl,
      qty: 1
    }];
    localStorage.setItem('cart', JSON.stringify(cart));
    this.router.navigate(['/user/checkout']);
  }

  getPrice(p: any): number {
    return p.discountPrice ? p.price - p.discountPrice : p.price;
  }

  // Details modal & reviews
  openDetails(product: any) {
    this.selectedProduct = product;
    this.loadReviews(product.productId);
    this.canReview = false;
    this.cd.detectChanges();

    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      const userId = userInfo.userId || userInfo.userID || userInfo.UserId;
      this.orderService.hasOrdered(userId, product.productId).subscribe({
        next: (res) => {
          this.canReview = res;
          this.cd.detectChanges();
        },
        error: () => {
          this.canReview = false;
          this.cd.detectChanges();
        }
      });
    } else {
      this.canReview = false;
      this.cd.detectChanges();
    }
  }

  closeDetails() {
    this.selectedProduct = null;
    this.reviews = [];
    this.newRating = 5;
    this.newComment = '';
    this.canReview = false;
    this.cd.detectChanges();
  }

  loadReviews(productId: number) {
    this.reviewService.getReviewsByProduct(productId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.cd.detectChanges();
      }
    });
  }

  submitReview() {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
      alert('Vui lòng đăng nhập để đánh giá sản phẩm!');
      return;
    }

    if (!this.newComment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá!');
      return;
    }

    const userInfo = JSON.parse(userInfoStr);
    const userId = userInfo.userId || userInfo.userID || userInfo.UserId;

    const payload = {
      userId: userId,
      productId: this.selectedProduct.productId,
      rating: this.newRating,
      comment: this.newComment
    };

    this.reviewService.addReview(payload).subscribe({
      next: () => {
        alert('Cảm ơn bạn đã đánh giá!');
        this.newComment = '';
        this.newRating = 5;
        this.loadReviews(this.selectedProduct.productId);
      },
      error: (err) => {
        alert('Đánh giá thất bại: ' + (err.error?.message || 'Vui lòng thử lại'));
      }
    });
  }
}
