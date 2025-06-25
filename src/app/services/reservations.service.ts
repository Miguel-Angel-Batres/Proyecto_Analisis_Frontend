import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  generateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>('/api/reservations', reservation);
  }
}
