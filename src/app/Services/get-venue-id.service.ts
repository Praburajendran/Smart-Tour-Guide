import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { GetVenueDetailsService } from './get-venue-details.service';
import { MapConstants } from '../Constants/map-constants';


// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';

@Injectable({
  providedIn: 'root'
})
export class GetVenueIdService {

    public mapConst: any = {};
    constructor(private httpClient: HttpClient, private venueplacesrvc: GetVenueDetailsService) {
        this.mapConst = new MapConstants();
    }

    async search(placedetail) {
        let venueidparams = new HttpParams();

        venueidparams = venueidparams.append('ll', placedetail.position.lat + ',' + placedetail.position.lon);
        venueidparams = venueidparams.append('query', placedetail.poi.name);
        venueidparams = venueidparams.append('v', this.mapConst.foursqrtoken);
        venueidparams = venueidparams.append('client_id', this.mapConst.foursqrcliid);
        venueidparams = venueidparams.append('client_secret', this.mapConst.foursqrcliscrt);

        let venueidPromise = this.httpClient.get(this.mapConst.venueidurl, {
            params: venueidparams
        }).first().toPromise();

        let venueidresponse = await venueidPromise;
        let venueArr = venueidresponse["response"]["venues"];
        let venueid, exactid, partialid, subidmatch;
        if (venueArr.length >= 1) {
            venueArr.forEach(function(venue) {
                let venuename = venue.name.toLowerCase();
                let placenametom = placedetail.poi.name.toLowerCase();
                if (venuename === placenametom) {
                    exactid = venue.id;
                    return;
                }
                if (venuename.indexOf(placenametom) > -1) {
                    if (!partialid) partialid = venue.id;
                    return;
                } else if (venuename.slice(0, 4) === placenametom.slice(0, 4)) {
                    if (!subidmatch) subidmatch = venue.id;
                    return;
                }
            })
            venueid = exactid || partialid || subidmatch;
            if (!venueid) {
                venueid = venueArr[0].id;
            }
        }
        if (!venueid) {
            return false;
        }

        let venueplacePromise = this.venueplacesrvc.getPlaceDetail(venueid).first().toPromise();
        let venueplaceresponse = await venueplacePromise;

        let venueObj = {};
        let venuePrice, venueHours;
        if (venueplaceresponse["response"]["venue"]["price"]) {
            venuePrice = venueplaceresponse["response"]["venue"]["price"]["tier"];
        }
        if (venueplaceresponse["response"]["venue"]["hours"]) {
            venueHours = venueplaceresponse["response"]["venue"]["hours"]["isOpen"];
            //venueHours = response.response.hours.timeframes.renderedTime;
        }
        venueObj["venuePrice"] = venuePrice;
        venueObj["venueHours"] = venueHours;
        return venueObj;
    }
}