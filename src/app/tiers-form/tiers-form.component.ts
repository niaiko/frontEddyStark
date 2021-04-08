import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/_models';
import { InputRequest } from 'app/_models/Input';
import { AccountService, WalletService } from 'app/_services';
import { MessageService } from 'app/_services/MessageService';
import { WebsocketService } from 'app/_services/WebsocketService';
import { environment } from 'environments/environment';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-tiers-form',
  templateUrl: './tiers-form.component.html',
  styleUrls: ['./tiers-form.component.css']
})
export class TiersFormComponent implements OnInit {
  @Input() typeTiers: string;
  @Input() siren: string;
  @Input() refDossier: string;
  @Input() refEtude: string;
  @Input() email: string;

  user = null;
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = null;

  currentMeeting = null;
  private stompClient;

  constructor(
    private walletService: WalletService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService,
    private readonly websocketService: WebsocketService
  ) {
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required])
    });
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/fiche-entreprise';    
    this.connect('/topic/updateFicheEntreprise');
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
      /*let result=JSON.parse(data.body);
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
      }      */
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


  public hasError = (controlName: string, errorName: string) => {
    return this.f[controlName].hasError(errorName);
  }
  get f() { return this.form.controls; }


  async onSubmit() {
    this.submitted = true;
    // si dossier
    //console.log('type_code=',this.typeTiers);

    if (this.typeTiers != '7') {
      let input = new InputRequest();
      input.input.push(this.siren);
      //console.log('refDoss 1',this.refDossier);
      if (!this.refDossier) {
        await this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
          this.refDossier = data[0].refDossier;
          //console.log('refDoss 2',this.refDossier);
        });
      }
      if (this.f.email.value && this.f.nom.value && this.f.contact.value) {
        this.loading = true;

        let input = new InputRequest();
        input.input.push(this.f.email.value);
        input.input.push(this.f.nom.value);
        input.input.push(this.f.contact.value);
        input.input.push(this.siren);
        input.input.push(this.refDossier);
        input.input.push(this.typeTiers);
        //console.log('input=',input);

        this.walletService.saveTiers(input).toPromise().then(
          (data) => {
            this.loading = false;
          },
          error => {
            console.log(error);
          });
        this.f.email.setValue('');
        this.f.nom.setValue('');
        this.f.contact.setValue('');
      }
    } else if (this.typeTiers == '7') { //si AJ dans etude
      var roles: string[] = [];
      roles.push("admin");

      if (this.f.email.value && this.f.nom.value && this.f.contact.value) {
        this.loading = true;

        let input = new InputRequest();
        input.input.push(this.f.email.value.trim());
        input.input.push(this.f.nom.value.trim());
        input.input.push(this.f.contact.value.trim());
        input.input.push(this.user.username.trim());
        input.input.push(this.refEtude.trim());
        input.input.push(this.typeTiers);
        //console.log('input=',input);

        this.walletService.saveTiersEtude(input).toPromise().then((data) => {          
        },
        error => {
          console.log(error);
        });

        /*this.walletService.attachEtudeTiers(input).toPromise().then((data) => {
          this.loading = false;        
        },
        error => {
          console.log(error);
        });*/

        var user: User = new User();
        user.username = this.f.nom.value.trim();
        user.email = this.f.email.value.trim();
        user.password = "";
        user.role = roles;

        this.walletService.saveAdminJudiciaire(user).toPromise().then((data) => {
        },
          error => {
            console.log(error);
          });

        this.f.email.setValue('');
        this.f.nom.setValue('');
        this.f.contact.setValue('');
        //console.log(input);
        //this.websocketService.sendMessage('/app/updateFicheEntreprise','getComptableByEtudeSiren');
      }
    }
    //this.websocketService.disconnect();
  }
}
