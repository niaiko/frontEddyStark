import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Role } from 'app/_models/role';
import { AccountService } from 'app/_services';

@Component({
  selector: 'app-administree',
  templateUrl: './administree.component.html',
  styleUrls: ['./administree.component.css']
})
export class AdministreeComponent implements OnInit {
  siren=null;
  user=null;  

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) { 
    this.user = this.accountService.userValue;     
  }

  ngOnInit(): void { 
    //console.log('--------> ',this.user);
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      const siren = paramMap.get('siren');
      if (siren) {        
        this.siren=siren;        
      }
    });
  }

  isUser(){
    if(this.user.roles[0]==Role.user){
      return true;
    }
    return false;
  }
}
