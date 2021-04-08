import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { RestitutionServices } from 'app/_services/restitution.service';

@Component({
  selector: 'app-dashboard-actif-passif',
  templateUrl: './dashboard-actif-passif.component.html',
  styleUrls: ['./dashboard-actif-passif.component.css']
})
export class DashboardActifPassifComponent implements OnInit {
  siren = null;
  periode = null;
  listPeriode = [];

  //compte n2 et n3
  actifN2=[]; actifN3=[];
  passif=[];
  

  constructor(
    private restitutionService: RestitutionServices,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      const siren = paramMap.get('siren');
      if (siren) {
        this.siren = siren;     
        this.getListPeriodeActifDispoBySiren(); 
        this.getPassifExigibleSiren();    
      }
    });
  }

  async getListPeriodeActifDispoBySiren(){
    let input = new InputRequest();
    input.input.push(this.siren);
    await this.restitutionService.getListPeriodeActifDispoBySiren(input).toPromise().then((data)=>{
      this.listPeriode=data;
      this.periode=data[0];
      this.getActifDispoBySiren();
    });
  }

  async getPassifExigibleSiren(){
    let input = new InputRequest();
    input.input.push(this.siren);

    await this.restitutionService.getPassifExigibleSiren(input).toPromise().then((data)=>{
      this.passif=data; 
    });
  }

  relodePeriode(event: MatSelectChange) {
    this.periode = event.value;
    this.getActifDispoBySiren();
  }

  async getActifDispoBySiren(){
    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.periode);
    input.input.push('n2');
    this.actifN2=[];
    this.actifN3=[];

    await this.restitutionService.getActifDispoBySiren(input).toPromise().then((data)=>{
      ///console.log(data);
      this.actifN2=data;
    });

    input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.periode);
    input.input.push('n3');
    await this.restitutionService.getActifDispoBySiren(input).toPromise().then((data)=>{
      this.actifN3=data;
    });
  }
}
