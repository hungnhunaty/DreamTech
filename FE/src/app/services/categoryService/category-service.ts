import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AddCategoryDto } from '../../Dtos/AddCategoryDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url:string = `${environment.apiUrl}/category`;

  constructor(private route:Router, private http: HttpClient){}
  
  addCategory(data: AddCategoryDto):Observable<any>{
    return this.http.post<any>(`${this.url}/addCategory`, data);
  }

  getCategory():Observable<any>{
    return this.http.get<any>(`${this.url}/getCategory`);
  }

  delCategory(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/deleteCategory/${id}`);
  }

  updateCategory(data:any):Observable<any>{
    return this.http.put<any>(`${this.url}/updateCategory`, data);
  }
}
