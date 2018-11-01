import { TestBed, inject } from '@angular/core/testing';

import { GetVenueIdService } from './get-venue-id.service';

describe('GetVenueIdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetVenueIdService]
    });
  });

  it('should be created', inject([GetVenueIdService], (service: GetVenueIdService) => {
    expect(service).toBeTruthy();
  }));
});
