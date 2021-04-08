import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { Tiers } from 'app/_models/tiers';
import { AccountService, WalletService } from 'app/_services';
import { FicheEntrepriseService } from 'app/_services/ficheEntreprise';
import { RestitutionServices } from 'app/_services/restitution.service';
import { environment } from 'environments/environment';
declare var $: any;

@Component({
  selector: 'app-envoi-fichier',
  templateUrl: './envoi-fichier.component.html',
  styleUrls: ['./envoi-fichier.component.css']
})
export class EnvoiFichierComponent implements OnInit {
  fiche=null;
  administrateurs=null;

  loading = false;
  user = null;
  siren = null;
  fvalue = null;
  banque=null;
  propositionBanque=null;
  //fuseaux = [];
  banques=[];
  propositionBanques=[];

  isOfx=false;

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  form: FormGroup;

  fileInputLabel: string;
  //fileInputLabelOFX: string;
  input: InputRequest;
  submitted = false;

  @ViewChild('fileInput')
  fileInput;

  file: File | null = null;

  constructor(
    private walletService: WalletService,
    private ficheEntrepriseService: FicheEntrepriseService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private adapter: DateAdapter<any>,
    private restitutionService: RestitutionServices,
  ) {
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    this.siren = this.user.username;
    this.fileUploadForm = this.formBuilder.group({
      banque: [''],
      observation: [''],
      //fuseaux: [''],
      uploadedFile: ['', Validators.required]
    });

    this.adapter.setLocale('fr');

    this.form = new FormGroup({     
      banque: new FormControl('',Validators.required),
      imputation: new FormControl('',Validators.required) 
    });

    if(this.siren){
      this.loadFicheEntrepriseBySiren(this.siren);
      this.loadBanques();
      this.loadPropositionBanques();
      this.loadFuseauHoraire();      
    }
    
  }

  relode(event: MatSelectChange) {
    this.fvalue = event.value;    
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.g[controlName].hasError(errorName);
  }

  onSelect(event) {
    const file = event.target.files[0];
    if (file) {
      this.fileInputLabel = file.name;
      this.fileUploadForm.get('uploadedFile').setValue(file);
    }
    //console.log('extension=',);
    this.isOfx=false;
    let extension=this.fileInputLabel.substring(this.fileInputLabel.length-4,this.fileInputLabel.length);
    if(extension.toLocaleLowerCase()=='.txt'){
      this.isOfx=false;
    }else if(extension.toLocaleLowerCase()=='.ofx'){
      this.isOfx=true;
    }
  }
  onSelectBanque(event) {
    //console.log('banque selected=',event.value);
    this.banque=event.value;
  }

  relodePropositionBanque(event){
    this.propositionBanque=event.value;
    this.propositionBanques.forEach(element => {
      if(element.imputation===event.value){
        this.g.banque.setValue(element.libelle);
      }
    });
  }

  onBanqueSubmit(){
    let input=new InputRequest();
    input.input.push(this.siren);
    input.input.push(this.propositionBanque);
    input.input.push(this.g.banque.value);

    if(this.g.imputation.value && this.g.banque.value){
      this.walletService.addBanque(input).subscribe((data)=>{
        //this.showNotification('top', 'right', 'success', 'Banque ajoutée');
        this.loadBanques();
        this.loadPropositionBanques();
        this.g.banque.setValue('');
        this.g.imputation.setValue('');
      },(error)=>{
        //this.showNotification('top', 'right', 'danger', error);
      });
    }

    console.log(input);
  }

   loadFicheEntrepriseBySiren(siren) {
    this.ficheEntrepriseService.getFicheEntreprise(siren).subscribe((data) => {      
      this.fiche = data;      
    });
  }

