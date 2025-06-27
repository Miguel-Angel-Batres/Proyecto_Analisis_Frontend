import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ServiciosService } from '../../servicios.service';

@Component({
  selector: 'app-reservacion',
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent implements OnInit {
 
  constructor(private router: Router, private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    const { servicios, total } = this.serviciosService.getDatos();
    if (!servicios || !total) {
      console.error('No se recibieron datos en el state');
      this.router.navigate(['/catalogo']);
      return;
    }
    
    
  }
}