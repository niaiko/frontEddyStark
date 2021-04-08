import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoiFichierComponent } from './envoi-fichier.component';

describe('EnvoiFichierComponent', () => {
  let component: EnvoiFichierComponent;
  let fixture: ComponentFixture<EnvoiFichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvoiFichierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvoiFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