  public async getCOAJByEtudeSiren() {
    let input = new InputRequest();
    input.input.push(this.siren);
    let refEtude2 = null;
    this.walletService.getRefEtudeDossierBySiren(input).toPromise().then((data) => {
      let refDossier = data[0].refDossier;
      refEtude2 = data[0].refEtude;
      let input = new InputRequest();
      input.input.push(refEtude2);
      input.input.push(refDossier);
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

  deleteBanque(imputation, banque){
    let input=new InputRequest();
    input.input.push(this.siren);
    input.input.push(imputation);
    input.input.push(banque);
    this.walletService.deleteBanque(input).subscribe((data)=>{
      ///this.showNotification('top', 'right', 'success', 'Banque supprimée');
      this.loadBanques();
    },(error)=>{
      //this.showNotification('top', 'right', 'danger', error);
    });
  }

  async onFormSubmit() {
    if (!this.fileUploadForm.get('uploadedFile').value) {
      //console.log('Merci de vouloir inserer un fichier FEC ou OFX');
      this.showNotification('top', 'right', 'warning', 'Merci de vouloir inserer un fichier FEC ou OFX')
      return false;
    }

    this.showNotification('top', 'right', 'warning', 'Les traitements peuvent prendre un moment en fonction du contenu');
    this.showNotification('top', 'right', 'info', 'Vous recevrez un mail une fois les traitements achevés. Merci de patienter');
    this.loading=true;

    //console.log(this.fileUploadForm.get('uploadedFile').value.name)
    if(this.banque && this.fileInputLabel){
      let input2=new InputRequest();
      input2.input.push(this.siren);
      input2.input.push(this.banque);
      input2.input.push(this.fileInputLabel);
      await this.restitutionService.addOfxAndBanque(input2).toPromise().then((data)=>{
        //console.log('save ofx banque=',data);
      });
    }

    const formData = new FormData();
    var updataFEC = this.fileUploadForm.get('uploadedFile').value;
    formData.append('uploadedFile', updataFEC);
    formData.append('siren', this.siren);
    formData.append('observation', this.f.observation.value);
    //formData.append('region', this.f.fuseaux.value);
    formData.append('region', this.fvalue);    

    ;
    //this.getCOAJByEtudeSiren();    

    let input = new InputRequest();
    input.input.push(this.siren);
    input.input.push(updataFEC.name);
    input.input.push(this.user.email);
    input.input.push(this.fiche.denomination );
    
   
    //console.log(this.f.fuseaux.value);    

    await this.http.post<any>(`${environment.apiUrl}/wallets/upload`, formData).toPromise().then(response => {
      //console.log("Eto ", response);
      if (response == "OK") {
        this.uploadFileInput.nativeElement.value = "";
        this.fileInputLabel = undefined;
        this.fileUploadForm.get('uploadedFile').setValue(undefined);
        this.f.observation.setValue("");
        //console.log('');
        //this.showNotification('top', 'right', 'success', 'Fichiers sauvegardés');                
      } else {
        //console.log(response);
        this.showNotification('top', 'right', 'danger', 'Erreur de traitement');
      }
    }, err => {
      //console.log(err);
      this.showNotification('top', 'right', 'danger', 'Erreur de traitement');
    });

    await this.http.post<any>(`${environment.apiUrl}/traitement/extract`, input).toPromise().then(response => {
      //console.log("Eto ", response);
      if (response == "OK") {
        //console.log('Chargement du contenu achevé');
        //this.showNotification('top', 'right', 'success', 'Chargement du contenu achevé');
        this.showNotification('top', 'right', 'success', 'Fin de traitement');
        this.loading=false;
      } else {
        //console.log(response);
        this.showNotification('top', 'right', 'danger', 'Erreur de traitement');
      }
    }, err => {
      //console.log(err);
      this.showNotification('top', 'right', 'danger', 'Erreur de traitement');
    });
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }
  get f() { return this.fileUploadForm.controls; }
  get g() { return this.form.controls; }

  async loadFuseauHoraire() {
    //this.fuseaux = null;
    let input=new InputRequest();
    input.input.push('Europe/Paris');

    await this.walletService.getFuseauHoraireByRegion(input).toPromise().then(
      (data) => {        
        this.fvalue = data.region;
        //this.fuseaux = data;
        //this.f.fuseaux.patchValue(this.fuseaux[0].region);
        //console.log(this.fuseaux[326].region);
      },
      error => {
      });
  }

  async loadBanques(){
    this.banque=null;
    let input= new InputRequest();
    input.input.push(this.siren);
    this.banques=[];
    await this.walletService.getBanque(input).toPromise().then((data)=>{
      //console.log('banques=',data);
      if (data.length>0){
        this.banque=data[0].imputation;
        this.f.banque.patchValue(this.banque);
        this.banques=data;
      }      
    });
  }

  async loadPropositionBanques(){
    this.propositionBanque=null;
    let input= new InputRequest();
    input.input.push(this.siren);
    this.propositionBanques=[];
    await this.restitutionService.getPropositionBanque(input).toPromise().then((data)=>{
      //console.log('banques=',data);
      if(data.length>0){
        this.propositionBanque=data[0].imputation;
        this.g.imputation.patchValue(this.propositionBanque);
        this.propositionBanques=data;
        this.g.banque.setValue(data[0].libelle);
      }      
    });
    //console.log(this.propositionBanques);   
  }

  showNotification(from, align, infoType, msg) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    //const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msg

    }, {
      type: infoType,
      timer: 6000,
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
