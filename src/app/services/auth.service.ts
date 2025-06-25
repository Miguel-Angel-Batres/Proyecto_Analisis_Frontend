import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string | null = null;
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}
  async checkAndStartBackend(): Promise<boolean> {
    this.isLoading = true;
    try {
      const response = await this.http
        .get('http://localhost:3000/start', { responseType: 'text' })
        .toPromise();
      console.log('Backend response:', response);
      return true;
    } catch (error) {
      console.error('Error starting backend:', error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    const body = { name, email, password, confirmPassword };

    return this.http.post(`${environment.apiUrl}/register`, body);
  }

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post(`${environment.apiUrl}/login`, body);
  }

  saveToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  loadToken() {
    const token = localStorage.getItem('token');
    if (token) this.token = token;
    return this.token;
  }

  isAuthenticated() {
    return !!this.loadToken();
  }
}
