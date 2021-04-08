import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'app/_models';
import { EtudePrincipal } from 'app/_models/etudePrincipal';
import { EtudeTiers } from 'app/_models/etudeTiers';
import { InputRequest } from 'app/_models/Input';
import { AccountService, WalletService } from 'app/_services';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Mandataire } from 'app/_models/mandataire';
import {map, startWith} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-etudes',
  templateUrl: './etudes.component.html',
  styleUrls: ['./etudes.component.css'],
  providers: [DecimalPipe]
})
export class EtudesComponent implements OnInit {

  users = null;
  user: User;  
  filter = new FormControl('');
  //form: FormGroup;
  closeResult = null;
  loading: boolean;
  private stompClient;
  

  //liste a afficher
  etudes: EtudePrincipal[] = [];

  refEtude=null;  
  allAJ=[];

  filteredOptions: Observable<string[]>;
  nom = new FormControl();

  libelleEtude=null;
  form: FormGroup;
  formAttach: FormGroup;
  admins=[];

  constructor(
    private accountService: AccountService,
    private pipe: DecimalPipe,
    private walletService: WalletService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
  ) {
    //this.loadData()
    this.user = this.accountService.userValue;
    //console.log(this.user);
  }

  ngOnInit() {
    this.form = new FormGroup({
      libelle: new FormControl('', [Validators.required])      
    });

    this.formAttach = new FormGroup({
      ///nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required])
    });

    this.filteredOptions = this.nom.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/fiche-entreprise';     

    this.loadData();
    this.connect('/topic/updateFicheEntreprise');    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allAJ.filter(option => option.nom.toLowerCase().includes(filterValue));
  }

  fillInfo(nom){
    this.allAJ.forEach(element => {
      if (element.nom==nom){
        this.g.email.setValue(element.mail);
        this.g.contact.setValue(element.contact);
      }
    });
  }

  detacherAdminJudiciaire(mail, nom) {
    let input = new InputRequest();
    input.input.push(mail);
    input.input.push(this.refEtude);
    input.input.push(nom);    

    //this.openConfirmationDialog(input, etude);   
    this.walletService.detacherTiersEtude(input).subscribe((data) => {
      //this.showSuccess('Administrateur Judiciaire supprimé');
      //this.showNotification('top', 'right', 'success', 'Administrateur Judiciaire supprimé');
      this.detail(this.refEtude,this.libelleEtude);
    });
  }
  deleteAdminJudiciaire(mail) {
   // console.log(this.refEtude, mail);
    let input = new InputRequest();
    input.input.push(mail);   

    //this.openConfirmationDialog(input, etude);   
    this.walletService.deleteTiersEtude(input).subscribe((data) => {
      //this.showSuccess('Administrateur Judiciaire supprimé');
      //this.showNotification('top', 'right', 'success', 'Administrateur Judiciaire supprimé');
      this.getTiersAJAll();
    });      
  }

  /*public openConfirmationDialog(input, etude) {
    this.confirmationDialogService.confirm('Confirmation', 'Voulez-vous vraiment supprimer ' + input.input[2] + '?')
      .then((confirmed) => {
        if (confirmed) {
          this.walletService.deleteTiersEtude(input).subscribe((data) => {
            this.showSuccess('Administrateur Judiciaire supprimé');
            this.adminListe.set(etude.refEtude, this.getEtudeTiersList(etude.refEtude));
          });
        }
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }*/

  connect(url) {
    var socket = new SockJS(`${environment.apiUrl}/chat`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug=null;
    this.stompClient.connect({}, () => { this.onConnected(url) }, () => { this.onError })
  }
  onConnected(url) {   
    this.stompClient.subscribe(url, (data)=>{               
      let result=JSON.parse(data.body);
      if(result.input[0]=='7') {
        this.admins=[];        
        this.admins=this.getEtudeTiersList(this.refEtude);
        this.getTiersAJAll();
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

  //Fermeture de dossier
  fermerEtude(refEtude) {
    let input = new InputRequest();
    input.input.push(refEtude);
    this.walletService.fermerEtude(input).subscribe(
      (data)=>{ 
        //console.log(data);        
        this.loadData();
      } ,      
      error => {        
        this.showNotification('top', 'right', 'danger', 'Erreur lors de la fermeture');    
      }); 
  }

  

  async loadData() {
    this.etudes = [];    
    this.loading = true;    
    await this.walletService.getAllEtudesPrincipal().toPromise().then(
      (data) => {
        this.etudes=data;        
        this.loading = false;
      },
      error => {
        //this.showDanger('Erreur d\'ouverture');
        console.log('Erreur d\'ouverture');
      });    
    try {
      this.refEtude=this.etudes[0].refEtude;
      this.libelleEtude=this.etudes[0].libelle;
      this.admins=this.getEtudeTiersList(this.etudes[0].refEtude); 
      this.getTiersAJAll();
    } catch (error) {      
    }    
  }
  
  getEtudeTiersList(refEtude): EtudeTiers[] {
    let input = new InputRequest();
    input.input.push(refEtude);

    let etudeTiers: EtudeTiers[] = [];
    this.walletService.getEtudeTiersList(input).subscribe((data) => {      
      for (let str of data) {
        let etude: EtudeTiers = new EtudeTiers;
        etude.contact = str.contact;
        etude.dateInsert = str.dateInsert;
        etude.mail = str.mail;
        etude.nom = str.nom;
        etude.refEtude = str.refEtude;
        etude.userInsert = str.userInsert;

        etudeTiers.push(etude);
      }
    });
    return etudeTiers;
  }

  search(text: string, pipe: PipeTransform): User[] {
    return this.users.filter(user => {
      const term = text.toLowerCase();
      //console.log(user.firstName.toLowerCase().includes(term)|| user.lastName.toLowerCase().includes(term))
      return user.firstName.toLowerCase().includes(term) || user.lastName.toLowerCase().includes(term);
    });
  }

  detail(refEtude,libelleEtude){
    this.refEtude=refEtude;
    this.libelleEtude=libelleEtude;
    this.admins=this.getEtudeTiersList(refEtude);    
  }

  getTiersAJAll(){
    this.allAJ=[];
    this.walletService.getTiersAJAll().subscribe((data)=>{
      this.allAJ=data;
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.f[controlName].hasError(errorName);
  }

  get f() { return this.form.controls; }

  public hasErrorAttach = (controlName: string, errorName: string) => {
    return this.g[controlName].hasError(errorName);
  }
  get g() { return this.formAttach.controls; }

  async onSubmit() {    
    if(this.f.libelle.value){
      let input=new InputRequest();
      input.input.push(this.f.libelle.value);
      input.input.push(this.user.email);

      await this.walletService.ouvrirUnEtude(input).toPromise().then((data)=>{
        this.f.libelle.setValue('');
        this.loadData();
      } ,      
      error => {        
        this.showNotification('top', 'right', 'danger', 'Erreur lors de la fermeture'); 
      }); 
    }    
  }

  onAtachAJ(){
    if(this.g.email.value){
      let input=new InputRequest();
      input.input.push(this.g.email.value);
      input.input.push(this.user.username.trim());
      input.input.push(this.refEtude);

      this.walletService.attachEtudeTiers(input).toPromise().then((data) => {
        this.loading = false;
        this.nom.setValue('');
        this.g.email.setValue('');
        this.g.contact.setValue('');
      },
      error => {
        //console.log(error);
      });
    }
  }
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
}
