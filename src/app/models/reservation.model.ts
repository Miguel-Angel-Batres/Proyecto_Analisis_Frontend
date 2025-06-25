import { Service } from './service.model';

export interface Reservation {
  usuarioId: string;
  fecha: Date;
  hora: string;
  servicios: Service;
  duracion: number;
  precioTotal: number;
  estado: 'pending' | 'confirmed' | 'cancelled';
  notas?: string;
}
