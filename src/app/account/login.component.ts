import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService /*,ToastService*/ } from '../_services';
declare var $: any;


@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    hide = true;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        //public toastService: ToastService,        
        private accountService: AccountService,
    ) { }


    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required])
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.f[controlName].hasError(errorName);
    }
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        //console.log("check!");

        this.loading = true;

        this.accountService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                    this.loading = false;
                    //console.log("Tafiditra=",data);
                    //this.notification.showNotification('top','center','success');
                },
                error => {
                    //this.showDanger(error);
                    //this.notification.showNotification('top','center','danger');
                    //console.log("Error=",error);
                    this.loading = false;
                    this.showNotification('top', 'right', 'danger', 'Mots de passe ou utilisateur incorrect');
                });
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