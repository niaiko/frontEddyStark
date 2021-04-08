import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { RestitutionServices } from 'app/_services/restitution.service';

@Component({
  selector: 'app-dashboard-checklist',
  templateUrl: './dashboard-checklist.component.html',
  styleUrls: ['./dashboard-checklist.component.css']
})
export class DashboardChecklistComponent implements OnInit {
  siren = null;

  // checkList ecriture
  rowListEcriture=[];
  colListEcriture=[];
  map=[];

  // checkList compte
  rowListCompte=[];
  colListCompte=[];
  mapCompte=[];

  //chekList compte 7
  rowListCompte7=[];
  colListCompte7=[];
  mapCompte7=[];

  //chekList compte 70% 641 et 421
  rowListCompte64=[];
  colListCompte64=[];
  mapCompte64=[];  


  constructor(
    private restitutionService: RestitutionServices,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      const siren = paramMap.get('siren');
      if (siren) {
        this.siren = siren;
      }
      if(this.siren){        
        this.getCheckEcritureBySiren();
        this.getCheckListBySiren();
        this.getCheckList7BySiren();
        this.getCheckList64BySiren();
      }      
    });
  }

  async getCheckEcritureBySiren() {
    let input=new InputRequest();
    this.colListEcriture=[];
    this.rowListEcriture=[];
    this.map=[];

    input.input.push(this.siren);
    
    this.colListEcriture.push('Indicateurs');
    await this.restitutionService.getCheckEcritureBySiren(input).toPromise().then((data)=>{         
      this.rowListEcriture=data.rowList;    
      data.colList.forEach(element => {
        this.colListEcriture.push(element);
      });
      this.map=data.tab;
    });    
  }  

  async getImpot() {
    let input=new InputRequest();
    this.colListEcriture=[];
    this.rowListEcriture=[];
    this.map=[];

    input.input.push(this.siren);
    //input.input.push(this.);
    
    this.colListEcriture.push('Indicateurs');
    await this.restitutionService.getImpot(input).toPromise().then((data)=>{         
      this.rowListEcriture=data.rowList;    
      data.colList.forEach(element => {
        this.colListEcriture.push(element);
      });
      this.map=data.tab;
    });    
  }


  async getCheckListBySiren(){
    let input=new InputRequest();
    input.input.push(this.siren);
    this.rowListCompte=[];
    this.colListCompte=[];
    this.mapCompte=[];

    this.colListCompte.push('Comptes');
    await this.restitutionService.getCheckListBySiren(input).toPromise().then((data)=>{         
      this.rowListCompte=data.rowList;    
      data.colList.forEach(element => {
        this.colListCompte.push(element);
      });
      this.mapCompte=data.tab;
    }); 
  }  

  async getCheckList7BySiren(){
    let input=new InputRequest();
    input.input.push(this.siren);
    this.rowListCompte7=[];
    this.colListCompte7=[];
    this.mapCompte7=[];

    this.colListCompte7.push('Comptes');
    await this.restitutionService.getCheckList7BySiren(input).toPromise().then((data)=>{         
      this.rowListCompte7=data.rowList;    
      data.colList.forEach(element => {
        this.colListCompte7.push(element);
      });
      this.mapCompte7=data.tab;
    }); 
  }

  async getCheckList64BySiren(){
    let input=new InputRequest();
    input.input.push(this.siren);
    this.rowListCompte64=[];
    this.colListCompte64=[];
    this.mapCompte64=[];

    this.colListCompte64.push('Comptes');
    await this.restitutionService.getCheckList64BySiren(input).toPromise().then((data)=>{         
      this.rowListCompte64=data.rowList;    
      data.colList.forEach(element => {
        this.colListCompte64.push(element);
      });
      this.mapCompte64=data.tab;
    }); 
  }
}
