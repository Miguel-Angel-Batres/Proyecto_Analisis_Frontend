import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading = false;
 
  
  constructor(private http: HttpClient) {}
  async ngOnInit() {
    const backendStarted = await this.checkAndStartBackend();
    if (!backendStarted) {
      console.error('Backend could not be started.');
    }
    
  }

  async checkAndStartBackend(): Promise<boolean> {
    this.isLoading = true; 
    try {
      const response = await this.http.get('http://localhost:3000/start', { responseType: 'text' }).toPromise();
      console.log('Backend response:', response);
      return true;
    } catch (error) {
      console.error('Error starting backend:', error);
      return false;
    } finally {
      this.isLoading = false; 
    }
  }
}
