import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  constructor(private http: HttpClient) { }

  setUsuarioLogeado(usuario: any): void {
    localStorage.setItem('user', JSON.stringify(usuario));
  }
  getUsuarioLogeado(): any {
    const usuario = localStorage.getItem('user');
    return usuario ? JSON.parse(usuario) : null;
  }
}
