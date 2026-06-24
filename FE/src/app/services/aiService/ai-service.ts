import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  url: string = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  suggestBuild(prompt: string): Observable<any> {
    return this.http.post<any>(`${this.url}/suggest-build`, { prompt });
  }
}
