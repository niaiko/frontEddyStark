import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEcritureComponent } from './dashboard-ecriture.component';

describe('DashboardEcritureComponent', () => {
  let component: DashboardEcritureComponent;
  let fixture: ComponentFixture<DashboardEcritureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardEcritureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEcritureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
