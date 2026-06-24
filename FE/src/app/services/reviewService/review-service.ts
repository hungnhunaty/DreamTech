import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  url:string = `${environment.apiUrl}/review`;

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
