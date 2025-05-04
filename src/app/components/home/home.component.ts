import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,  // <-- dodaj tę linię
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    console.log('HomeComponent initialized');
  }
}