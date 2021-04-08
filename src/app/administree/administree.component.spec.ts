import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministreeComponent } from './administree.component';

describe('AdministreeComponent', () => {
  let component: AdministreeComponent;
  let fixture: ComponentFixture<AdministreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
