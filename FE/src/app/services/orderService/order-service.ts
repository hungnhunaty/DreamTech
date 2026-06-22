import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  url:string = `http://localhost:5149/api/order`;

  constructor(private route:Router, private http: HttpClient){}

  getAllOrders():Observable<any>{
    return this.http.get<any>(`${this.url}/getOrders`);
  }

  updateOrderStatus(data:any):Observable<any>{
    return this.http.put<any>(`${this.url}/updateStatus`, data);
  }

  createOrder(data:any):Observable<any>{
    return this.http.post<any>(`${this.url}/createOrder`, data);
  }

  getOrdersByUser(userId:number):Observable<any>{
    return this.http.get<any>(`${this.url}/getOrdersByUser/${userId}`);
  }

  hasOrdered(userId:number, productId:number):Observable<boolean>{
    return this.http.get<boolean>(`${this.url}/hasOrdered/${userId}/${productId}`);
  }

  getOrderDetails(orderId:number):Observable<any>{
    return this.http.get<any>(`${this.url}/getOrderDetails/${orderId}`);
  }
}
