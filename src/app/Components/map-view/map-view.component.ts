import { Component, OnInit, Input } from '@angular/core';
import { CurrentGeoService } from '../../Services/current-geo.service'
import { MapUtilityService } from '../../Services/map-utility.service'


declare let L;
declare let tomtom

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

    constructor(public geoservice: CurrentGeoService, public utilitysrvc: MapUtilityService) {}

    public trafficOptions;
    public trafficFlowOptions;

    // Creating map
    public map;
    public resultsList;

    public loader;
    public markers = [];
    public route;

    public markersLayer;
    public currPosLayer;
    public currgeoposition = [];
    public priceArr = [];

    public locationsSubscription;

    @Input() tomtom;
    @Input() L;


    ngOnInit() {
        // Creating Map
        this.utilitysrvc.createMap(tomtom, L);
    }

}