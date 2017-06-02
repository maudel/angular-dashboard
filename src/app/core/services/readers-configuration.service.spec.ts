import { TestBed, inject } from '@angular/core/testing';

import { ReadersConfigurationService } from './readers-configuration.service';

describe('ReadersConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReadersConfigurationService]
    });
  });

  it('should be created', inject([ReadersConfigurationService], (service: ReadersConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
