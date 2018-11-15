import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { NgForm ,Validators, FormBuilder, FormGroup} from '@angular/forms';
import { MapUtilityService } from '../../Services/map-utility.service'
import { GetVenueIdService } from '../../Services/get-venue-id.service'

@Component({
  selector: 'app-map-input-form',
  templateUrl: './map-input-form.component.html',
  styleUrls: ['./map-input-form.component.css']
})

export class MapInputFormComponent implements AfterViewInit {

    public inputMapForm: FormGroup;
    @ViewChild('loader') loader: ElementRef;
    @Input() tomtom: any;
    @Input() L: any;
    public loaderElem;

    constructor(private formBuilder: FormBuilder, private utilitysrvc: MapUtilityService, private venueidsrvc: GetVenueIdService) {
        this.createForm();
    }

    ngAfterViewInit() {
        // Getting Loader Element 
        this.loaderElem = this.loader.nativeElement;
    }

    /* Creating Input Form */
    createForm = () => {
        this.inputMapForm = this.formBuilder.group({
            query: ['important tourist attraction'],
            price: ['0'],
            place: ["Your location"]
        });
    }

    /* Search places based on input */
    searchCurrentPos = async (geoResponses, priceArr, placeVal, coords) => {
        let locations = [];
        if (geoResponses.length > 0) {
            geoResponses.forEach((elem) => {
                locations.push(elem.position);
            });
            (locations.length > 9) ? locations.length = 9: locations.length;
            geoResponses.length = locations.length;
            let newResultArr = [],
                promiseList = [];

            geoResponses.forEach((placedetail) => {
                promiseList.push(this.venueidsrvc.search(placedetail,false));
            });

            let nosearcharr = [];
            newResultArr = await Promise.all(promiseList);
            newResultArr.forEach((elem, index) => {
                if (!elem) {
                    nosearcharr.push(index);
                } else if (elem.venueHours == false) {
                    nosearcharr.push(index);
                }
                let priceFlag;
                priceArr.forEach((priceElem) => {
                    priceFlag = true;
                    if (elem.venuePrice && (elem.venuePrice != priceElem)) {
                        priceFlag = false;
                    }
                })
                if (!priceFlag) {
                    nosearcharr.push(index);
                }
            })

            nosearcharr.forEach((index) => {
                geoResponses.splice(index, 1);
                locations.splice(index, 1);
            })

            this.utilitysrvc.getRoute(placeVal, geoResponses, locations, true, 'polyline', coords);
        } else {
            //this.resultsList.setContent('Results not found.');
        }
    }

    submitForm() {
        this.utilitysrvc.clear(this.loaderElem);
        this.utilitysrvc.clearMap();
        var formResponse = this.inputMapForm.value;
        var queryVal = formResponse.query;
        var priceArr = [];
        if (Array.isArray(formResponse.price)) {
            priceArr = formResponse.price || [];
        } else {
            priceArr.push(formResponse.price);
        }
        let placeVal = formResponse.place;

        if (!queryVal) {
            return false;
        }

        let selectedSearch = 'poiSearch';
        let callFlag = false;
        let searchCall = this.utilitysrvc.prepareServiceCall(placeVal, selectedSearch, queryVal, callFlag, null);
        if (!searchCall) {
            return false;
        }
        searchCall.go(async (geoResponses) => {
            if (placeVal != 'Your location') {
                let coords = [];
                if (geoResponses.length) {
                    coords.push(geoResponses[0].position.lat.toFixed(7).toString());
                    coords.push(geoResponses[0].position.lon.toFixed(7).toString());
                }
                callFlag = true;
                let newCall = this.utilitysrvc.prepareServiceCall(placeVal, selectedSearch, queryVal, callFlag, coords);
                if (!newCall) {
                    return false;
                }
                newCall.go(async (countrygeoResp) => {
                    this.searchCurrentPos(countrygeoResp, priceArr, placeVal, coords);
                })
            } else {
                this.searchCurrentPos(geoResponses, priceArr, placeVal, null)
            }
        });
        return false;
    };
}