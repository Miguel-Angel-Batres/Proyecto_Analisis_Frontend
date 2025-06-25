export interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number; // Duración en minutos
  categoria: string; // Ejemplo: 'Corte de cabello', 'Manicura', etc.
}
