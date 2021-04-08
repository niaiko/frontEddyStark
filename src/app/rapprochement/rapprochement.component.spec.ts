import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapprochementComponent } from './rapprochement.component';

describe('RapprochementComponent', () => {
  let component: RapprochementComponent;
  let fixture: ComponentFixture<RapprochementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RapprochementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RapprochementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
