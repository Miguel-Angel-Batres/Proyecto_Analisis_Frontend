import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router } from '@angular/router';

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
    constructor(private route:Router) { 
       this.usuario = JSON.parse(localStorage.getItem('user') || '{}');
        if (!this.usuario || !this.usuario.id) {
            console.error('No se encontró información del usuario en el localStorage');
            this.route.navigate(['/login']);
        }
    }



}
