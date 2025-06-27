import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
    usuario: any;
    citas: any[] = [];
    pagos: any[] = [];
    constructor(private route:Router,private http:HttpClient) { 
       this.usuario = JSON.parse(localStorage.getItem('user') || '{}');
        if (!this.usuario || !this.usuario.id) {
            console.error('No se encontró información del usuario en el localStorage');
            this.route.navigate(['/login']);
        }

        
        
    }
    ngOnInit(): void {

        if(this.usuario.rol !== 'admin'){
            this.obtenerCitasUsuario();
        }else{
            this.obtenerCitas();
            this.obtenerPagos();
        }
    }
    obtenerCitas(): void {
        this.http.get(`https://proyecto-analisis-backend.onrender.com/citas`).subscribe({
            next: (res: any) => {
                this.citas = res;
                console.log('Citas obtenidas:', this.citas);
            },
            error: (err) => {
                console.error('Error al obtener citas:', err);
            }
        });
    }
    obtenerPagos(): void {
        this.http.get(`https://proyecto-analisis-backend.onrender.com/pagos`).subscribe({
            next: (res: any) => {
                this.pagos = res;
                console.log('Pagos obtenidos:', this.pagos);
            },
            error: (err) => {
                console.error('Error al obtener pagos:', err);
            }
        });
    }
    obtenerCitasUsuario(): void {
       // obtener citas del usuario
        this.http.get(`https://proyecto-analisis-backend.onrender.com/citas?usuarioId=${this.usuario
            .id}`).subscribe({
            next: (res: any) => {
                this.citas = res;
                console.log('Citas del usuario obtenidas:', this.citas);
            },
            error: (err) => {
                console.error('Error al obtener citas del usuario:', err);
            }
        }); 
    }
    borrarCita(citaId: number): void {
        this.http.delete(`https://proyecto-analisis-backend.onrender.com/citas/${citaId}`).subscribe({
            next: (res: any) => {
                this.citas = this.citas.filter(cita => cita.id !== citaId);
                Swal.fire({
                    icon: 'success',
                    title: 'Cita Eliminada',
                    text: `Cita con ID: ${citaId} eliminada correctamente.`,
                    confirmButtonText: 'Aceptar'
                });
                console.log('Cita eliminada:', res);
            },
            error: (err) => {
                console.error('Error al eliminar cita:', err);
            }
        });
    }



}
