import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatListOption } from '@angular/material/list';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { RecapCa } from 'app/_models/recapCa';
import { Role } from 'app/_models/role';
import { AccountService, WalletService } from 'app/_services';
import { RestitutionServices } from 'app/_services/restitution.service';
import * as Chartist from 'chartist';
import { element } from 'protractor';
import { Label, Color } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chiffre-affaire',
  templateUrl: './chiffre-affaire.component.html',
  styleUrls: ['./chiffre-affaire.component.css']
})
export class ChiffreAffaireComponent implements OnInit {
  refEtude = null;
  loading = false;
  uniteLegaleListe = null;
  user = null;
  siren = null;
  lastUpdate = null;
  divClass = null;
  periodeOfLastFilename=[];

  listExercice=[];
  exercice=null;  

  form: FormGroup; 

  recap: RecapCa = new RecapCa();

  mapImpot= new Map();

  evoCa: number = 0;
  evoResNet: number = 0;
  evoResExp: number = 0;

  rowListEcriture = [];
  colListEcriture = [];
  //totalKPI:number=0;
  map = [];

  rowListEcritureBFR = [];
  colListEcritureBFR = [];
  mapBFR = [];

  rowListEcritureCAF = [];
  colListEcritureCAF = [];
  //totalCAF:number=0;
  mapCAF = [];

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  labelCA = [];
  dataCA = [
    {data: [] }
  ];

  labelResExp = [];
  dataResExp = [
    {data: [] }
  ];

  labelResNet = [];
  dataResNet = [
    {data: [] }
  ];

  barChartType = 'bar';
  barChartLegend = false;
  public barChartColors: Color [] = [
    { backgroundColor: 'white' },
    { backgroundColor: '#b4b4b4' },
  ];

