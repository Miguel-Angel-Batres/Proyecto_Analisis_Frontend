import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule,FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading = false;
 
  
  constructor(private http: HttpClient,private route: Router) {}
  async ngOnInit() {
    const backendStarted = await this.checkAndStartBackend();
    if (!backendStarted) {
      console.error('Backend could not be started.');
    }
    
  }

  async checkAndStartBackend(): Promise<boolean> {
    this.isLoading = true; 
    try {
      const response = await this.http.get('https://proyecto-analisis-backend.onrender.com/start', { responseType: 'text' }).toPromise();
      console.log('Backend response:', response);
      return true;
    } catch (error) {
      console.error('Error starting backend:', error);
      return false;
    } finally {
      this.isLoading = false; 
    }
  }
  onSubmit(form: any): void {
    const loginData = {
      email: form.value.email,
      password: form.value.password,
    };
  
    this.isLoading = true;
  
    this.http.post('https://proyecto-analisis-backend.onrender.com/login', loginData).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
  
        localStorage.setItem('user', JSON.stringify(response.user));
  
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome, ${response.user.email}!`,
        });
        this.route.navigate(['/landing']);
  
        this.isLoading = false;
      },
      (error) => {
        console.error('Error during login:', error);
  
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error?.error || 'An error occurred during login.',
        });
  
        this.isLoading = false;
      }
    );
  
  }
}
