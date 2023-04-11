import { TestBed } from '@angular/core/testing';

import { BrandsService } from './brand.service';

describe('BrandsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrandsService = TestBed.get(BrandsService);
    expect(service).toBeTruthy();
  });
});
