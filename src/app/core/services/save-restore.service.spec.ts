import { TestBed, inject } from '@angular/core/testing';

import { SaveRestoreService } from './save-restore.service';

describe('SaveRestoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveRestoreService]
    });
  });

  it('should be created', inject([SaveRestoreService], (service: SaveRestoreService) => {
    expect(service).toBeTruthy();
  }));
});
