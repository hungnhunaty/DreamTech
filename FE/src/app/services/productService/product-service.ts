import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http:HttpClient, private router:Router){}

  url:string = `http://localhost:5149/api/product`;

  getAllProducts(): Observable<any>{
    return this.http.get<any>(`${this.url}/getProduct`);
  }

  addProduct(data: any):Observable<any>{
    return this.http.post<any>(`${this.url}/addProduct`, data);
  }

  delProduct(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/deleteProduct/${id}`);
  }

  updateProduct(data:any):Observable<any>{
    return this.http.put<any>(`${this.url}/updateProduct`, data);
  }
}
