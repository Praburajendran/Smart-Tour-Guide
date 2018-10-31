import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { GetVenueDetailsService } from './get-venue-details.service'

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';

@Injectable({
  providedIn: 'root'
})
export class GetVenueIdService {

  public venueidurl = 'https://api.foursquare.com/v2/venues/search';
  constructor(private httpClient: HttpClient, private venueplacesrvc: GetVenueDetailsService) { }

        async search(placedetail){
              let venueidparams = new HttpParams();
              let client_id // = Add Venue client_secret id
                let client_secret // = Add Venue client_secret code

              venueidparams = venueidparams.append('ll', placedetail.position.lat+','+placedetail.position.lon);
              venueidparams = venueidparams.append('query', placedetail.poi.name);
              venueidparams = venueidparams.append('v', '20181230');
              venueidparams = venueidparams.append('client_id', client_id);
              venueidparams = venueidparams.append('client_secret', client_secret);


              var venueidPromise = this.httpClient.get(this.venueidurl,{params:venueidparams}).first().toPromise();

              var venueidresponse = await venueidPromise;
                      var venueArr = venueidresponse["response"]["venues"];
                    var venueid, exactid, partialid, subidmatch;
                    if(venueArr.length >= 1){
                        venueArr.forEach(function(venue){
                            var venuename = venue.name.toLowerCase();
                            var placenametom = placedetail.poi.name.toLowerCase();
                            if(venuename === placenametom){
                                exactid = venue.id;
                                return;
                            }
                            if(venuename.indexOf(placenametom) > -1){
                                if(!partialid) partialid = venue.id;
                                return;
                            } else if(venuename.slice(0,4) === placenametom.slice(0,4)){
                                if(!subidmatch) subidmatch = venue.id;
                                return;
                            }
                        })
                        venueid = exactid || partialid || subidmatch;
                        if(!venueid){
                            venueid = venueArr[0].id;
                        }
                    }
                    if(!venueid){
                        return false;
                    }

                    var venueplacePromise = this.venueplacesrvc.getPlaceDetail(venueid).first().toPromise();
                    var venueplaceresponse = await venueplacePromise;
                console.log('this is venuie place response')
                console.log(venueplaceresponse);

                var venueObj = {};
                var venuePrice, venueHours;
                if(venueplaceresponse["response"]["venue"]["price"]){
                    venuePrice = venueplaceresponse["response"]["venue"]["price"]["tier"];
                }
                if(venueplaceresponse["response"]["venue"]["hours"]){
                    venueHours = venueplaceresponse["response"]["venue"]["hours"]["isOpen"];
                    //venueHours = response.response.hours.timeframes.renderedTime;
                }
                venueObj["venuePrice"] = venuePrice;
                venueObj["venueHours"] = venueHours;
                return venueObj;
        }
}
