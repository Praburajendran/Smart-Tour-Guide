import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';

@Injectable({
  providedIn: 'root'
})
export class GetVenueDetailsService {

  public venueplaceurl;
  constructor(private httpClient: HttpClient) { }

        getPlaceDetail(venueid){
               let client_id // = Add Venue client_secret id
                let client_secret // = Add Venue client_secret code
                this.venueplaceurl = 'https://api.foursquare.com/v2/venues/'+venueid;
                let venueplaceparams = new HttpParams();
                venueplaceparams = venueplaceparams.append('v', '20181230');
                venueplaceparams = venueplaceparams.append('client_id', client_id);
                venueplaceparams = venueplaceparams.append('client_secret', client_secret);

                var venueplacereq = this.httpClient.get(this.venueplaceurl,{params:venueplaceparams});

                return this.httpClient.get(this.venueplaceurl,{params:venueplaceparams});
        }
}
