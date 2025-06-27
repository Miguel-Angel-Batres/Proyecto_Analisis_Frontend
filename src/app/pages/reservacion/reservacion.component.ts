import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ServiciosService } from '../../servicios.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservacion',
  imports: [NavbarComponent,FooterComponent,FormsModule],
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent implements OnInit {
  servicios: any[] = [];
  cita = {
    precioTotal: 0,
    fecha: '',
    hora: ''
  }; 
  citaRegistrada = false;
  citaAEnviar: any = {};
  usuario: any = {
  };
  pago = {
    titular: '',
    numero: '',
    exp: '',
    cvv: ''
  };
  constructor(private router: Router, private serviciosService: ServiciosService,private http: HttpClient) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('user') || '{}');
    if (!this.usuario || !this.usuario.id) {
      console.error('Usuario no encontrado en el localStorage');
      this.router.navigate(['/login']);
      return;
    }
    const { servicios, total } = this.serviciosService.getDatos();
    console.log('Servicios recibidos:', servicios);
    if (!servicios || !total) {
      console.error('No se recibieron datos en el state');
      this.router.navigate(['/services']);
      return;

    }
    this.servicios = servicios;
    this.cita.precioTotal = total;
  }

  registrarCita(): void {
    this.citaAEnviar = {
      servicios: this.servicios,
      precioTotal: this.cita.precioTotal,
      fecha: this.cita.fecha,
      duracion: this.servicios.reduce((total, servicio) => total + (Number(servicio.duracion) || 0), 0), 
      usuarioId: this.usuario.id
    };
    console.log('Cita a enviar:', this.citaAEnviar);
    this.citaRegistrada = true;
    this.pago.titular = this.usuario.name;

  } 
 

  procesarPago() {
   
    
    this.http.post('https://proyecto-analisis-backend.onrender.com/citas', this.citaAEnviar).subscribe({
      next: (res: any) => {
      this.serviciosService.clearDatos();
      const pagoAEnviar = {
        titular: this.pago.titular,
        monto: this.citaAEnviar.precioTotal,
        numero: this.pago.numero,
        exp: this.pago.exp,
        cvv: this.pago.cvv,
        usuarioId: this.usuario.id,
        citaId: res.id
      };
      console.log('Pago a enviar:', pagoAEnviar);
      if (!pagoAEnviar.titular || !pagoAEnviar.numero || !pagoAEnviar.exp || !pagoAEnviar.cvv || !pagoAEnviar.usuarioId || !pagoAEnviar.citaId) {
        alert('Todos los campos de pago son obligatorios.');
        return;
      }
      this.http.post('https://proyecto-analisis-backend.onrender.com/pagos', pagoAEnviar).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Pago Procesado',
            text: `Pago procesado correctamente.`,
            confirmButtonText: 'Aceptar'
          });
          Swal.fire({
            icon: 'success',
            title: 'Cita Registrada',
            text: `Cita registrada correctamente con ID: ${res.id}`,
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error al procesar pago:', err);
          alert('Error al procesar pago: ' + (err.error?.error || err.message));
        }
      });
      },
      error: (err) => {
      console.error('Error al registrar cita:', err);
      alert('Error al registrar cita: ' + (err.error?.error || err.message));
      }
    });
    
    
  }

}