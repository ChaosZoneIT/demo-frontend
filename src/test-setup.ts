import 'zone.js';
import 'zone.js/testing';

import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { RESERVATION_STRATEGY } from 'app/services/reservation-strategy.token';
import { JsonServerReservationStrategy } from 'app/services/json-server-reservation.strategy';


// 🔧 KLUCZOWA INICJALIZACJA ŚRODOWISKA TESTOWEGO
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// 💉 GLOBALNY PROVIDER (jeśli chcesz go domyślnie wrzucać wszędzie)
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: RESERVATION_STRATEGY, useClass: JsonServerReservationStrategy }
    ]
  });
});
