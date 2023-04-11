import { TestBed } from '@angular/core/testing';

import { CardsExpenseService } from './cards-expense.service';

describe('CardsExpenseService', () => {
  let service: CardsExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
