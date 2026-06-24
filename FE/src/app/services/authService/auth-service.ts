import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountRegisterDto } from '../../Dtos/AccountRegisterDto';
import { AccountLoginDto } from '../../Dtos/AccountLoginDto';
import { Observable } from 'rxjs';
import { LoginResponseDto } from '../../Dtos/LoginResponseDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http:HttpClient, private router:Router){

  }

  url:string = `${environment.apiUrl}/account`;

  register(data: AccountRegisterDto) : Observable<any>{
    return this.http.post<any>(`${this.url}/register`, data);
  }

  login(data: AccountLoginDto): Observable<LoginResponseDto>{
    return this.http.post<LoginResponseDto>(`${this.url}/login`, data);
  }
}
