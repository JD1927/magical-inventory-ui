import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementsTimeline } from './inventory-movements-timeline';

describe('InventoryMovementsTimeline', () => {
  let component: InventoryMovementsTimeline;
  let fixture: ComponentFixture<InventoryMovementsTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMovementsTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMovementsTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
