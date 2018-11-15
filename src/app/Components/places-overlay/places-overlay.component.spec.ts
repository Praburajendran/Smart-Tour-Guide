import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesOverlayComponent } from './places-overlay.component';

describe('PlacesOverlayComponent', () => {
  let component: PlacesOverlayComponent;
  let fixture: ComponentFixture<PlacesOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
