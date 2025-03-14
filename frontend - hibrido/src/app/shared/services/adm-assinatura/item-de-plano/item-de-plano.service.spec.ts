import { TestBed } from '@angular/core/testing';

import { ItemDePlanoService } from './item-de-plano.service';

describe('ItemDePlanoService', () => {
  let service: ItemDePlanoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemDePlanoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
