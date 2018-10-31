import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentGeoService {

  constructor() { }

  autoUpdate(){
     return new Observable((observer) => {
       this.getCurrentGeo().then(function(pos){
          observer.next(pos);
       }) 
       setInterval(()=>{
         this.getCurrentGeo().then(function(pos){
          observer.next(pos);
         }) 
       },60000)
      })
    }

    async getCurrentGeo(){
       
      var geopromise = new Promise(function(resolve, reject) {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){
                    resolve(position)
                })}
            });

            var promiseVal = await geopromise;
            return promiseVal;
    }
    
}
