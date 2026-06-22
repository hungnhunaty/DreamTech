import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/reviewService/review-service';

@Component({
  selector: 'app-admin-rating',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-rating.html',
  styleUrl: './admin-rating.css',
})
export class AdminRating {
  listOfReviews: any[] = [];
  filteredReviews: any[] = [];

  // Filter properties
  searchText: string = '';
  selectedRating: string = '';

  constructor(private _reviewService:ReviewService, private cd: ChangeDetectorRef){}

  ngOnInit(){
    this.loadReviews();
  }

  loadReviews(){
    this._reviewService.getAllReviews().subscribe({
      next:(data) => {
        this.listOfReviews = data;
        this.applyFilters();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  applyFilters() {
    let result = this.listOfReviews;

    if (this.selectedRating) {
      if (this.selectedRating === '12') {
        result = result.filter(r => r.rating === 1 || r.rating === 2);
      } else {
        const stars = Number(this.selectedRating);
        result = result.filter(r => r.rating === stars);
      }
    }

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase().trim();
      result = result.filter(r => 
        r.productName?.toLowerCase().includes(q) || 
        r.userName?.toLowerCase().includes(q) || 
        r.comment?.toLowerCase().includes(q)
      );
    }

    this.filteredReviews = result;
    this.cd.detectChanges();
  }

  deleteReview(id:number){
    if(confirm("Bạn chắc chắn muốn xóa đánh giá này?")){
      this._reviewService.deleteReview(id).subscribe({
        next:(data) => {
          alert("Xóa đánh giá thành công");
          this.loadReviews();
        },
        error:(err) => {
          alert("Error: " + err.error.message);
        }
      })
    }
  }

  getStarArray(rating:number):boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
