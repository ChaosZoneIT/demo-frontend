import { InjectionToken } from '@angular/core';
import { ReservationStrategy } from './reservation-strategy.interface';

export const RESERVATION_STRATEGY = new InjectionToken<ReservationStrategy>('RESERVATION_STRATEGY');
