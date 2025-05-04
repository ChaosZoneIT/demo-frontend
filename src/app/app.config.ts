import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { inject } from '@angular/core';
import { routes } from './app.routes';

// Importowanie strategii rezerwacji i tokenu
import { RESERVATION_STRATEGY } from './services/reservation-strategy.token';
import { JsonServerReservationStrategy } from './services/json-server-reservation.strategy';
import { ApiReservationStrategy } from './services/api-reservation.strategy';
import { environment } from '../environments/environment';
import { AppConfigService } from './core/app-config.service';  // import serwisu konfiguracyjnego

// Funkcja inicjalizująca konfigurację
export function initializeAppConfig(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();  // ładuje config.json
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Zachowujemy dotychczasową konfigurację
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),

    // Dodajemy provider dla RESERVATION_STRATEGY
    {
      provide: RESERVATION_STRATEGY,
      useClass: environment.useMockApi ?? false
        ? JsonServerReservationStrategy
        : ApiReservationStrategy
    }
  ]
};