  scales= {
    xAxes: [{      
      ticks: {
        fontColor: 'white',  // x axe labels (can be hexadecimal too)
      }
    }],
    yAxes: [{
      ticks: {
        fontColor: 'white',  // y axes numbers color (can be hexadecimal too)
      },
      scaleLabel: {
        fontColor: 'white',  // y axe label color (can be hexadecimal too)
      }
    }]
  }
  
  
  constructor(
    private walletService: WalletService,
    private accountService: AccountService,
    private restitutionService: RestitutionServices,
    private route: ActivatedRoute,
    private adapter: DateAdapter<any> ,
    public datepipe: DatePipe
  ) {
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    this.adapter.setLocale('fr');
    //console.log('user=',this.getRole());
    if (this.isUser()) {
      this.divClass = 'main-content';
    } else {
      this.divClass = '';
    }
    
    this.form = new FormGroup({
      /*debut: new FormControl({disabled: true}),
      fin: new FormControl({disabled: true})*/
      debut: new FormControl(),
      fin: new FormControl()
    });
   

    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      const siren = paramMap.get('siren');
      if (siren) {
        this.siren = siren;
      } else if (this.user.roles[0] == Role.user) {
        this.siren = this.user.username;
      } 
      if(this.siren){
        this.getListPeriodeBySiren();        
      }      
    });
  }

  loadAllData(){      
    this.loadLastHistorique();    
    this.loadRecap(this.siren);
    this.loadData(this.siren); 
    this.getListPeriodeImpotByFilename();
    this.getCrossTabCABySiren();
    this.getBFRBySiren();
    this.getCAFBySiren();
  }

  

  getDebut():string{    
    return this.datepipe.transform(this.f.debut.value, 'yyyy-MM-dd');
  }

  getPeriode():string{    
    return this.datepipe.transform(this.f.debut.value, 'yyyy-MM');
  }

  getFin():string{
    return this.datepipe.transform(this.f.fin.value, 'yyyy-MM-dd'); 
  }

  async getListPeriodeBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);    

    this.listExercice = [];    

    await this.restitutionService.getListExoBySiren(input).toPromise().then((data) => {
      //console.log('exo=',data);
      this.listExercice = data;
      this.exercice=data[0].exo;
      this.f.fin.setValue(data[0].fin);
      this.f.debut.setValue(data[0].debut);
    });

    this.loadAllData();
  }

  relodeExercice(event: MatSelectChange) {
    this.exercice = event.value;
    this.listExercice.forEach(exercice => {
      if(exercice.exo==event.value){
        this.f.fin.setValue(exercice.fin);
        this.f.debut.setValue(exercice.debut);        
      }
    });

    this.loadAllData();
  }
 
  async onSubmit(){
    let input = new InputRequest();
    let dateFin =this.datepipe.transform(this.f.fin.value, 'yyyy-MM-dd');
    let deteDebut =this.datepipe.transform(this.f.debut.value, 'yyyy-MM-dd');
    input.input.push(this.siren);
    input.input.push(deteDebut);
    input.input.push(dateFin);
    this.loading=true;

    await this.walletService.recalcul(input).toPromise().then((data)=>{
      this.loading=false;
    });
    this.loadAllData();
  }

  async getListPeriodeImpotByFilename() {
    let input = new InputRequest();
    input.input.push(this.siren); 
    input.input.push(this.exercice); 

    this.periodeOfLastFilename=[];

    await this.restitutionService.getListPeriodeOfExoBySiren(input).toPromise().then((data) => {      
      this.periodeOfLastFilename = data;  
      //console.log('perr',data);      
    });     
    
    this.mapImpot=new Map();   
    let tot:number=0;

    for(let periode of this.periodeOfLastFilename){
      let input2 = new InputRequest();      
      input2.input.push(this.siren); 
      input2.input.push(periode);   
      this.restitutionService.getImpot(input2).toPromise().then((data)=>{ 
        tot=tot+(+data);
        //console.log(periode,' = ',data,' = ',tot)
        this.mapImpot.set(periode,data);
        this.mapImpot.set('Total',tot);
      });
    }
    this.periodeOfLastFilename.push('Total');
    

    //console.log(this.mapImpot);
  }

  getImpotVal(periode):number{
    return this.mapImpot.get(periode);
  }

  get f() { return this.form.controls; }

  

  async loadLastHistorique() {
    this.lastUpdate = null;
    let input = new InputRequest();
    input.input.push(this.siren);    

    this.loading = true;

    await this.walletService.getWalletFileLastHistories(input).toPromise().then(
      (data) => {
        this.loading = false;
        //console.log(data[0]);
        this.lastUpdate = data[0];
      },
      error => {
      });
  }

  getRole() {
    return this.user.roles[0];
  }

  isUser() {
    if (this.user.roles[0] == Role.user) {
      return true;
    }
    return false;
  }

  /*****  recap  *****/
  async loadRecap(siren) {
    let input = new InputRequest();
    this.recap = new RecapCa();    
    input.input.push(siren);
    input.input.push(true);
    input.input.push(this.exercice);
    //input.input.push(this.getFin());

    await this.restitutionService.getRecapCaBySiren(input).toPromise().then((data) => {      
      data[0].forEach(recap => {        
        this.recap = recap;
      });
    });
  }

  /*****  CA  *****/
  async loadData(siren) {
    let input = new InputRequest();
    input.input.push(siren);
    input.input.push(false);
    input.input.push(this.exercice);
  
    //console.log(input);
    let labelPeriode = [];
    let maxCA: number = 0; let minCA: number = 0;
    let maxResExp: number = 0; let minResExp: number = 0;
    let maxResNet: number = 0; let minResNet: number = 0;

    await this.restitutionService.getRecapCaBySiren(input).toPromise().then((data) => {
      this.dataCA=[];
      this.dataResExp=[];
      this.dataResNet=[];

      data.forEach(list => {
        const serieCA: number[] = []
        const serieResExp: number[] = [];
        const serieResNet: number[] = [];
        let exercice=null;

        list.forEach(recap => {
          if(recap.periode.substring(5)=='01' && !labelPeriode.includes('Janvier')) {labelPeriode.push('Janvier');}
          if(recap.periode.substring(5)=='02' && !labelPeriode.includes('Février')) {labelPeriode.push('Février');}
          if(recap.periode.substring(5)=='03' && !labelPeriode.includes('Mars')) {labelPeriode.push('Mars');}
          if(recap.periode.substring(5)=='04' && !labelPeriode.includes('Avril')) {labelPeriode.push('Avril');}
          if(recap.periode.substring(5)=='05' && !labelPeriode.includes('Mai')) {labelPeriode.push('Mai');}
          if(recap.periode.substring(5)=='06' && !labelPeriode.includes('Juin')) {labelPeriode.push('Juin');}
          if(recap.periode.substring(5)=='07' && !labelPeriode.includes('Juillet')) {labelPeriode.push('Juillet');}
          if(recap.periode.substring(5)=='08' && !labelPeriode.includes('Août')) {labelPeriode.push('Août');}
          if(recap.periode.substring(5)=='09' && !labelPeriode.includes('Septembre')) {labelPeriode.push('Septembre');}
          if(recap.periode.substring(5)=='10' && !labelPeriode.includes('Octobre')) {labelPeriode.push('Octobre');}
          if(recap.periode.substring(5)=='11' && !labelPeriode.includes('Novembre')) {labelPeriode.push('Novembre');}
          if(recap.periode.substring(5)=='12' && !labelPeriode.includes('Décembre')) {labelPeriode.push('Décembre');}

          labelPeriode.push();
          serieCA.push(recap.ca);
          serieResExp.push(recap.resExp);
          serieResNet.push(recap.resNet);
          exercice=recap.exercice;
        });

        let data1={
          data: serieCA,
          label: exercice
        };
        let data2={
          data: serieResExp,
          label: exercice
        };
        let data3={
          data: serieResExp,
          label: exercice
        };
        
        this.dataCA.push(data1);
        this.dataResExp.push(data2);
        this.dataResNet.push(data3);
      });
      //console.log("result=",data);
    });
    this.labelCA=labelPeriode;
    this.labelResExp=labelPeriode;
    this.labelResNet=labelPeriode;

  }

  

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };

  async getCrossTabCABySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.getDebut());
    input.input.push(this.getFin());
    this.colListEcriture = [];
    this.rowListEcriture = [];    
    this.map = [];

    this.colListEcriture.push('Indicateurs');
    await this.restitutionService.getCrossTabCABySiren(input).toPromise().then((data) => {
      this.rowListEcriture = data.rowList;
      data.colList.forEach(element => {
        this.colListEcriture.push(element);
      });
      this.colListEcriture.push('Total');      

      let index:number=0;
      data.tab.forEach(rows => {
        let tot:number=0;
        rows.forEach(element => {
          tot=tot+(+element);
        });
        data.tab[index].push(tot);
        index++;
      });

      this.map = data.tab;
    });
  }

  async getBFRBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.getDebut());
    input.input.push(this.getFin());
    this.colListEcritureBFR = [];
    this.rowListEcritureBFR = [];
    this.mapBFR = [];

    this.colListEcritureBFR.push('');
    await this.restitutionService.getBFRBySiren(input).toPromise().then((data) => {
      this.rowListEcritureBFR = data.rowList;
      data.colList.forEach(element => {
        this.colListEcritureBFR.push(element);
      });
      this.mapBFR = data.tab;
    });
  }

  async getCAFBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.getDebut());
    input.input.push(this.getFin());
    this.colListEcritureCAF = [];
    this.rowListEcritureCAF = [];
    this.mapCAF = [];

    this.colListEcritureCAF.push('');
    await this.restitutionService.getCAFBySiren(input).toPromise().then((data) => {
      this.rowListEcritureCAF = data.rowList;
      data.colList.forEach(element => {
        this.colListEcritureCAF.push(element);
      });
      this.colListEcritureCAF.push('Total');

      let index:number=0;
      data.tab.forEach(rows => {
        let tot:number=0;
        rows.forEach(element => {
          tot=tot+(+element);
        });
        data.tab[index].push(tot);
        index++;
      });

      this.mapCAF = data.tab;
    });
  }
}
