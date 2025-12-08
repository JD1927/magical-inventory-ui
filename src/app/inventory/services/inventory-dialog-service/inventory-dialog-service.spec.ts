import { TestBed } from '@angular/core/testing';

import { InventoryDialogService } from './inventory-dialog-service';

describe(InventoryDialogService.name, () => {
  let service: InventoryDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
