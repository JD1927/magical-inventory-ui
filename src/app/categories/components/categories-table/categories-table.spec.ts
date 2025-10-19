import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesTable } from './categories-table';

describe(CategoriesTable.name, () => {
  let component: CategoriesTable;
  let fixture: ComponentFixture<CategoriesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesTable],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
