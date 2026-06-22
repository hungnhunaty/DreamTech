import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  url:string = `http://localhost:5149/api/account`;

  constructor(private route:Router, private http: HttpClient){}

  getAllUsers():Observable<any>{
    return this.http.get<any>(`${this.url}/getUsers`);
  }

  deleteUser(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/deleteUser/${id}`);
  }
}
