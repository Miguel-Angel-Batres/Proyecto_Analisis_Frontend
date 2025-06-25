import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = `${environment.apiUrl}/api`;
  token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  saveToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
  }

  loadToken() {
    const token = localStorage.getItem('jwt');
    if (token) this.token = token;
    return this.token;
  }

  isAuthenticated() {
    return !!this.loadToken();
  }
}
