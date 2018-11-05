import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { MapConstants } from '../Constants/map-constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';

@Injectable({
  providedIn: 'root'
})
export class GetVenueDetailsService {

    public mapConst: any = {};
    constructor(private httpClient: HttpClient) {
        this.mapConst = new MapConstants();
    }


    getPlaceDetail = (venueid) => {

        let venueplaceurl = this.mapConst.venueplaceurl + venueid;
        let venueplaceparams = new HttpParams();
        venueplaceparams = venueplaceparams.append('v', this.mapConst.foursqrtoken);
        venueplaceparams = venueplaceparams.append('client_id', this.mapConst.foursqrcliid);
        venueplaceparams = venueplaceparams.append('client_secret', this.mapConst.foursqrcliscrt);

        let venueplacereq = this.httpClient.get(this.mapConst.venueplaceurl, {
            params: venueplaceparams
        });

        return this.httpClient.get(venueplaceurl, {
            params: venueplaceparams
        });
    }
}