import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChairReservationRequest } from '../models/chair-reservation-request.model';
import { Chair } from '../models/chair.model';
import { AppConfigService } from './../core/app-config.service';
import { ReservationStrategy } from './reservation-strategy.interface';

@Injectable({
  providedIn: 'root'
})
export class JsonServerReservationStrategy implements ReservationStrategy {
  private apiUrl: string;
  private chairPath = "/chair";

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this.apiUrl = this.configService.get('chairApiUrl');
  }

  processReservation(reservations: ChairReservationRequest[]): Observable<Chair[]> {
    const updates$ = reservations.map(res =>
      this.http.get<Chair>(`${this.apiUrl}${this.chairPath}/${res.id}`).pipe(
        switchMap(chair => {
          const newAvailable = chair.available - res.quantity;
          return this.http.patch<Chair>(`${this.apiUrl}${this.chairPath}/${res.id}`, { available: newAvailable });
        })
      )
    );
  
    return forkJoin(updates$);
  }
}
