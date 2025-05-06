import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChairService } from '../../services/chair.service';
import { Chair } from '../../models/chair.model';

describe('[integration] ReservationComponent', () => {
  let service: ChairService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // importowanie modułu do testowania HTTP
      providers: [ChairService],
    });
    service = TestBed.inject(ChairService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Sprawdzenie, czy nie zostały zaległe zapytania
    httpMock.verify();
  });

  it('should fetch chairs successfully', () => {
    const mockChairs: Chair[] = [
      { id: 1, typ: 'Standard', name: 'Leżak Standardowy', price: 25, available: 10 },
      { id: 2, typ: 'Premium', name: 'Leżak Premium', price: 40, available: 5 },
    ];

    // Wywołanie metody getChairs()
    service.getChairs().subscribe((chairs) => {
      expect(chairs.length).toBe(2);
      expect(chairs).toEqual(mockChairs);
    });

    // Mockowanie odpowiedzi HTTP
    const req = httpMock.expectOne(`${service['apiUrl']}/chair`);
    expect(req.request.method).toBe('GET');
    req.flush(mockChairs); // Zwracamy mockowane dane
  });

  it('should process reservation and update chair availability', () => {
    const chairFromServer: Chair = { id: 1, typ: 'Standard', name: 'Leżak Standardowy', price: 25, available: 10 };
    const updatedChair: Chair = { ...chairFromServer, available: 5 };
  
    const reservationRequest = [{ id: 1, quantity: 5 }];
  
    const resultObservables = service.processReservation(reservationRequest);
  
    // Obsługa tylko jednego elementu (jeśli więcej, trzeba rozszerzyć)
    resultObservables.subscribe((updated) => {
      expect(updated).toEqual(updatedChair);
    });
  
    // Pierwsze zapytanie GET
    const getReq = httpMock.expectOne(`${service['apiUrl']}/chair/${chairFromServer.id}`);
    expect(getReq.request.method).toBe('GET');
    getReq.flush(chairFromServer);
  
    // Następnie PATCH z nową dostępnością
    const patchReq = httpMock.expectOne(`${service['apiUrl']}/chair/${chairFromServer.id}`);
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual({ available: 5 });
    patchReq.flush(updatedChair);
  });
  
  it('should process reservation and update availability for multiple chairs', () => {
    const chairsFromServer: Chair[] = [
      { id: 1, typ: 'Standard', name: 'Leżak Standardowy', price: 25, available: 10 },
      { id: 2, typ: 'Premium', name: 'Leżak Premium', price: 40, available: 8 },
    ];
  
    const reservationRequest = [
      { id: 1, quantity: 4 },
      { id: 2, quantity: 3 },
    ];
  
    const expectedUpdatedChairs: Chair[] = [
      { ...chairsFromServer[0], available: 6 },
      { ...chairsFromServer[1], available: 5 },
    ];
  
    service.processReservation(reservationRequest).subscribe(updatedChairs => {
      expect(updatedChairs.length).toBe(2);
      expect(updatedChairs).toEqual(expectedUpdatedChairs);
    });
  
    reservationRequest.forEach((res, index) => {
      const getReq = httpMock.expectOne(`${service['apiUrl']}/chair/${res.id}`);
      expect(getReq.request.method).toBe('GET');
      getReq.flush(chairsFromServer[index]);
  
      const patchReq = httpMock.expectOne(`${service['apiUrl']}/chair/${res.id}`);
      expect(patchReq.request.method).toBe('PATCH');
      expect(patchReq.request.body).toEqual({ available: expectedUpdatedChairs[index].available });
      patchReq.flush(expectedUpdatedChairs[index]);
    });
  });
  
  
});
