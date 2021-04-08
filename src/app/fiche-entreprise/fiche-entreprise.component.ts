import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SidebarComponent } from 'app/components/sidebar/sidebar.component';
import { User } from 'app/_models';
import { InputRequest } from 'app/_models/Input';
import { Role } from 'app/_models/role';
import { Tiers } from 'app/_models/tiers';
import { AccountService, WalletService } from 'app/_services';
import { FicheEntrepriseService } from 'app/_services/ficheEntreprise';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
declare var $: any;

import * as _moment from 'moment';
import { Moment } from 'moment';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { WebsocketService } from 'app/_services/WebsocketService';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

const moment = _moment;

@Component({
  selector: 'app-fiche-entreprise',
  templateUrl: './fiche-entreprise.component.html',
  styleUrls: ['./fiche-entreprise.component.css']  
})
export class FicheEntrepriseComponent implements OnInit {
  fiche = null;
  form: FormGroup;
  formUser: FormGroup;
  loading = false;
  siren = null;
  user = null;
  document = null;
  refDossier = null;
  flagValid = false;
  dateOuverture = null;
  divClass = '';
  refEtude = null;
  refEtude2 = null;

  private stompClient;
  

  //info supp
  juges = [];
  mandataires = [];
  avocats = [];
  comptables = [];
  administrateurs = [];
  experts = [];
  commissaires = [];

  dateRedressement=null;
  dateEcheance=null;

  formPara: FormGroup;
  

