import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueFichierComponent } from './historique-fichier.component';

describe('HistoriqueFichierComponent', () => {
  let component: HistoriqueFichierComponent;
  let fixture: ComponentFixture<HistoriqueFichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueFichierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
