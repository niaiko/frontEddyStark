import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { Role } from 'app/_models/role';
import { AccountService, WalletService } from 'app/_services';

@Component({
  selector: 'app-historique-fichier',
  templateUrl: './historique-fichier.component.html',
  styleUrls: ['./historique-fichier.component.css']
})
export class HistoriqueFichierComponent implements OnInit {
  historiques = null;
  dernierEnvois = null;
  siren = null;
  loading = false;
  user=null;
  divClass=null;

  constructor(
    private walletService: WalletService,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    if(this.user.roles[0]==Role.user){
      this.divClass='main-content';
    }else{
      this.divClass='';
    }

    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      const siren = paramMap.get('siren');
      if (siren) {
        this.siren = siren;        
      } else if (this.user.roles[0]==Role.user) {
        this.siren=this.user.username;
      }
      if(this.siren){
        this.loading = true;
        this.loadLastHistorique();
      }
    });
  }

  async loadLastHistorique() {
    this.dernierEnvois = null;
    let input = new InputRequest();
    input.input.push(this.siren);

    this.loading = true;

    await this.walletService.getWalletFileLastHistories(input).toPromise().then(
      (data) => {
        this.loading = false;
        this.dernierEnvois = data;        
      },
      error => {
      });
    this.loadHistorique(0);
  }

  loadHistorique(page) {
    this.loading = true;
    this.historiques = null;
    let input = new InputRequest();
    input.input.push(this.siren);
    this.walletService.getWalletFileHistories(input).subscribe(
      (data) => {
        //this.p = page;
        this.historiques = data;
        this.loading = false;
        if (!data) {
        }
      },
      error => {
      });
  }
}
