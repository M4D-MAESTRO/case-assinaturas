import { TestBed } from '@angular/core/testing';

import { CartaoClientesService } from './cartao-clientes.service';

describe('CartaoClientesService', () => {
  let service: CartaoClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartaoClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
