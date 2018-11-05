import { Injectable } from '@angular/core';
import { ShowResultsService } from './show-results.service'; 

@Injectable({
  providedIn: 'root'
})
export class DrawMapService {

    public mapData;

    constructor(public showresultsrvc: ShowResultsService) {}
    drawRoute(dataObj, searchResponses, locations, routeJson, placeVal, currentLocation) {
        this.mapData = dataObj;
        let mas = this.getOptimizedLocations(searchResponses, locations, routeJson.optimizedWaypoints)

        this.drawOptimizedMarker(this.mapData.tomtom, this.mapData.L, mas, currentLocation, placeVal);
        this.mapData.map.fitBounds(this.mapData.route.getBounds(), {
            padding: [5, 5]
        });
    }

    getOptimizedLocations = (searchResponses, locations, optimizedWaypoints) => {
        let optimizedLocations = {};
        let optimizedLocationsArr = [locations[0]];
        optimizedWaypoints.forEach(function(waypoint) {
            optimizedLocationsArr.push(locations[waypoint.optimizedIndex + 1]);
        });
        optimizedLocationsArr.push(locations[locations.length - 1]);
        optimizedLocations["searchResponses"] = searchResponses;
        optimizedLocations["optimizedLocationsArr"] = optimizedLocationsArr;
        return optimizedLocations;
    }

    /*
     * Draws markers on the map.
     */
    draw(searchResponses) {
        let markerOpt = {
            noMarkerClustering: true
        };

        let popupOpt = {
            popupHoverContent: this.showresultsrvc.getResultName,
            popupContent: this.showresultsrvc.prepareResultElement
        };

        this.mapData.markersLayer.setMarkersData(searchResponses)
        this.mapData.markersLayer.setMarkersData(searchResponses).setMarkerOptions(markerOpt)
        this.mapData.markersLayer.setMarkersData(searchResponses).setMarkerOptions(markerOpt).setPopupOptions(popupOpt)
        this.mapData.markersLayer.setMarkersData(searchResponses).setMarkerOptions(markerOpt).setPopupOptions(popupOpt).addMarkers();

        this.mapData.resultsList.clear().unfold();
        this.mapData.markers.forEach((markerLayer, index) => {
            let point = searchResponses[index];
            let geoResponseWrapper = this.showresultsrvc.prepareResultElement(this.mapData.tomtom, point);
            let viewport = point.viewport;
            this.mapData.resultsList.addContent(geoResponseWrapper);
            geoResponseWrapper.onclick = () => {
                if (viewport) {
                    this.mapData.map.fitBounds([viewport.topLeftPoint, viewport.btmRightPoint]);
                } else {
                    this.mapData.map.panTo(markerLayer.getLatLng());
                }
                markerLayer.openPopup();
            };
        });

    }

    /*
     * Draw search center positon
     */
    drawSearchCenterMarker(currentLocation, placeVal) {
        let markerOptions = {
            title: 'Search Center\nLatitude: ' + currentLocation[0] +
                '\nLongitude: ' + currentLocation[1],
            icon: this.mapData.tomtom.L.icon({
                iconUrl: '../assets/sdk/../img/center_marker.svg',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        };

        this.mapData.markersLayer.addLayer(
            this.mapData.tomtom.L.marker([currentLocation[0], currentLocation[1]], markerOptions)
        );

        if (placeVal !== 'Your location') {
            this.mapData.map.fitBounds(this.mapData.markersLayer.getBounds());
        }
    }

    /*
     * Draw current positon
     */
    drawCurrentPosition(coords) {
        this.mapData.currPosLayer.clearLayers();
        let currentLocation = coords;
        let markerOptions = {
            title: 'Search Center\nLatitude: ' + currentLocation[0] +
                '\nLongitude: ' + currentLocation[1],
            icon: this.mapData.tomtom.L.icon({
                iconUrl: '../assets/sdk/../img/waypoint.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        };

        if (this.mapData && this.mapData.currPosLayer) {
            this.mapData.currPosLayer.addLayer(
                this.mapData.tomtom.L.marker([currentLocation[0], currentLocation[1]], markerOptions)
            );
            this.mapData.map.fitBounds(this.mapData.currPosLayer.getBounds());
        }
    }

    drawOptimizedMarker(tomtom, L, optimizedLocations, currentLocation, placeVal) {

        this.drawSearchCenterMarker(currentLocation, placeVal);

        optimizedLocations.optimizedLocationsArr.shift();

        optimizedLocations.optimizedLocationsArr.forEach((coordinates, index) => {
            let svgText = '<svg width="30" height="36" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">' +
                '<ellipse id="svg_1" fill="#000" opacity="0.2" ry="2" rx="7.661" cy="34" cx="15"/>' +
                '<path id="svg_2" fill="#000" d="m25.6,4.4c-2.7,-2.7 -6.5,-4.4 -10.6,-4.4s-7.9,1.7 -10.6,4.4c-2.7,2.7 -4.4,6.5 -4.4,10.6s1.7,7.9 4.4,10.6c2.7,2.7 10.6,8.9 10.6,8.9s7.9,-6.2 10.6,-8.9c2.7,-2.7 4.4,-6.5 4.4,-10.6s-1.7,-7.9 -4.4,-10.6z"/>' +
                '<circle id="svg_3" fill="none" r="12" cy="15" cx="15" class="innerCircle"/>' +
                '<text fill="#ffffff" stroke="#000000" stroke-width="0" x="15" y="23" id="svg_4" font-size="24" font-family="serif" font-weight="900" text-anchor="middle" xml:space="preserve">' + (index + 1) + '</text>' +
                '</svg>';

            let url = 'data:image/svg+xml,' + encodeURIComponent(svgText);
            let myIcon = L.icon({
                iconUrl: url,
                iconSize: [30, 36],
                iconAnchor: [15, 36]
            });
            this.mapData.markers.push(L.marker(coordinates, {
                icon: myIcon
            }).addTo(this.mapData.map));

        });
        console.log('markers ==> ' + console.log(this.mapData.markersLayer));
        this.draw(optimizedLocations.searchResponses);
        this.mapData.map.fitBounds(this.mapData.markersLayer.getBounds());
    }
}