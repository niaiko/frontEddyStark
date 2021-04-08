import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardActifPassifComponent } from './dashboard-actif-passif.component';

describe('DashboardActifPassifComponent', () => {
  let component: DashboardActifPassifComponent;
  let fixture: ComponentFixture<DashboardActifPassifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardActifPassifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardActifPassifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
