import { TestBed } from '@angular/core/testing';

import { UserRedirectionService } from './user-redirection.service';

describe('UserRedirectionService', () => {
  let service: UserRedirectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRedirectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
