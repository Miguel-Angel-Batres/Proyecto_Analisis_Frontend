// catalogo.component.ts
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ServiciosService } from '../../servicios.service';


@Component({
  selector: 'app-catalogo',
  imports: [CommonModule,FooterComponent,NavbarComponent,FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})

export class CatalogoComponent {
  isAdmin: boolean = false;
  backendCargando: boolean = true; 
  constructor(private router: Router, private http: HttpClient, private serviciosService: ServiciosService) {}
  tab: string = 'todos'; 
  servicios: any[] = [];
  categorias: any[] = ['peinados', 'uñas', 'facial'];

serviciosSeleccionados: any[] = [];
servicioEditando: any = null;
ngOnInit() {
  this.verificarBackend();
  this.cargarServicios();
  // checar parametro rol en user de localstorage, si es admin, isAdmin sera true
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.rol === 'admin') {
    this.isAdmin = true;
  } else {
    this.isAdmin = false;
  }

}
verificarBackend() {
    this.http.get('http://localhost:3000/start', { responseType: 'text' }).subscribe(
      (response) => {
        console.log('Backend iniciado:', response);
        this.backendCargando = false; 
      },
      (error) => {
        console.error('Error al iniciar el backend:', error);
      }
    );  
  }
cargarServicios() {
    this.http.get<any[]>('http://localhost:3000/servicios').subscribe(
      (data) => {
        this.servicios = data;
        console.log('Servicios cargados:', this.servicios);
      },
      (error) => {
        console.error('Error al cargar los servicios:', error);
      }
    );
  }
serviciosFiltrados() {
    if (this.tab === 'todos') return this.servicios;
    return this.servicios.filter(s => s.categoria === this.tab);
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
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre del servicio">
        <input type="text" id="categoria" class="swal2-input" placeholder="Categoría del servicio (peinados, uñas, etc.)">
        <input type="number" id="precio" class="swal2-input" placeholder="Precio del servicio">
        <input type="number" id="duracion" class="swal2-input" placeholder="Duración del servicio (en minutos)">
        <input type="file" id="imagen" class="swal2-file" accept="image/*">
        <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción del servicio"></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
        const categoria = (document.getElementById('categoria') as HTMLInputElement).value;
        const precio = parseFloat((document.getElementById('precio') as HTMLInputElement).value);
        const duracion = parseInt((document.getElementById('duracion') as HTMLInputElement).value, 10);
        const imagenInput = document.getElementById('imagen') as HTMLInputElement;
        const imagen = imagenInput.files ? imagenInput.files[0] : null;
        const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;

        if (!nombre || !categoria || isNaN(precio) || isNaN(duracion) || !imagen || !descripcion) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return;
        }
        return { nombre, categoria, precio, duracion, imagen, descripcion };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = new FormData();
        formData.append('nombre', result.value.nombre);
        formData.append('categoria', result.value.categoria);
        formData.append('precio', result.value.precio.toString());
        formData.append('duracion', result.value.duracion.toString());
        formData.append('imagen', result.value.imagen);
        formData.append('descripcion', result.value.descripcion);

        this.http.post<any>('http://localhost:3000/servicios', formData).subscribe({
          next: (nuevoServicio) => {
            this.servicios.push(nuevoServicio);
            Swal.fire('Servicio agregado', '', 'success');
          },
          error: (error) => {
            console.error('Error al agregar el servicio:', error);
            Swal.fire('Error al agregar el servicio', '', 'error');
          }
        });
      }
    });
  }

  
    reservarServicio(servicio: any): void {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || !user.rol) {
      Swal.fire({
        title: 'No estás logueado',
        text: 'Por favor inicia sesión para reservar un servicio.',
        icon: 'warning',
        confirmButtonText: 'Ir a Login'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
      }

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
          this.serviciosService.setDatos(this.serviciosSeleccionados, this.getTotal());
          this.router.navigate(['/reservacion']);
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
      return this.serviciosSeleccionados.reduce((acumulador, servicio) => acumulador + Number(servicio.precio), 0);
    }
    guardarEdicion(servicioEditado: any): void {
      const index = this.servicios.findIndex(s => s.id === servicioEditado.id);
      if (index !== -1) {
        this.http.put<any>(`http://localhost:3000/servicios/${servicioEditado.id}`, servicioEditado).subscribe(
          (servicioActualizado) => {
            this.servicios[index] = { ...servicioActualizado }; 
            this.servicioEditando = null;
            Swal.fire('Servicio actualizado', '', 'success');
          },
          (error) => {
            console.error('Error al actualizar el servicio:', error);
            Swal.fire('Error al actualizar el servicio', '', 'error');
          }
        );
      }
    }
    editarServicio(servicio: any): void {
      this.servicioEditando = { ...servicio };
      console.log('Servicio editando:', this.servicioEditando);
    }
    cancelarEdicion(servicio: any): void {
      if (this.servicioEditando) {
      const index = this.servicios.findIndex(s => s.id === this.servicioEditando!.id);
      if (index !== -1) {
        this.servicios[index] = servicio;
      }
      this.servicioEditando = null;
      }
    }

    deleteServicio(servicio: any): void {
      Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el servicio "${servicio.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
      }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/servicios/${servicio.id}`).subscribe(
        () => {
          this.servicios = this.servicios.filter(s => s.id !== servicio.id);
          Swal.fire('Servicio eliminado', '', 'success');
        },
        (error) => {
          console.error('Error al eliminar el servicio:', error);
          Swal.fire('Error al eliminar el servicio', '', 'error');
        }
        );
      }
      });
    }

    cambiarImagen(servicio: any): void {
      Swal.fire({
        title: 'Editar Imagen',
        html: `
          <input type="file" id="imagen" class="swal2-file" accept="image/*">
        `,
        focusConfirm: false,
        preConfirm: () => {
          const imagenInput = document.getElementById('imagen') as HTMLInputElement;
          const imagen = imagenInput.files ? imagenInput.files[0] : null;
    
          if (!imagen) {
            Swal.showValidationMessage('Por favor selecciona una imagen');
            return;
          }
    
          return { imagen };
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const formData = new FormData();
          formData.append('imagen', result.value.imagen);
    
          this.http.put<any>(`http://localhost:3000/servicios/${servicio.id}/imagen`, formData).subscribe(
            (servicioActualizado) => {
              const index = this.servicios.findIndex(s => s.id === servicio.id);
              if (index !== -1) {
                this.servicios[index] = { ...servicioActualizado }; 
              }
              Swal.fire('Imagen actualizada', '', 'success');
            },
            (error) => {
              console.error('Error al actualizar la imagen:', error);
              Swal.fire('Error al actualizar la imagen', '', 'error');
            }
          );
        }
      });
    }

  
}
