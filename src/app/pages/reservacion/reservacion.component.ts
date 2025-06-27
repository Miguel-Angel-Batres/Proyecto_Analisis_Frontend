import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ServiciosService } from '../../servicios.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservacion',
  imports: [NavbarComponent,FooterComponent,FormsModule],
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent implements OnInit {
  cita = {
    servicios: '',
    precioTotal: 0,
    fecha: '',
    hora: ''
  }; 
  constructor(private router: Router, private serviciosService: ServiciosService,private http: HttpClient) {}

  ngOnInit(): void {
    const { servicios, total } = this.serviciosService.getDatos();
    if (!servicios || !total) {
      console.error('No se recibieron datos en el state');
      this.router.navigate(['/catalogo']);
      return;
    }
    this.cita.servicios = servicios.join(', ');
    this.cita.precioTotal = total;
  }

  registrarCita(): void {
    const citaAEnviar = {
      servicios: this.cita.servicios,
      precioTotal: this.cita.precioTotal,
      fecha: this.cita.fecha,
      hora: this.cita.hora
    };

    this.http.post('http://localhost:3000/citas', citaAEnviar).subscribe({
      next: (res: any) => {
        alert(`Cita registrada correctamente con ID: ${res.id}`);
        this.serviciosService.clearDatos();
        this.router.navigate(['/confirmacion']); 
      },
      error: (err) => {
        console.error('Error al registrar cita:', err);
        alert('Error al registrar cita: ' + (err.error?.error || err.message));
      }
    });
  } 






  pago = {
    titular: '',
    numero: '',
    exp: '',
    cvv: ''
  };

  procesarPago() {
    
    console.log('Procesando pago con datos:', this.pago);
    alert('✅ Pago procesado correctamente (simulado)');
  }

}