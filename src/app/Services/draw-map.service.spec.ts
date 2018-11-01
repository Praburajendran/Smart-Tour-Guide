import { TestBed, inject } from '@angular/core/testing';

import { DrawMapService } from './draw-map.service';

describe('DrawMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawMapService]
    });
  });

  it('should be created', inject([DrawMapService], (service: DrawMapService) => {
    expect(service).toBeTruthy();
  }));
});
