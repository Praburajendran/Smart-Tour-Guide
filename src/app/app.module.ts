import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MapViewComponent } from './Components/map-view/map-view.component';
import { MapInputFormComponent } from './Components/map-input-form/map-input-form.component';
import { PlacesOverlayComponent } from './Components/places-overlay/places-overlay.component';

import { MapUtilityService } from './Services/map-utility.service';
import { ShowResultsService } from './Services/show-results.service';
import { DrawMapService } from './Services/draw-map.service';
import { GetVenueDetailsService } from './Services/get-venue-details.service';
import { CurrentGeoService } from './Services/current-geo.service';
import { GetVenueIdService } from './Services/get-venue-id.service';


@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    MapInputFormComponent,
    PlacesOverlayComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    MapUtilityService,
    ShowResultsService,
    DrawMapService,
    GetVenueDetailsService,
    CurrentGeoService,
    GetVenueIdService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
