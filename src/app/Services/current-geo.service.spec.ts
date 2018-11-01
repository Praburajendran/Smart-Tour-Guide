import { TestBed, inject } from '@angular/core/testing';

import { CurrentGeoService } from './current-geo.service';

describe('CurrentGeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentGeoService]
    });
  });

  it('should be created', inject([CurrentGeoService], (service: CurrentGeoService) => {
    expect(service).toBeTruthy();
  }));
});
