import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http:HttpClient, private router:Router){}

  url:string = `${environment.apiUrl}/product`;

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
