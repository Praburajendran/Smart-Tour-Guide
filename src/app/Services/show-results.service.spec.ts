import { TestBed, inject } from '@angular/core/testing';

import { ShowResultsService } from './show-results.service';

describe('ShowResultsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowResultsService]
    });
  });

  it('should be created', inject([ShowResultsService], (service: ShowResultsService) => {
    expect(service).toBeTruthy();
  }));
});
