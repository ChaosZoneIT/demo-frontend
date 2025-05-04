import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationStrategy } from './reservation-strategy.interface';
import { Chair } from '../models/chair.model';
import { ChairReservationRequest } from '../models/chair-reservation-request.model';
import { Observable } from 'rxjs';
import { AppConfigService } from './../core/app-config.service'; 

@Injectable()
export class ApiReservationStrategy implements ReservationStrategy {
  private apiUrl: string;
  private chairPath = "/reserve";

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this.apiUrl = this.configService.get('chairApiUrl');
  }

  processReservation(reservations: ChairReservationRequest[]): Observable<Chair[]> {
    return this.http.post<Chair[]>(`${this.apiUrl}${this.chairPath}`, reservations);
  }
}
