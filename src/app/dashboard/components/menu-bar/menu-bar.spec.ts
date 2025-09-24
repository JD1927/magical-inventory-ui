import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { MenuBar } from './menu-bar';

describe(MenuBar.name, () => {
  let component: MenuBar;
  let fixture: ComponentFixture<MenuBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuBar],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
