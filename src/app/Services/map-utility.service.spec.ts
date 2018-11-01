import { TestBed, inject } from '@angular/core/testing';

import { MapUtilityService } from './map-utility.service';

describe('MapUtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapUtilityService]
    });
  });

  it('should be created', inject([MapUtilityService], (service: MapUtilityService) => {
    expect(service).toBeTruthy();
  }));
});
