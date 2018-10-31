import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapInputFormComponent } from './map-input-form.component';

describe('MapInputFormComponent', () => {
  let component: MapInputFormComponent;
  let fixture: ComponentFixture<MapInputFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapInputFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
