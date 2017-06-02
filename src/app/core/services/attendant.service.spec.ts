import { TestBed, inject } from '@angular/core/testing';

import { AttendantService } from './attendant.service';

describe('AttendantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttendantService]
    });
  });

  it('should be created', inject([AttendantService], (service: AttendantService) => {
    expect(service).toBeTruthy();
  }));
});
