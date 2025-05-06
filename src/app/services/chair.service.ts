import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChairReservationRequest } from '../models/chair-reservation-request.model';
import { Chair } from '../models/chair.model';
import { AppConfigService } from './../core/app-config.service';
import { ReservationStrategy } from './reservation-strategy.interface';
import { RESERVATION_STRATEGY } from './reservation-strategy.token';

@Injectable({
  providedIn: 'root',
})
export class ChairService {
  [x: string]: any;

  private apiUrl: string;
  private chairPath = '/chair';

  constructor(
    private http: HttpClient,
    @Inject(RESERVATION_STRATEGY) private reservationStrategy: ReservationStrategy,
    private configService: AppConfigService,
  ) {
    this.apiUrl = this.configService.get('chairApiUrl');
  }

  getChairs(): Observable<Chair[]> {
    return this.http.get<Chair[]>(`${this.apiUrl}${this.chairPath}`);
  }

  processReservation(reservations: ChairReservationRequest[]): Observable<Chair[]> {
    return this.reservationStrategy.processReservation(reservations);
  }
}
