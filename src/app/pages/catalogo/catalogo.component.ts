// catalogo.component.ts
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { noop } from 'rxjs';
interface Servicio {
  nombre: string;
  tipo: string;
  precio: number;
  imagen: string;
}

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule,FooterComponent,NavbarComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})

export class CatalogoComponent {
  isAdmin: boolean = false;
  constructor(private router: Router) {}
  tab: string = 'todos'; 
  servicios: Servicio[] = [
    { nombre: 'Corte en capas', tipo: 'peinados', precio: 250, imagen: 'assets/images/corte_en_capas.jpg' },
    { nombre: 'Manicure básico', tipo: 'uñas', precio: 180, imagen: 'assets/images/manicure_basico.jpg' },
    { nombre: 'Tinte completo', tipo: 'peinados', precio: 500, imagen: 'assets/images/tinte_completo.jpg' },
    { nombre: 'Acrílicas', tipo: 'uñas', precio: 300, imagen: 'assets/images/acrilicas.jpg' },
  ];

serviciosSeleccionados: Servicio[] = [];


serviciosFiltrados() {
    if (this.tab === 'todos') return this.servicios;
    return this.servicios.filter(s => s.tipo === this.tab);
  }
  offset = 0;
  offset2 = 0;
  private latestScrollY = 0;
  private ticking = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.latestScrollY = window.scrollY || document.documentElement.scrollTop;
    this.requestTick();
  }

  requestTick(): void {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateOffset();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateOffset(): void {
    this.offset = this.latestScrollY * 0.4;
    const el = document.getElementById('parallax2');
    if (el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
  
      if (rect.top < windowHeight && rect.bottom > 0) {
        const visibleScroll = windowHeight - rect.top;
        this.offset2 = visibleScroll * 0.2;
      } else {
        this.offset2 = 0; 
      }
    }
  }
 
 


  
    reservarServicio(servicio: Servicio): void {
      // añadir si no está ya seleccionado
      if (!this.serviciosSeleccionados.some(s => s.nombre === servicio.nombre)) {
        this.serviciosSeleccionados.push(servicio);
      }
  
      this.mostrarSwalReservacion();
    }
  
    mostrarSwalReservacion(): void {
      if (this.serviciosSeleccionados.length === 0) {
        Swal.fire('No hay servicios seleccionados', '', 'info');
        return;
      }
  
      const htmlLista = this.serviciosSeleccionados
        .map((s, i) => `
          <p>
            ${s.nombre} - $${s.precio}
            <button class="swal2-delete-btn" data-index="${i}" style="margin-left:5px">❌</button>
          </p>`)
        .join('');
  
      Swal.fire({
        title: 'Servicios seleccionados',
        html: htmlLista + `<hr><strong>Total: $${this.getTotal()}</strong>`,
        showCancelButton: true,
        confirmButtonText: 'Confirmar Reserva',
        cancelButtonText: 'Cancelar',
        showDenyButton: true,
        denyButtonText: 'Agregar Otro Servicio',
        didOpen: () => {
          const botonesEliminar = document.querySelectorAll('.swal2-delete-btn');
          botonesEliminar.forEach(btn => {
            btn.addEventListener('click', (e) => {
              const index = (e.target as HTMLElement).getAttribute('data-index');
              if (index !== null) {
                this.serviciosSeleccionados.splice(parseInt(index, 10), 1);
                Swal.close();
                this.mostrarSwalReservacion();  
              }
            });
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/reservacion'], {
            state: {
              servicios: this.serviciosSeleccionados,
              total: this.getTotal()
            }
          });
        } else if (result.isDenied) {
          this.mostrarSwalAgregar();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.serviciosSeleccionados = [];
        }
      });
    }
  
    mostrarSwalAgregar(): void {
      const disponibles = this.servicios.filter(s => 
        !this.serviciosSeleccionados.some(sel => sel.nombre === s.nombre)
      );
  
      if (disponibles.length === 0) {
        Swal.fire('No hay más servicios disponibles', '', 'info');
        this.mostrarSwalReservacion();
        return;
      }
  
      const opciones = disponibles.reduce((acc, s) => {
        acc[s.nombre] = `${s.nombre} - $${s.precio}`;
        return acc;
      }, {} as Record<string,string>);
  
      Swal.fire({
        title: 'Agregar servicio',
        input: 'select',
        inputOptions: opciones,
        inputPlaceholder: 'Selecciona un servicio',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Volver'
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const nuevo = disponibles.find(s => s.nombre === result.value);
          if (nuevo) {
            this.serviciosSeleccionados.push(nuevo);
          }
          this.mostrarSwalReservacion();
        } else {
          this.mostrarSwalReservacion();
        }
      });
    }
  
    getTotal(): number {
      return this.serviciosSeleccionados.reduce((acc, s) => acc + s.precio, 0);
    }
    addServicio() {
      console.log('Añadir servicio');
    }
  
    editServicio(servicio: any) {
      console.log('Editar servicio:', servicio);
    }
  
    deleteServicio(servicio: any) {
      console.log('Eliminar servicio:', servicio);
    }
  


  
}
