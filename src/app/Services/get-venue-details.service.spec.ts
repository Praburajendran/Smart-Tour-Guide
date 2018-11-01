import { TestBed, inject } from '@angular/core/testing';

import { GetVenueDetailsService } from './get-venue-details.service';

describe('GetVenueDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetVenueDetailsService]
    });
  });

  it('should be created', inject([GetVenueDetailsService], (service: GetVenueDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
