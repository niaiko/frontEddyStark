import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { InputRequest } from 'app/_models/Input';
import { Role } from 'app/_models/role';
import { AccountService, WalletService } from 'app/_services';
import { FicheEntrepriseService } from 'app/_services/ficheEntreprise';
import { RestitutionServices } from 'app/_services/restitution.service';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-avant-apres',
  templateUrl: './avant-apres.component.html',
  styleUrls: ['./avant-apres.component.css']
})
export class AvantApresComponent implements OnInit {

  siren = null;
  loading = false;

  periode = null;
  listPeriode = null;

  fiche = null;
  user = null;
  private readonly onDestroy = new Subject<void>();

  fiscal = new Map;
  fiscalav = new Map;

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

  loadAllData() {
    this.loading = true;
    this.fiscal.clear();
    this.fiscalav.clear();
    
    this.getBilanBySiren();
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
          this.fiscalav.set(str.tab, str.avant);
        }
      });
    }
  }    

  reloadData(event: MatSelectChange) {
    this.periode = event.value;
    this.loadAllData();
  }


  //fonction operationnel
  getTabTotalNetString(tabA, tabB): string {
    let total = this.getTabTotalNetNumber(tabA, tabB);
    let valeur: number = +total.toFixed();

    if (valeur < 0) {
      valeur = Math.abs(valeur);
      return '(' + valeur.toLocaleString('fr-fr') + ')';
    } else if (valeur == 0.0) {
      return "";
    }
    return valeur.toLocaleString('fr-fr');
  }

  getTabTotalNetStringAv(tabA, tabB): string {
    let total = this.getTabTotalNetNumberAv(tabA, tabB);
    let valeur: number = +total.toFixed();

    if (valeur < 0) {
      valeur = Math.abs(valeur);
      return '(' + valeur.toLocaleString('fr-fr') + ')';
    } else if (valeur == 0.0) {
      return "";
    }
    return valeur.toLocaleString('fr-fr');
  }

  getTabTotalNetNumber(tabA, tabB): number {
    return this.getTabTotalColNumber(tabA) - this.getTabTotalColNumber(tabB)
  }

  getTabTotalNetNumberAv(tabA, tabB): number {
    return this.getTabTotalColNumberAv(tabA) - this.getTabTotalColNumberAv(tabB)
  }

  getTabTotalColString(tabA): string {
    let total = this.getTabTotalColNumber(tabA);
    let valeur: number = +total.toFixed();

    if (valeur < 0) {
      valeur = Math.abs(valeur);
      return '(' + valeur.toLocaleString('fr-fr') + ')';
    } else if (valeur == 0.0) {
      return "";
    }
    return valeur.toLocaleString('fr-fr');
  }
  getTabTotalColStringAv(tabA): string {
    let total = this.getTabTotalColNumberAv(tabA);
    let valeur: number = +total.toFixed();

    if (valeur < 0) {
      valeur = Math.abs(valeur);
      return '(' + valeur.toLocaleString('fr-fr') + ')';
    } else if (valeur == 0.0) {
      return "";
    }
    return valeur.toLocaleString('fr-fr');
  }

  getTabTotalColNumber(tabA): number {
    let total: number = 0.0;

    tabA.forEach(tab => {
      if (this.fiscal.get(tab)) {
        total += this.fiscal.get(tab);
      }
    });

    return total;
  }

  getTabTotalColNumberAv(tabA): number {
    let total: number = 0.0;

    tabA.forEach(tab => {
      if (this.fiscalav.get(tab)) {
        total += this.fiscalav.get(tab);
      }
    });

    return total;
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

  getAmountByTabNetAv(tabA, tabB): string {
    let valA: number = 0.0;
    let valB: number = 0.0;
    let valC: number = 0.0;

    if (this.fiscalav.get(tabA)) {
      valA = this.fiscalav.get(tabA);
    }
    if (this.fiscalav.get(tabB)) {
      valB = this.fiscalav.get(tabB);
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

  getAmountByTabNum(tab): number {
    let valeur: number = 0.0;
    if (this.fiscal.get(tab)) {
      valeur = this.fiscal.get(tab);
    }
    return valeur;
  }
  getAmountByTabNumAv(tab): number {
    let valeur: number = 0.0;
    if (this.fiscalav.get(tab)) {
      valeur = this.fiscalav.get(tab);
    }
    return valeur;
  }

  getAmountByTab(tab): string {
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
  getAmountByTabAv(tab): string {
    if (this.fiscalav.get(tab)) {
      //console.log(tab,'=',this.fiscal.get(tab));
      let valeur: number = +this.fiscalav.get(tab).toFixed();
      if (this.fiscalav.get(tab) < 0) {
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

  getFiscalTabBySirenApres(cols) {
    let input: InputRequest = new InputRequest;
    input.input.push(this.siren);
    input.input.push(cols);
    input.input.push(this.periode);

    this.walletService.getFiscalTabBySirenApres(input).pipe(first()).subscribe((data) => {
      //console.log('tab[',cols,']=',data);
      for (let str of data) {
        //console.log(str);
        this.fiscal.set(cols, str.amount);
      }
    });
  }

  getFiscalTabBySirenAvant(cols) {
    let input: InputRequest = new InputRequest;
    input.input.push(this.siren);
    input.input.push(cols);
    input.input.push(this.periode);

    this.walletService.getFiscalTabBySirenAvant(input).pipe(first()).subscribe((data) => {
      //console.log('tab[',cols,']=',data);
      for (let str of data) {
        //console.log(str);
        this.fiscalav.set(cols, str.amount);
      }
    });
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
