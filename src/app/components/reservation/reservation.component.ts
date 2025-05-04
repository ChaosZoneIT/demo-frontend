import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChairService } from '../../services/chair.service';
import { Chair } from '../../models/chair.model';
import { calculateTotalPrice } from '../../utils/price.utils';
import { ChairReservationRequest } from '../../models/chair-reservation-request.model';


@Component({
  selector: 'app-reservation',
  standalone: true,  // <-- dodaj tę linię
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservationForm!: FormGroup;
  submitted = false;
  success = false;
  
  chairTypes: any[] = [];
  // chairTypes = [
  //   { id: 1, name: 'Leżak Standardowy', price: 25, available: 15, selected: 0 },
  //   { id: 2, name: 'Leżak Premium', price: 40, available: 15, selected: 0 },
  //   { id: 3, name: 'Leżak Ekskluzywny', price: 50, available: 15, selected: 0 }
  // ];
  
  constructor(
    private chairService: ChairService
  ) { }

  ngOnInit(): void {
    this.loadChairs();
  }

  loadChairs(): void {
    this.chairService.getChairs().subscribe((chairs: Chair[]) => {
      this.chairTypes = chairs.map(chair => ({
        id: chair.id,
        name: chair.name,
        price: chair.price,
        available: chair.available,
        selected: 0
      }));
    });
  }

  // Obliczenie całkowitej ceny
  get totalPrice(): number {
    return calculateTotalPrice(this.chairTypes);
  }

  // Funkcja obsługująca rezerwację (na razie tylko logowanie)
  async onReserve(): Promise<void> {
    const reservations: ChairReservationRequest[] = this.chairTypes
      .filter(c => c.selected > 0)
      .map(c => ({
        id: c.id,
        quantity: c.selected
      }));
    
        // Sprawdź dostępność
      const unavailable = reservations
      .map(res => {
        const chair = this.chairTypes.find(c => c.id === res.id);
        if (!chair || chair.available < res.quantity) {
          return {
            name: chair?.name || `ID ${res.id}`,
            requested: res.quantity,
            available: chair?.available ?? 0
          };
        }
        return null;
      })
      .filter(Boolean); // usuń null

      if (unavailable.length > 0) {
        const message = unavailable
          .map(u => `Leżak "${u!.name}": dostępnych ${u!.available}, żądano ${u!.requested}`)
          .join('\n');
        alert(`Niektóre leżaki nie są dostępne w żądanej ilości:\n\n${message}`);
        return;
      }




    this.chairService.processReservation(reservations).subscribe({
      next: () => {
        alert('Rezerwacja zakończona sukcesem!');
        console.log('Zarezerwowane leżaki:', reservations);
        console.log('Łączny koszt:', this.totalPrice);
        this.loadChairs();  // Odśwież dostępność
      },
      error: err => {
        console.error('Błąd podczas rezerwacji:', err);
        alert('Wystąpił błąd przy składaniu rezerwacji.');
      }
    });
  }
}
