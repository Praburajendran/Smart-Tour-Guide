import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MapViewComponent } from './Components/map-view/map-view.component';
import { MapInputFormComponent } from './Components/map-input-form/map-input-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    MapInputFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
