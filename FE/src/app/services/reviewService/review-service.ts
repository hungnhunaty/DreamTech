import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  url:string = `http://localhost:5149/api/review`;

  constructor(private route:Router, private http: HttpClient){}

  getAllReviews():Observable<any>{
    return this.http.get<any>(`${this.url}/getReviews`);
  }

  deleteReview(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/deleteReview/${id}`);
  }

  getReviewsByProduct(productId:number):Observable<any>{
    return this.http.get<any>(`${this.url}/getReviewsByProduct/${productId}`);
  }

  addReview(data:any):Observable<any>{
    return this.http.post<any>(`${this.url}/addReview`, data);
  }
}