  constructor(
    private ficheEntrepriseService: FicheEntrepriseService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private walletService: WalletService,
    private adapter: DateAdapter<any>,
    public datepipe: DatePipe,
    //private readonly websocketService: WebsocketService
    //private side:SidebarComponent
  ) {
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    if (this.user.roles[0] == Role.user) {
      this.divClass = 'main-content';
    } else {
      this.divClass = '';
    }

    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      const siren = paramMap.get('siren');
      if (siren) {
        this.siren = siren;
      } else if (this.user.roles[0] == Role.user) {
        this.siren = this.user.username;
      }
      if (this.siren) { 
        this.loading = true;
        this.adapter.setLocale('fr');
        //console.log(this.user.email);        
        this.getRefEtudeByMail(this.user.email);
        this.loadFicheEntrepriseBySiren(this.siren);
        this.getJugeCommissaireByEtudeSiren();
        this.getMandataireJudiciaireByEtudeSiren();
        this.getAvocatByEtudeSiren();
        this.getCOAJByEtudeSiren();
        this.getExpertComptableByEtudeSiren();
        this.getJugeCommissaireByEtudeSiren
        this.getComptableByEtudeSiren();
        this.getCommissaireByEtudeSiren();
        this.loadDateRedressement();
        this.loadDateEcheance();

        this.connect('/topic/updateFicheEntreprise');
        //this.sendMessage('/app/updateFicheEntreprise','reload');
        this.loading = false;        
      }
    });

    this.form = new FormGroup({
      search: new FormControl('')
    });

    this.formUser = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.formPara = new FormGroup({
      redressementDate: new FormControl(),
      echeanceDate: new FormControl()
    });
  }  

  reloadSirenListAfetOpen() {
    this.accountService.sendClickEvent();
    this.router.navigate(['administree']);
  }
  reloadSirenListAfetClose() {
    this.accountService.sendClickEvent();
    this.router.navigate(['fiche-entreprise']);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.g[controlName].hasError(errorName);
  }
  get g() { return this.formUser.controls; }
  get f() { return this.form.controls; }
  get h() { return this.formPara.controls; }

  onSubmit() {
    this.search();
  }

  search(){
    //console.log("recherche=", this.f.search.value);
    this.loading = true;
    let siren=this.f.search.value.split(' ').join('');
    this.getRefEtudeByMail(this.user.email);
    this.loadFicheEntrepriseBySiren(siren);

    //console.log(this.user.email, this.flagValid, this.dateOuverture);
  }

  isUser() {
    if (this.user.roles[0] == Role.user) {
      return true;
    }
    return false;
  }


  loadFicheEntrepriseBySiren(siren) {
    this.ficheEntrepriseService.getFicheEntreprise(siren).subscribe((data) => {
      this.fiche = data;
      this.loading = false;
    });
  }

  loadDateRedressement(){
    let input = new InputRequest();
    input.input.push(this.siren);

    this.walletService.getRedressement(input).subscribe((data)=>{
      //console.log('redressement=',data); 
      try {
        this.dateRedressement=data[0].redressement;
        this.h.redressementDate.setValue(data[0].redressement); 
      } catch (error) {        
      }    
    });
  }

  loadDateEcheance(){
    let input = new InputRequest();
    input.input.push(this.siren);
    //console.log('input=',input);

    this.walletService.getEcheance(input).subscribe((data)=>{
      //console.log('echeances',data);      
      try {
        this.dateEcheance=data[0].echeance;
        this.h.echeanceDate.setValue(data[0].echeance);
      } catch (error) {        
      }
    });
  }

  setRedressement(event) {    
    let latest_date =this.datepipe.transform(event.value, 'yyyy-MM-dd');    
    let input = new InputRequest();
    if(!this.siren){      
      input.input.push(this.f.search.value.split(' ').join(''));
    }else{
      input.input.push(this.siren);
    }   
    input.input.push(latest_date);
    this.walletService.addRedressement(input).subscribe((data)=>{
      //console.log('set redress',data);
      this.loadDateRedressement();
    });
  } 

  setEcheance(event) {
    let latest_date =this.datepipe.transform(event.value, 'yyyy-MM-dd');
    let input = new InputRequest();
    if(!this.siren){      
      input.input.push(this.f.search.value.split(' ').join(''));
    }else{
      input.input.push(this.siren);
    }    
    input.input.push(latest_date);
    this.walletService.addEcheance(input).subscribe((data)=>{
      //console.log('set Ech',data);
      this.loadDateEcheance();
    });
  } 

  getRefEtudeByMail(mail) {
    //console.log(mail);
    let input = new InputRequest();
    this.refEtude = null;
    input.input.push(mail);
    this.walletService.getRefEtudeByMail(input).subscribe(
      (data) => {
        this.refEtude = data[0];
        //console.log('ref_etude=',data[0]);
        this.getUniteLegaleListByEtude(data[0]);
      }
    );
  }

  public async getJugeCommissaireByEtudeSiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.refEtude2 = null;
    this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
      this.refDossier = data[0].refDossier;
      this.refEtude2 = data[0].refEtude;
      input = new InputRequest();
      input.input.push(this.refEtude2);
      input.input.push(this.refDossier);
      this.juges = [];

      this.walletService.getJugeCommissaireByEtudeSiren(input).subscribe((data) => {
        //console.log(data);
        for (let str of data) {          
          let juge: Tiers = new Tiers;
          juge.contact = str.contact;
          juge.mail = str.mail;
          juge.nom = str.nom;
          juge.siren = str.siren;
          this.juges.push(juge);
        }
      });
    });
  }

  public async getMandataireJudiciaireByEtudeSiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.refEtude2 = null;
    this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
      this.refDossier = data[0].refDossier;
      this.refEtude2 = data[0].refEtude;
      let input = new InputRequest();
      input.input.push(this.refEtude2);
      input.input.push(this.refDossier);
      this.mandataires = [];

      this.walletService.getMandataireByEtudeSiren(input).subscribe(
        (data) => {
          for (let str of data) {
            let mandataire: Tiers = new Tiers;
            mandataire.contact = str.contact;
            mandataire.mail = str.mail;
            mandataire.nom = str.nom;
            mandataire.siren = str.siren;
            this.mandataires.push(mandataire);
          }
        }
      );
        });   
  }

  public async getAvocatByEtudeSiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.refEtude2 = null;
    //console.log('refDoss=|siren =',this.refDossier, this.siren);
    this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
      this.refDossier = data[0].refDossier;
      this.refEtude2 = data[0].refEtude;
      input = new InputRequest();      
      input.input.push(this.refEtude2);
      input.input.push(this.refDossier);
      //console.log('input===', input);
      this.avocats = [];
      this.walletService.getAvocatByEtudeSiren(input).subscribe(
        (data) => {
          for (let str of data) {
            let tier: Tiers = new Tiers;
            tier.contact = str.contact;
            tier.mail = str.mail;
            tier.nom = str.nom;
            tier.siren = str.siren;
            this.avocats.push(tier);
            //console.log('avocat=',str);
          }
        }
      );
    });
    
  }

  public async getComptableByEtudeSiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.refEtude2 = null;
    this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
      this.refDossier = data[0].refDossier;
      this.refEtude2 = data[0].refEtude;
      let input = new InputRequest();
      input.input.push(this.refEtude2);
      input.input.push(this.refDossier);
      this.comptables = [];
      
      this.walletService.getComptableByEtudeSiren(input).toPromise().then(
        (data) => {
          //console.log('*****DATA*****',data);
          for (let str of data) {
            let tier: Tiers = new Tiers;
            tier.contact = str.contact;
            tier.mail = str.mail;
            tier.nom = str.nom;
            tier.siren = str.siren;
            this.comptables.push(tier);
          }
        }
      );
    });
    //console.log('liste comptable',this.comptables);
  }

  public async getCOAJByEtudeSiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.refEtude2 = null;
    this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
      this.refDossier = data[0].refDossier;
      this.refEtude2 = data[0].refEtude;
      let input = new InputRequest();
      input.input.push(this.refEtude2);
      input.input.push(this.refDossier);
      this.administrateurs = [];

      this.walletService.getCOAJByEtudeSiren(input).subscribe(
        (data) => {
          for (let str of data) {
            let tier: Tiers = new Tiers;
            tier.contact = str.contact;
            tier.mail = str.mail;
            tier.nom = str.nom;
            tier.siren = str.siren;
            this.administrateurs.push(tier);
          }
        }
      );
    });    
  }

  public async getCommissaireByEtudeSiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.refEtude2 = null;
    this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
      this.refDossier = data[0].refDossier;
      this.refEtude2 = data[0].refEtude;
      let input = new InputRequest();
      input.input.push(this.refEtude2);
      input.input.push(this.refDossier);
      this.commissaires = [];
      //console.log('---- input CAC----',input);
      this.walletService.getCommissaireByEtudeSiren(input).subscribe(
        (data) => {
          for (let str of data) {
            let tier: Tiers = new Tiers;
            tier.contact = str.contact;
            tier.mail = str.mail;
            tier.nom = str.nom;
            tier.siren = str.siren;
            this.commissaires.push(tier);
          }
        }
      );
    }); 
  }

  public async getExpertComptableByEtudeSiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    this.refEtude2 = null;
    this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
      this.refDossier = data[0].refDossier;
      this.refEtude2 = data[0].refEtude;
      let input = new InputRequest();
      input.input.push(this.refEtude2);
      input.input.push(this.refDossier);
      this.experts = [];

      this.walletService.getExpertComptableByEtudeSiren(input).subscribe(
        (data) => {
          for (let str of data) {
            let tier: Tiers = new Tiers;
            tier.contact = str.contact;
            tier.mail = str.mail;
            tier.nom = str.nom;
            tier.siren = str.siren;
            this.experts.push(tier);
          }
        }
      );
    });
    
  }

  public async getUniteLegaleListByEtude(refEtude) {
    this.loading = true;
    let input = new InputRequest();
    input.input.push(refEtude);
    this.flagValid = false;
    this.dateOuverture = null;

    await this.walletService.getUniteLegaleListByEtudeNoPage(input).toPromise().then((data) => {
      //console.log(data);      
      data.forEach((unite) => {
        if (unite.siren == this.siren || unite.siren == this.f.search.value) {
          this.flagValid = unite.flagValid;
          this.dateOuverture = unite.dateOuverture;
          this.refDossier = unite.refDossier;
          //console.log(this.flagValid,this.dateOuverture,unite.refDossier) ;
        }
      });
      this.loading = false;
    });
  }

  //Ouverture de dossier
  async ouvrirUnDossier(denomination) {
    if (this.g.email.value) {      

      let input = new InputRequest();
      input.input.push(this.f.search.value);
      input.input.push(this.refEtude);
      input.input.push(this.user.username);      
      input.input.push(denomination);

      console.log('input dossier',input);

      await this.walletService.ouvrirUnDossier(input).toPromise().then(
        (data) => {
          if (data == "OK") {
            this.showNotification('top', 'right', 'success', 'Dossier ouvert');
            //location.reload();          
            this.saveTiers(denomination);
            this.reloadSirenListAfetOpen();
            this.search();
          }
        },
        error => {
          this.showNotification('top', 'right', 'danger', 'Erreur d\'ouverture')
        });

    }
  }

  saveTiers(denomination) {
    //console.log(this.tJuge.value[index], uniteLegale.refDossier);
    let user_tmp = new User();
    user_tmp.password = '';
    user_tmp.role = ["user"];
    user_tmp.username = this.f.search.value;
    user_tmp.email = this.g.email.value;
    this.accountService.register(user_tmp).subscribe();


    let input = new InputRequest();
    input.input.push(this.g.email.value);
    input.input.push(denomination);
    input.input.push('');
    input.input.push(this.user.username);
    input.input.push(this.refDossier);
    input.input.push(10);

    this.walletService.saveTiers(input).subscribe(
      (data) => {

      },
      error => {
        console.log(error);
      });
  }

  //Fermeture de dossier
  async fermerLeDossier() {
    //console.log("dossier=",refDossier);
    let input = new InputRequest();
    input.input.push(this.refDossier);
    await this.walletService.fermerLeDossier(input).toPromise().then(
      (data) => {
        //console.log(data);
        if (data == "OK") {
          this.showNotification('top', 'right', 'success', 'Dossier fermé');
          //location.reload();          
          this.reloadSirenListAfetClose();
          this.search();
        }
      },
      error => {
        this.showNotification('top', 'right', 'danger', 'Erreur de fermeture');
      });
    //console.log(refDossier);
  }

  deleteTiers(mail, nom, code) {
    //console.log(this.refEtude, mail);
    let input = new InputRequest();
    input.input.push(mail);
    input.input.push(this.refDossier);    
    input.input.push(nom);  
    input.input.push(code);

    console.log('input to delete=',input);
    //this.openConfirmationDialog(input, etude);   
    this.walletService.deleteTiers(input).subscribe((data) => {   
      console.log('deleted=',data);   
    });      
  }

  /*web socket*/

  connect(url) {
    var socket = new SockJS(`${environment.apiUrl}/chat`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug=null;
    this.stompClient.connect({}, () => { this.onConnected(url) }, () => { this.onError })
  }
  onConnected(url) {   
    this.stompClient.subscribe(url, (data)=>{               
      let result=JSON.parse(data.body);
      //console.log('-------resut-------',result.input[0]);
      if (this.siren) { 
        this.loading = true;
        this.adapter.setLocale('fr');
        //console.log(this.user.email);        
        this.getRefEtudeByMail(this.user.email);        
        if(result.input[0]=='1') {this.getJugeCommissaireByEtudeSiren();}        
        if(result.input[0]=='2') {this.getMandataireJudiciaireByEtudeSiren();}        
        if(result.input[0]=='3') {this.getAvocatByEtudeSiren();}        
        if(result.input[0]=='7') {this.getCOAJByEtudeSiren();}        
        if(result.input[0]=='5') {this.getExpertComptableByEtudeSiren();}
        if(result.input[0]=='4') {this.getComptableByEtudeSiren();}      
        if(result.input[0]=='9') {this.getCommissaireByEtudeSiren();}
        
        this.loading = false;          
      }      
    });    
  }
  onError(error) {
    console.log(error);
  }
  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }    
    console.log("Disconnected");
  } 

  sendMessage(url, name) {
    //var from = document.getElementById('from').value;
    //var text = document.getElementById('text').value;
    this.stompClient.send(url, {},
      JSON.stringify({ 'input': name }));
  }

  /*End web socket*/ 

  showNotification(from, align, infoType, msg) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    //const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msg

    }, {
      type: infoType,
      timer: 4000,
      placement: {
        from: from,
        align: align
      },
      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="material-icons" data-notify="icon">notifications</i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }

  getDocumentEntrepriseByToken(token) {
    window.open(`https://api.pappers.fr/v1/document/telechargement?api_token=${environment.token}&token=` + token, "_blank");
  }

  goToBodaccParution(parution, bodacc, annonce) {
    window.open(`https://www.bodacc.fr/annonce/detail-annonce/` + bodacc + `/` + parution + `/` + annonce, "_blank");
  }
}
