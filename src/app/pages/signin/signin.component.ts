import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  isLoading = false;
  formData = {
    email: '',
    password: '',
    phone: '',
    name: '',
    profilePicture: null as File | null
  };

  
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
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.profilePicture = input.files[0]; // Almacena el archivo directamente
    }
  }

  onSubmit(): void {
    const formDataToSend = new FormData();
    formDataToSend.append('email', this.formData.email);
    formDataToSend.append('password', this.formData.password);
    formDataToSend.append('phone', this.formData.phone || '');
    formDataToSend.append('name', this.formData.name);
    if (this.formData.profilePicture) {
      formDataToSend.append('profilePicture', this.formData.profilePicture); // Agrega el archivo
    }
  
    this.http.post('https://proyecto-analisis-backend.onrender.com/usuarios', formDataToSend).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Te has registrado correctamente.',
        });
        console.log('Sign up successful:', response);
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.',
        });
        console.error('Error during sign up:', error);
      }
    );
  }
  
}
