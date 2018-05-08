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
  startDate: any;
  endDate: any;

  flights: Flight[];

  constructor(private router: Router, private route: ActivatedRoute, private cheapFlightService: CheapFlightService) {

   this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {      

        this.paramsSubscription = this.gatherFlightInfo();
        this.onShowFlights(this.departure, this.destination, this.startDate, this.endDate);
      }
  });
  }
  
  ngOnInit() {
    this.paramsSubscription = this.gatherFlightInfo();
    this.onShowFlights(this.departure, this.destination, this.startDate, this.endDate);
  }

  gatherFlightInfo() {

    return this.route.params.subscribe(
      (params: Params) => {
        this.departure.iataCode = params['depCode'],
        this.departure.name = params['depName']
  
        this.destination.iataCode = params['destCode'],
        this.destination.name = params['destName']
        
        this.startDate = params['startDate'];
        this.endDate = params['endDate'];
      }
    );
  }

  onShowFlights(departure: any, destination: any, startDate: any, endDate: any) {

    this.cheapFlightService.getFlights(departure, destination, startDate, endDate).subscribe(
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