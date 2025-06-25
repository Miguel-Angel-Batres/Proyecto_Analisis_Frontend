import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  async ngOnInit() {
    const backendStarted = await this.authService.checkAndStartBackend();
    if (!backendStarted) {
      console.error('Backend could not be started.');
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.route.navigate(['/']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message || 'An error occurred during login.',
        });
        this.isLoading = false;
      },
    });
  }
}
