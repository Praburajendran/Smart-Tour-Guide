import { Injectable } from '@angular/core';
import { CurrentGeoService } from './current-geo.service';
import { DrawMapService } from './draw-map.service'; 


@Injectable({
  providedIn: 'root'
})
export class MapUtilityService {

  constructor(public geoservice: CurrentGeoService, public drawmapsrvc: DrawMapService) { }

  public trafficOptions;
  public trafficFlowOptions;

  // Creating map
  public map;
  public resultsList;

  public markers = [];
  public route;
  public placeVal;
  
  public markersLayer;
  public currPosLayer;
  public currgeoposition = [];
  public priceArr;
  public tomtom: any;
  public L: any;
  public loaderElem;

  public locationsSubscription;

  createMap(tomtom, L){
    
            let key // = '';  Add TOMTOM key here.
    
            tomtom.setProductInfo('MapsWebSDKExamplesSelfhosted', '4.38.0-SNAPSHOT');
            // Setting TomTom keys
            tomtom.searchKey(key);

            tomtom.routingKey(key);

            this.trafficOptions = {
                        style: 's3',
                        refresh: 5000,
                        key: key,
                        diff: true
                    };
                    
            this.trafficFlowOptions = {
                key: key,
                refresh: 180000
            };

            // Creating map
            this.map = tomtom.L.map('map', {
                key: key,
                basePath: '../assets/sdk',
                /* Not using traffic API as the network request is more and exceeds daily API limit */
                //traffic: this.trafficOptions,
                //trafficFlow: this.trafficFlowOptions,
                center: [12.7879934,77.6512728],
                zoom: 2 ,
                source : 'raster'
            });

            this.tomtom = tomtom;
            this.L = L;

            this.markers = [];
            this.getCoordsService();
            
            this.markersLayer = L.tomTomMarkersLayer().addTo(this.map);
            this.currPosLayer = L.tomTomMarkersLayer().addTo(this.map);
            this.resultsList = tomtom.resultsList().addTo(this.map);
  }

  clear(loaderElem) {
      this.loaderElem = loaderElem;
      this.resultsList.clear();
      this.markersLayer.clearLayers();
      this.currPosLayer.clearLayers();
  }

  clearMap() {
      var mapval = this.map;
      if (this.route) {
          mapval.removeLayer(this.route);
      }

      this.markers.forEach(function(marker) {
          mapval.removeLayer(marker);
      });
      this.markers = [];
  }

  prepareServiceCall = (placeVal, searchName, queryValue, callFlag, coords)=> {
        var selectedLangCode = 'en-US';
        var queryVal = (placeVal !== 'Your location' && !callFlag) ? placeVal: queryValue //'important tourist attraction';
        var minFuzzyValue = '1';
        var maxFuzzyValue = '2';
        var limitValue = '10';
        var viewValue = 'IN';
        var defaultOpts = {unwrapBbox: true};
        var call;

        call = this.tomtom[searchName](defaultOpts).query(queryVal);
        if (placeVal !== 'Your location' && !callFlag) {
            call = this.tomtom['fuzzySearch'](defaultOpts).query(queryVal);
            call = call.minFuzzyLevel(minFuzzyValue);
            call = call.maxFuzzyLevel(maxFuzzyValue);
        }
        call = call.language(selectedLangCode);

        if (!this.configureServiceCall(placeVal, call, callFlag, coords)) {
            return null;
        }

        return call
            .limit(limitValue)
            .view(viewValue);
    }

        configureServiceCall(placeVal, call, callFlag, coords) {
                var coordinates;
                coordinates = this.getInputLatLng();
                if(placeVal != 'Your location' && callFlag){
                    coordinates = coords;
                }
                if(placeVal == 'Your location' || callFlag){
                    call.radius(200000);
                    if (coordinates) {
                        call.center(coordinates);
                    } else {
                        return false;
                    }
                }
                return true;
            }

        showLoader() {
            this.loaderElem.style.display = 'block';
        }

         hideLoader() {
            this.loaderElem.style.display = 'none';
        }

            isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

        getRoute(placeVal, searchResponses, locations, computeBestOrder, routeRepresentation, coords) {
            this.showLoader();
            this.clearMap();
            this.placeVal = placeVal;

            var currentLocation = this.getInputLatLng();
 
            if(placeVal != 'Your location'){
                currentLocation = coords;
            } else {
                currentLocation = this.getInputLatLng();
            }
            
            locations.unshift({lat: parseFloat(currentLocation[0]), lon : parseFloat(currentLocation[1])});


            var routing = this.tomtom.routing({traffic: false})
                .locations(locations)
                .routeRepresentation(routeRepresentation)
                .computeBestOrder(computeBestOrder);

            routing.go()
                .then((routeJson) => {
                    var dataObj = {
                        tomtom: this.tomtom,
                        L : this.L,
                        map: this.map,
                        route: this.route,
                        markers: this.markers,
                        markersLayer: this.markersLayer,
                        currPosLayer: this.currPosLayer,
                        resultsList: this.resultsList,
                        currgeoposition: this.getInputLatLng() 
                    }
                    if (routeRepresentation === 'polyline') {
                        this.route = this.tomtom.L.geoJson(routeJson, {style: {color: '#06f', opacity: 1}}).addTo(this.map);
                        this.drawmapsrvc.drawRoute(dataObj, searchResponses, locations, routeJson, placeVal, currentLocation);
                    }
                    this.hideLoader();
                }).catch(() =>{
                    //console.log('Error in calculating optimized location');
                    this.hideLoader();
                    //this.tomtom.messageBox({closeAfter: 3000}).setContent('An error occured, please try again').openOn(this.map);
                });
        }

            getCoordsService() {
                //var coords = [this.latInput.value, this.lonInput.value];
                //var coords = ["51.507351","-0.127758"]; //london
                //coords = ["12.7879934","77.6512728"]; //jigani

                 // Call subscribe() to start listening for updates.
            var that = [];
            this.geoservice.autoUpdate().subscribe({
                next(position) {
                  that = position["coords"];
                },
                error(msg) {
                  console.log('Error Getting Location: ', msg); 
                }
            });
            window.setTimeout(()=>{
                this.currgeoposition = that;
            },2000);
            window.setInterval(()=>{
                this.currgeoposition = that;
                if(this.placeVal == 'Your location'){
                      this.drawmapsrvc.drawCurrentPosition(this.getInputLatLng());
                  }
            },60000);
                return this.currgeoposition;
            };

            getInputLatLng(){
                var coords = ["51.507351","-0.127758"];
                if(this.currgeoposition["latitude"]){
                  coords = [this.currgeoposition["latitude"].toFixed(7).toString(),this.currgeoposition["longitude"].toFixed(7).toString()]
                  return [coords[0].trim(), coords[1].trim()]; 
                } else {
                    return coords;
                }
            }
}
