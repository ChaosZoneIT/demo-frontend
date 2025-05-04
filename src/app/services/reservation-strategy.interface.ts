import { Observable } from 'rxjs';
import { Chair } from '../models/chair.model';
import { ChairReservationRequest } from '../models/chair-reservation-request.model';

export interface ReservationStrategy {
  processReservation(reservations: ChairReservationRequest[]): Observable<Chair[]>;
}