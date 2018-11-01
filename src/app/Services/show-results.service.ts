import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowResultsService {

    constructor() {}

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
     * Get result address from response
     */
    getResultAddress = (result) => {
        if (typeof result.address !== 'undefined') {
            var address = [];

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
        var resultElement = new tomtom.L.DomUtil.create('div', 'geoResponse-result');
        var name = this.getResultName(result);
        var adress = this.getResultAddress(result);

        if (typeof name !== 'undefined') {
            var nameWrapper = tomtom.L.DomUtil.create('div', 'geoResponse-result-name');
            nameWrapper.innerHTML = name;
            resultElement.appendChild(nameWrapper);
        }

        if (typeof adress !== 'undefined') {
            var addressWrapper = tomtom.L.DomUtil.create('div', 'geoResponse-result-address');
            addressWrapper.innerHTML = adress;
            resultElement.appendChild(addressWrapper);
        }

        return resultElement;
    }
}