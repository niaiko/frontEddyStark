import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { Role } from 'app/_models/role';
import { AccountService, WalletService } from 'app/_services';
import { RestitutionServices } from 'app/_services/restitution.service';

@Component({
  selector: 'app-rapprochement',
  templateUrl: './rapprochement.component.html',
  styleUrls: ['./rapprochement.component.css']
})
export class RapprochementComponent implements OnInit {
  divClass = null;
  user = null;
  siren = null;
  form: FormGroup; 

  dateDebut=null;
  dateFin=null;
  banque=null;
  banques=null;

  exercice=null;
  listExercice=[];
  
  rapprochement=[];

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
    if (this.isUser()) {
      this.divClass = 'main-content';
    } else {
      this.divClass = '';
    }
    this.adapter.setLocale('fr');

    this.form= new FormGroup({
      imputation:new FormControl(),
      dateDebut: new FormControl(),
      dateFin: new FormControl()
    });

    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
    const siren = paramMap.get('siren');
      if (siren) {
        this.siren = siren;
      } else if (this.user.roles[0] == Role.user) {
        this.siren = this.user.username;
      }
      if (this.siren) {
        this.getListPeriodeBySiren();        
      }
    });
  }
  async getListPeriodeBySiren() {
    let input = new InputRequest();
    input.input.push(this.siren);    

    this.listExercice = [];    

    await this.restitutionService.getListExoBySiren(input).toPromise().then((data) => {
      //console.log('exo=',data);
      this.listExercice = data;
      this.exercice=data[0].exo;
      this.f.dateFin.setValue(data[0].fin);
      this.f.dateDebut.setValue(data[0].debut);
    });

    this.loadBanques();   
  }
  
  async loadBanques(){
    this.banque=null;
    let input= new InputRequest();
    input.input.push(this.siren);
    this.banques=[];
    await this.walletService.getBanque(input).toPromise().then((data)=>{
      //console.log('banques=',data);
      this.banque=data[0].imputation;
      this.f.imputation.patchValue(this.banque);
      this.banques=data;
    });
    this.getRapprochementFec();
  }

  relodeExercice(event: MatSelectChange) {
    this.exercice = event.value;
    this.listExercice.forEach(exercice => {
      if(exercice.exo==event.value){
        this.f.fin.setValue(exercice.fin);
        this.f.debut.setValue(exercice.debut);        
      }
    });

    this.loadBanques();
  }

  setDateDebut(event) {    
    this.getRapprochementFec();
  } 
  
  setDateFin(event) {    
    this.getRapprochementFec();
  } 

  onSelectBanque(event) {
    //console.log('banque selected=',event.value);
    this.banque=event.value;
    this.getRapprochementFec();
  }

  getRapprochementFec(){
    let input = new InputRequest();
    let dateFin =this.datepipe.transform(this.f.dateFin.value, 'yyyy-MM-dd');
    let deteDebut =this.datepipe.transform(this.f.dateDebut.value, 'yyyy-MM-dd');
    input.input.push(this.siren);
    input.input.push(this.f.imputation.value);
    input.input.push(deteDebut);
    input.input.push(dateFin);

    //console.log('input=',input);
    this.rapprochement=[];

    this.restitutionService.getRapprochementFec(input).subscribe((data)=>{
      //console.log('rappro=',data);
      this.rapprochement=data;
    });
  }

  get f() { return this.form.controls; }

  getRole() {
    return this.user.roles[0];
  }

  isUser() {
    if (this.user.roles[0] == Role.user) {
      return true;
    }
    return false;
  }

}
