import { TestBed } from '@angular/core/testing';

import { FormValidations } from './form-validations';

describe('FormValidations', () => {
  let service: FormValidations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
