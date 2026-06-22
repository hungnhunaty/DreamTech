import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  url: string = 'http://localhost:5149/api/ai';

  constructor(private http: HttpClient) {}

  suggestBuild(prompt: string): Observable<any> {
    return this.http.post<any>(`${this.url}/suggest-build`, { prompt });
  }
}
