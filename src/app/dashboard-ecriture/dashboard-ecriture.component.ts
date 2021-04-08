import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { RestitutionServices } from 'app/_services/restitution.service';

@Component({
  selector: 'app-dashboard-ecriture',
  templateUrl: './dashboard-ecriture.component.html',
  styleUrls: ['./dashboard-ecriture.component.css']
})
export class DashboardEcritureComponent implements OnInit {
  siren = null;
  periode = null;
  listPeriode = [];

  // warning ecriture
  rowListEcriture = [];
  colListEcriture = [];
  mapEcriture = [];

  /*rowListEcritureApparu = [];
  colListEcritureApparu = [];
  mapEcritureApparu = [];

  rowListEcritureDisparu = [];
  colListEcritureDisparu = [];
  mapEcritureDisparu = [];*/

  //detail ecriture disparue
  ecritureDisparues = null;

  //detail ecriture apparue
  ecritureApparues = null;

  constructor(
    private restitutionService: RestitutionServices,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      const siren = paramMap.get('siren');
      if (siren) {
        this.siren = siren;
        this.getListPeriodeEcritureWarningBySiren();
        this.getWarningEcritureBySiren();
      }
    });
  }

  async getWarningEcritureBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.rowListEcriture = [];
    this.colListEcriture = [];
    this.mapEcriture = [];

    this.colListEcriture.push('Indicateurs');
    await this.restitutionService.getWarningEcritureBySiren(input).toPromise().then((data) => {
      this.rowListEcriture = data.rowList;
      data.colList.forEach(element => {
        this.colListEcriture.push(element);
      });
      this.mapEcriture = data.tab;      
    });
  }

  async getDetailEcritureDisparueBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.periode);

    await this.restitutionService.getDetailEcritureDisparueBySiren(input).toPromise().then((data) => {
      this.ecritureDisparues = data;
    });
  }

  
  /*async getApparuAvantApresBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.periode);
    this.rowListEcritureApparu = [];
    this.colListEcritureApparu = [];
    this.mapEcritureApparu = [];

    this.colListEcritureApparu.push('Indicateurs');
    await this.restitutionService.getApparuAvantApresBySiren(input).toPromise().then((data) => {
      this.rowListEcritureApparu = data.rowList;
      data.colList.forEach(element => {
        this.colListEcritureApparu.push(element);
      });
      this.mapEcritureApparu = data.tab;      
    });
  }

  async getDisparuAvantApresBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.periode);
    this.rowListEcritureDisparu = [];
    this.colListEcritureDisparu = [];
    this.mapEcritureDisparu = [];

    this.colListEcritureDisparu.push('Indicateurs');
    await this.restitutionService.getDisparuAvantApresBySiren(input).toPromise().then((data) => {
      this.rowListEcritureDisparu = data.rowList;
      data.colList.forEach(element => {
        this.colListEcritureDisparu.push(element);
      });
      this.mapEcritureDisparu = data.tab;      
    });
  }*/

  async getDetailEcritureApparueBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.periode);

    await this.restitutionService.getDetailEcritureApparueBySiren(input).toPromise().then((data) => {
      this.ecritureApparues = data;
    });
  }

  async getListPeriodeEcritureWarningBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.listPeriode = [];

    await this.restitutionService.getListPeriodeEcritureWarningBySiren(input).toPromise().then((data) => {
      this.listPeriode = data;
      this.periode = this.listPeriode[0];
      this.getDetailEcritureDisparueBySiren();
      this.getDetailEcritureApparueBySiren();
      /*this.getApparuAvantApresBySiren();
      this.getDisparuAvantApresBySiren();*/
    });
  }

  relodePeriode(event: MatSelectChange) {
    this.periode = event.value;

    this.getDetailEcritureDisparueBySiren();
    this.getDetailEcritureApparueBySiren();
    /*this.getApparuAvantApresBySiren();
    this.getDisparuAvantApresBySiren();*/
  }
}

