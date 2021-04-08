import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil, first, timestamp } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { InputRequest } from '../../_models/Input';
import { WalletService } from '../../_services/wallet.service';
import { AccountService } from '../../_services';
import { Role } from '../../_models/role';
import { FicheEntrepriseService } from 'app/_services/ficheEntreprise';
import { MatSelectChange } from '@angular/material/select';
import { RestitutionServices } from 'app/_services/restitution.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bilan',
  templateUrl: './bilan.component.html',
  styleUrls: ['./bilan.component.css']
})
export class BilanComponent implements OnInit {
  siren = null;
  loading = false;

  periode = null;  

  fiche = null;
  user = null;
  private readonly onDestroy = new Subject<void>();

  fiscal = new Map;
  fiscalAvant = new Map;
  societe = null;
  divClass = null;

  @ViewChild('contentToConvert') content: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private accountService: AccountService,
    private restitutionService: RestitutionServices,
    private ficheEntrepriseService: FicheEntrepriseService
  ) {
    this.siren = this.route.snapshot.paramMap.get("siren");
    this.user = this.accountService.userValue;
  }


  ngOnInit(): void {
    if (this.isUser()) {
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
        this.loadFicheEntrepriseBySiren(this.siren);
        this.getListPeriodeBySiren(this.siren);
      }
    });
  }

  loadAllData() {
    this.loading = true;
    this.fiscal.clear();
    this.fiscalAvant.clear();
    
    this.getBilanBySiren();
  }

  async getListPeriodeBySiren(siren) {
    let input = new InputRequest();
    input.input.push(siren);    

    //console.log(input);
    await this.restitutionService.getDernierDateArret(input).toPromise().then((data)=>{
      this.periode=data[0];
    },(error)=>{
      //console.log('errrror=',error);
    });    
    this.loadAllData();
  }

  reloadData(event: MatSelectChange) {
    this.periode = event.value;
    this.loadAllData();
  }
  getAmountByTabNet(tabA, tabB): string {
    let valA: number = 0.0;
    let valB: number = 0.0;
    let valC: number = 0.0;

    if (this.fiscal.get(tabA)) {
      valA = this.fiscal.get(tabA);
    }
    if (this.fiscal.get(tabB)) {
      valB = this.fiscal.get(tabB);
    }
    valC = valA + valB;

    let valeur: number = +valC.toFixed();

    if (valeur < 0) {
      valeur = Math.abs(valeur);
      return '(' + valeur.toLocaleString('fr-fr') + ')';
    } else if (valeur == 0.0) {
      return "";
    }
    return valeur.toLocaleString('fr-fr');
  }

  getAmountByTabNetAvant(tabA, tabB): string {
    let valA: number = 0.0;
    let valB: number = 0.0;
    let valC: number = 0.0;

    if (this.fiscalAvant.get(tabA)) {
      valA = this.fiscalAvant.get(tabA);
    }
    if (this.fiscalAvant.get(tabB)) {
      valB = this.fiscalAvant.get(tabB);
    }
    valC = valA + valB;

    let valeur: number = +valC.toFixed();

    if (valeur < 0) {
      valeur = Math.abs(valeur);
      return '(' + valeur.toLocaleString('fr-fr') + ')';
    } else if (valeur == 0.0) {
      return "";
    }
    return valeur.toLocaleString('fr-fr');
  }

  getAmountByTab(tab): string {
    //console.log('tabs=',this.fiscal.get(tab));
    if (this.fiscal.get(tab)) {
      //console.log(tab,'=',this.fiscal.get(tab));
      let valeur: number = +this.fiscal.get(tab).toFixed();
      if (this.fiscal.get(tab) < 0) {
        valeur = Math.abs(valeur);
        return '(' + valeur.toLocaleString('fr-fr') + ')';
      }
      return valeur.toLocaleString('fr-fr');
    }
    return "";
  }

  getAmountByTabAvant(tab): string {
    //console.log('tabs=',this.fiscal.get(tab));
    if (this.fiscalAvant.get(tab)) {
      //console.log(tab,'=',this.fiscal.get(tab));
      let valeur: number = +this.fiscalAvant.get(tab).toFixed();
      if (this.fiscalAvant.get(tab) < 0) {
        valeur = Math.abs(valeur);
        return '(' + valeur.toLocaleString('fr-fr') + ')';
      }
      return valeur.toLocaleString('fr-fr');
    }
    return "";
  }

  async loadFicheEntrepriseBySiren(siren) {
    await this.ficheEntrepriseService.getFicheEntreprise(siren).toPromise().then((data) => {
      this.fiche = data;
    });
  }

  getBilanBySiren() {
    if(this.periode){
      let input: InputRequest = new InputRequest;
      input.input.push(this.siren);    
      input.input.push(this.periode);      
  
      this.walletService.getBilanBySiren(input).pipe(first()).subscribe((data) => {
        //console.log('tab[]=',data);
        for (let str of data) {
          //console.log(str);
          let tab=[];
          tab.push(str.avant);
          tab.push(str.amount);
          this.fiscal.set(str.tab, str.amount);
          this.fiscalAvant.set(str.tab, str.avant);
        }
      });
    }    
  }


  isUser() {
    if (this.user.roles[0] == Role.user) {
      return true;
    }
    return false;
  }


  SavePDF() {
    var data = document.getElementById('contentToConvert1');
    html2canvas(data).then(canvas => {
      var imgWidth = 208; //208
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF();
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('bilan_actif_' + this.siren + '_' + this.periode + '.pdf');
    });

    data = document.getElementById('contentToConvert2');
    html2canvas(data).then(canvas => {
      var imgWidth = 208; //208
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF();
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('bilan_passif_' + this.siren + '_' + this.periode + '.pdf');
    });

    data = document.getElementById('contentToConvert3');
    html2canvas(data).then(canvas => {
      var imgWidth = 208; //208
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF();
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('compte_de_resultat_' + this.siren + '_' + this.periode + '.pdf');
    });

    data = document.getElementById('contentToConvert4');
    html2canvas(data).then(canvas => {
      var imgWidth = 208; //208
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF();
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('compte_de_resultat_suite_' + this.siren + '_' + this.periode + '.pdf');
    });
  }
}
