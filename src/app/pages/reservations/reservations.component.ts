import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Reservation } from '../../models/reservation.model';
import { ReservationsService } from '../../services/reservations.service';

@Component({
  selector: 'app-reservations',
  imports: [ReactiveFormsModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent {
  reservationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reservationsService: ReservationsService
  ) {
    this.reservationForm = this.fb.group({
      usuarioId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      servicios: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(1)]],
      precioTotal: ['', [Validators.required, Validators.min(0)]],
      estado: [
        'pending',
        [
          Validators.required,
          Validators.pattern(/^(pending|confirmed|cancelled)$/),
        ],
      ],
      notas: [''],
    });
  }

  onSubmit() {
    this.reservationForm.markAsTouched();
    if (this.reservationForm.valid) {
      const reserva: Reservation = this.reservationForm.getRawValue();
      console.log('Reservación:', reserva);
      this.reservationsService
        .generateReservation(this.reservationForm.value)
        .subscribe({
          next: (res) => {
            console.log('Reservación creada:', res);
            // Aquí podrías mostrar un mensaje o redirigir
          },
          error: (err) => {
            console.error('Error al crear la reservación', err);
          },
        });
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }
}
