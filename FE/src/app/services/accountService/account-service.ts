import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  url:string = `${environment.apiUrl}/account`;

  constructor(private route:Router, private http: HttpClient){}

  getAllUsers():Observable<any>{
    return this.http.get<any>(`${this.url}/getUsers`);
  }

  deleteUser(id:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/deleteUser/${id}`);
  }
}
