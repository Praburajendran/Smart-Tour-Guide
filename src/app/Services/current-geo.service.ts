import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentGeoService {

    constructor() {}

    // Getting current location
   autoUpdate() {
            if (navigator.geolocation) {
                return new Observable((observer) =>{
                    navigator.geolocation.getCurrentPosition(function(position) {
                        observer.next(position)
                    })
                     setInterval(() => {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            observer.next(position)
                        })
                    }, 60000)              
            })
    }
   }
}