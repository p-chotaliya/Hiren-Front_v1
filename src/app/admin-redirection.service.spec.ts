import { TestBed } from '@angular/core/testing';

import { AdminRedirectionService } from './admin-redirection.service';

describe('AdminRedirectionService', () => {
  let service: AdminRedirectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRedirectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
