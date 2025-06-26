import { Component,AfterViewInit} from '@angular/core';
import { LogoComponent } from '../../components/logo/logo.component';
import { ReservasComponent } from '../../sections/reservas/reservas.component';
import { PresentacionComponent } from '../../sections/presentacion/presentacion.component';
import { ContactoComponent } from '../../sections/contacto/contacto.component';
import { ModelosComponent } from '../../sections/modelos/modelos.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [LogoComponent,ReservasComponent,PresentacionComponent,ContactoComponent,ModelosComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements AfterViewInit {
  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
