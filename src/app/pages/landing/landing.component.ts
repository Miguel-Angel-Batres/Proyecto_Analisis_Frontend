import { Component } from '@angular/core';
import { LogoComponent } from '../../components/logo/logo.component';
import { ReservasComponent } from '../../sections/reservas/reservas.component';
import { PresentacionComponent } from '../../sections/presentacion/presentacion.component';
import { ContactoComponent } from '../../sections/contacto/contacto.component';
import { ModelosComponent } from '../../sections/modelos/modelos.component';

@Component({
  selector: 'app-landing',
  imports: [LogoComponent,ReservasComponent,PresentacionComponent,ContactoComponent,ModelosComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
