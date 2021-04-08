import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { Role } from 'app/_models/role';
import { AccountService } from 'app/_services';
declare var $: any;

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  user=null;
  siren=null;
  conforme=true;

  userTmp=null;
  form: FormGroup;
  hide = true;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute
  ) { 
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nom: new FormControl(''),
      email: new FormControl(''),
      contact: new FormControl(''),
      password: new FormControl(''),
      confirm: new FormControl('')
    });
    
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      const siren = paramMap.get('siren');
      if (siren) {
        this.siren = siren;
      } else if (this.user.roles[0] == Role.user) {
        this.siren = this.user.username;
      }     
      if(this.siren){       
                 
      }      
    });
    
    this.loadProfile();
  }

  get f() { return this.form.controls; }

  loadProfile(){
    let input=new InputRequest();
    input.input.push(this.user.email);

    this.accountService.getProfile(input).subscribe((data)=>{
      this.userTmp=data;
      this.f.nom.setValue(data.nom);
      this.f.email.setValue(data.mail);
      this.f.contact.setValue(data.contact);
      this.f.password.setValue('');
      this.f.confirm.setValue('');
    });
  }  

  hasError() {
    if(this.f.password.value.length>0 && this.f.confirm.value.length>0){      
      if(this.f.password.value!=this.f.confirm.value){
        this.conforme=false;
        //console.log('non conforme')
      }else {
        this.conforme=true;
      }
    }else{
      this.conforme=true;
    }
  }

  public hasErrorReq = (controlName: string, errorName: string) => {
    return this.f[controlName].hasError(errorName);
  }

  async onSubmit() {
    let input=new InputRequest();
    input.input.push(this.user.email);
    input.input.push(this.f.nom.value);
    input.input.push(this.f.contact.value);
    input.input.push(this.f.password.value);

    
    if (this.conforme){
      await this.accountService.updateProfile(input).toPromise().then((data)=>{
        this.showNotification('top', 'right', 'success', 'Information mise à jour');        
      },
      (error)=>{
        this.showNotification('top', 'right', 'danger', 'Erreur de mise à jour');
      });
    }
    this.loadProfile();
    //console.log('update=',input);
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
