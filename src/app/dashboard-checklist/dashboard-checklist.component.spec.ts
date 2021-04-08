import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChecklistComponent } from './dashboard-checklist.component';

describe('DashboardChecklistComponent', () => {
  let component: DashboardChecklistComponent;
  let fixture: ComponentFixture<DashboardChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
