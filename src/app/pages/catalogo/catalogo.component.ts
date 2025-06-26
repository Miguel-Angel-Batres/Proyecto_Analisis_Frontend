// catalogo.component.ts
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { noop } from 'rxjs';
import { FormsModule } from '@angular/forms';
interface Servicio {
  nombre: string;
  tipo: string;
  precio: number;
  imagen: string;
  id: number;
}

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule,FooterComponent,NavbarComponent,FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})

export class CatalogoComponent {
  isAdmin: boolean = true;
  constructor(private router: Router) {}
  tab: string = 'todos'; 
  servicios: Servicio[] = [
    { id: 1, nombre: 'Corte en capas', tipo: 'peinados', precio: 250, imagen: 'assets/images/corte_en_capas.jpg' },
    { id: 2, nombre: 'Manicure básico', tipo: 'uñas', precio: 180, imagen: 'assets/images/manicure_basico.jpg' },
    { id: 3, nombre: 'Tinte completo', tipo: 'peinados', precio: 500, imagen: 'assets/images/tinte_completo.jpg' },
    { id: 4, nombre: 'Acrílicas', tipo: 'uñas', precio: 300, imagen: 'assets/images/acrilicas.jpg' },
  ];

serviciosSeleccionados: Servicio[] = [];
servicioEditando : Servicio | null = null;

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
 
  agregarServicio(): void {
    this.servicioEditando = null;
    Swal.fire({
      title: 'Agregar Servicio',
      html: `
        <input type="text" id="nombre" class="swal2-input" placeholder
        ="Nombre del servicio">
        <input type="text" id="tipo" class="swal2-input" placeholder
        ="Tipo de servicio (peinados, uñas, etc.)">
        <input type="number" id="precio" class="swal2-input" placeholder
        ="Precio del servicio">
        <input type="text" id="imagen" class="swal2-input" placeholder
        ="URL de la imagen">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value
        const tipo = (document.getElementById('tipo') as HTMLInputElement).value;
        const precio = parseFloat((document.getElementById('precio') as HTMLInputElement
        ).value);
        const imagen = (document.getElementById('imagen') as HTMLInputElement).value
        if (!nombre || !tipo || isNaN(precio) || !imagen) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return;
        }
        return { nombre, tipo, precio, imagen };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevoServicio: Servicio = {
          id: this.servicios.length + 1,
          nombre: result.value.nombre,
          tipo: result.value.tipo,
          precio: result.value.precio,
          imagen: result.value.imagen
        };
        this.servicios.push(nuevoServicio);
        Swal.fire('Servicio agregado', '', 'success');
      }
    });
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
    guardarEdicion(servicio: Servicio): void {
      if (this.servicioEditando) {
      const index = this.servicios.findIndex(s => s.id === this.servicioEditando!.id);
      if (index !== -1) {
        this.servicios[index] = servicio;
      }
      this.servicioEditando = null;
      } else {
      this.servicios.push(servicio);
      }
    }
    cancelarEdicion(servicio: Servicio): void {
      if (this.servicioEditando) {
      const index = this.servicios.findIndex(s => s.id === this.servicioEditando!.id);
      if (index !== -1) {
        this.servicios[index] = servicio;
      }
      this.servicioEditando = null;
      }
    }
    deleteServicio(servicio: Servicio): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar el servicio "${servicio.nombre}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicios = this.servicios.filter(s => s.id !== servicio.id);
          Swal.fire('Servicio eliminado', '', 'success');
        }
      });
    }
    editarImagen(servicio: Servicio): void {
      Swal.fire({
      title: 'Editar Imagen',
      html: `
        <input type="text" id="imagen" class="swal2-input" placeholder="URL de la imagen" value="${servicio.imagen}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const imagen = (document.getElementById('imagen') as HTMLInputElement).value;
        
        if (!imagen) {
        Swal.showValidationMessage('Por favor ingresa la URL de la imagen');
        return;
        }
        
        return { imagen };
      }
      }).then((result) => {
      if (result.isConfirmed && result.value) {
        servicio.imagen = result.value.imagen;
      }
      });
    }

  
}
