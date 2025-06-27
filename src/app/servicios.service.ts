import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private servicios: any[] = [];
  private total: number = 0;

  setDatos(servicios: any[], total: number): void {
    this.servicios = servicios;
    this.total = total;
  }

  getDatos(): { servicios: any[]; total: number } {
    return { servicios: this.servicios, total: this.total };
  }

  clearDatos(): void {
    this.servicios = [];
    this.total = 0;
  }
}
