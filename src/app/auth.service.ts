import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://ec2-54-165-190-22.compute-1.amazonaws.com:8080';

  constructor(private http: HttpClient) {}

  loginUser(user: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user);
  }
}
