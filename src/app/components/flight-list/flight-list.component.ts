import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { CheapFlightService } from '../../services/cheapflights.service';
import { Airport } from '../../models/airport.model';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;

  departure: Airport;
  destination: Airport;
  departureDate: any;
  returnDate: any;

  flights = new Array<Flight>();

  constructor(private router: Router, private route: ActivatedRoute, private cheapFlightService: CheapFlightService) {

   this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {      

        this.paramsSubscription = this.gatherFlightInfo();
        this.onShowFlights(this.departure, this.destination, this.departureDate, this.returnDate);
      }
  });
  }
  
  ngOnInit() {
    this.paramsSubscription = this.gatherFlightInfo();
    this.onShowFlights(this.departure, this.destination, this.departureDate, this.returnDate);
  }

  gatherFlightInfo() {

    return this.route.params.subscribe(
      (params: Params) => {
        this.departure = {
          iataCode: params['departureIataCode'],
          name: params['departureAirportName']
        }
        this.destination = {
          iataCode: params['destinationIataCode'],
          name: params['destinationAirportName']
        }
        this.departureDate = params['departureDate'];
        this.returnDate = params['returnDate'];
      }
    );
  }

  onShowFlights(departure: any, destination: any, departureDate: any, returnDate: any) {

    this.cheapFlightService.getFlights(departure, destination, departureDate, returnDate).subscribe(
      (flights: any) => {
        this.flights = flights;
      },
      (error) => console.log(error)
    );
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}