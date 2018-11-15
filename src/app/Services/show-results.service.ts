import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GetVenueIdService } from './get-venue-id.service'
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ShowResultsService {

    constructor(public venueidsrvc:GetVenueIdService) {}

    private privObj: BehaviorSubject<object> = new BehaviorSubject({oncliFlag:false, placeData:null,apiResData:null});
    public dataObj  = this.privObj.asObservable();
    private overlayEl;
    
    async sendMessage(result) {
        let dataVal = {}
        dataVal["oncliFlag"] = true;
        dataVal["result"] = result;
        dataVal["apiResData"] = await this.venueidsrvc.search(result, true);
        this.privObj.next(dataVal);
    }

    getOverlayElem(overlayElem){
        this.overlayEl = overlayElem;
    }

    /*
     * Get result name from response
     */
    getResultName = (result) => {
        if (typeof result.poi !== 'undefined' && typeof result.poi.name !== 'undefined') {
            return result.poi.name;
        }

        if (result.nm !== '') {
            return result.nm;
        }
        return '';
    }

     /*
     * Create results link from response
     */
    createResultLink= (result) => {
        if (typeof result.poi !== 'undefined' && typeof result.poi.name !== 'undefined') {
            return result.poi.name;
        }

        if (result.nm !== '') {
            return result.nm;
        }
        return '';
    }

    /*
     * Create results link from response
     */
    createResultOverlay= (result) => {
        if (typeof result.poi !== 'undefined' && typeof result.poi.name !== 'undefined') {
            return result.poi.name;
        }

        if (result.nm !== '') {
            return result.nm;
        }
        return '';
    }

    /*
     * Get result address from response
     */
    getResultAddress = (result) => {
        if (typeof result.address !== 'undefined') {
            let address = [];

            if (typeof result.address.freeformAddress !== 'undefined') {
                address.push(result.address.freeformAddress);
            }

            if (typeof result.address.countryCodeISO3 !== 'undefined') {
                address.push(result.address.countryCodeISO3);
            }

            return address.join(', ');
        } else if (typeof result.a2 !== 'undefined') {
            return result.a2;
        }
        return '';
    }

    /*
     * Prepare result element for popup and result list
     */
    prepareResultElement = (tomtom, result) => {
        let resultElement = new tomtom.L.DomUtil.create('div', 'geoResponse-result');
        let name = this.getResultName(result);
        let adress = this.getResultAddress(result);
        let reslink = 'Click here';

        if (typeof name !== 'undefined') {
            let nameWrapper = tomtom.L.DomUtil.create('div', 'geoResponse-result-name');
            nameWrapper.innerHTML = name;
            resultElement.appendChild(nameWrapper);
        }

        if (typeof adress !== 'undefined') {
            let addressWrapper = tomtom.L.DomUtil.create('div', 'geoResponse-result-address');
            addressWrapper.innerHTML = adress;
            resultElement.appendChild(addressWrapper);
        }

        if (typeof reslink !== 'undefined') {
            let linkWrapper = tomtom.L.DomUtil.create('a');
            linkWrapper.title = reslink;
            linkWrapper.innerHTML = reslink;
            linkWrapper.dataset.toggle = 'modal';
            linkWrapper.href = '#overlayval';
            linkWrapper.onclick = () => {
                this.sendMessage(result);
            }
            resultElement.appendChild(linkWrapper);
        }

        return resultElement;
    }
}