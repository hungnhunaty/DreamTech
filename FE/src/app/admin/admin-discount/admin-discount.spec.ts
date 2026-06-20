import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDiscount } from './admin-discount';

describe('AdminDiscount', () => {
  let component: AdminDiscount;
  let fixture: ComponentFixture<AdminDiscount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDiscount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDiscount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
