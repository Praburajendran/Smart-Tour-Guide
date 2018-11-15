import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ShowResultsService } from '../../Services/show-results.service';


@Component({
  selector: 'app-places-overlay',
  templateUrl: './places-overlay.component.html',
  styleUrls: ['./places-overlay.component.css']
})
export class PlacesOverlayComponent implements AfterViewInit {

  public resultData = {};
  public commentslist = [];
  public photoslist = [];
  public tipslist = [];

  @ViewChild('overlayval') overlayval: ElementRef;

  constructor(public showresultsrvc: ShowResultsService) { }

  ngAfterViewInit() {
    this.showresultsrvc.dataObj.subscribe(dataObj => {
      this.resultData = dataObj;
      console.log(dataObj);
      if(dataObj["apiResData"]){
        this.formatData(dataObj["apiResData"]["response"]["venue"]);
      }
    })

    this.showresultsrvc.getOverlayElem(this.overlayval.nativeElement)
  }

  formatData(dataVal){
      this.commentslist = []
      this.photoslist = []
      this.tipslist = [];

      let bestpic, photo1, photo2;
      if(dataVal.bestPhoto){
         bestpic = dataVal.bestPhoto.prefix+'600x600'+dataVal.bestPhoto.suffix;
         this.photoslist.push(bestpic);
      }
      if(dataVal.photos && dataVal.photos.groups[1] && dataVal.photos.groups[1].items.length > 1){
        //photo1 = dataVal.photos.groups[1].items[0].prefix+'600x600'+dataVal.photos.groups[1].items[0].suffix;
        photo2 = dataVal.photos.groups[1].items[1].prefix+'600x600'+dataVal.photos.groups[1].items[1].suffix;
        this.photoslist.push(photo2);
      }

      if(dataVal.tips && dataVal.tips.groups[0] && dataVal.tips.groups[0].items.length > 0){
        dataVal.tips.groups[0].items.forEach(el => {
          this.tipslist.push(el.text);
        });
      }

      if(dataVal.listed && dataVal.listed.groups[0] >0 && dataVal.listed.groups[0].items.length > 0){
        dataVal.listed.groups[0].items.forEach(el => {
         this.commentslist.push({
           name: el.name,
           desc: el.description
         })
        });
      }
  }
}
