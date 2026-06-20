import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRating } from './admin-rating';

describe('AdminRating', () => {
  let component: AdminRating;
  let fixture: ComponentFixture<AdminRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
