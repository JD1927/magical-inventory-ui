import { TestBed } from '@angular/core/testing';

import { SupplierDialogService } from './supplier-dialog-service';

describe('SupplierDialogService', () => {
  let service: SupplierDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
