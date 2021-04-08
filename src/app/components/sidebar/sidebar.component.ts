import { Component, OnInit } from '@angular/core';
import { InputRequest } from 'app/_models/Input';
import { Role } from 'app/_models/role';
import { AccountService, WalletService } from 'app/_services';
import { FicheEntrepriseService } from 'app/_services/ficheEntreprise';
import { Subscription } from 'rxjs';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  //{ path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  //{ path: '/user-profile', title: 'User Profile', icon: 'person', class: '' },
  //{ path: '/table-list', title: 'Table List', icon: 'content_paste', class: '' },
  //{ path: '/typography', title: 'Typography', icon: 'library_books', class: '' },
  //{ path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '' },
  //{ path: '/maps', title: 'Maps', icon: 'location_on', class: '' },
  //{ path: '/notifications', title: 'Notifications', icon: 'notifications', class: '' },
  //{ path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },  
  //{ path: '/etudes', title: 'Etudes', icon: 'list', class: '' },
  { path: '/kpi', title: 'KPI', icon: 'dashboard', class: '' },
  { path: '/bilan-resultat', title: 'Bilan & Résultat', icon: 'description', class: '' },
  { path: '/avant-apres', title: 'Avant & Après', icon: 'description', class: '' },
  { path: '/rapprochement', title: 'Rapprochement bancaire', icon: 'account_balance', class: '' },
  { path: '/fiche-entreprise', title: 'Fiche entreprise', icon: 'content_paste', class: '' },
  { path: '/historique-fichier', title: 'Historiques fichier', icon: 'description', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  //menuItems: any[];
  refEtude = null;
  loading = false;
  uniteLegaleListe: any[];
  user = null;
  

  clickEventsubscription: Subscription;

  constructor(
    private walletService: WalletService,
    private accountService: AccountService,
    private ficheEntrepriseService:FicheEntrepriseService
  ) {
    this.user = this.accountService.userValue;

    this.clickEventsubscription = this.accountService.getClickEvent().subscribe(() => {
      this.loadMenu();
    })
  }

  ngOnInit() {
    this.loadMenu();
    //this.uniteLegaleListe = ROUTES.filter(menuItem => menuItem);
  } 


  
  loadMenu() {
    if (this.isAdmin()) {
      this.getRefEtudeByMail(this.user.email);
    } else if (this.isUser()) {
      this.uniteLegaleListe = ROUTES.filter(menuItem => menuItem);
    } else if (this.isBO()) {
      this.getRefEtudeByMail(this.user.email);
    }
  }

  isAdmin() {
    if (this.user.roles[0] == Role.admin) {
      return true;
    }
    return false;
  }

  isBO() {
    if (this.user.roles[0] == Role.bo) {
      return true;
    }
    return false;
  }

  isUser() {
    if (this.user.roles[0] == Role.user) {
      return true;
    }
    return false;
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  getRefEtudeByMail(mail) {
    let input = new InputRequest();
    //console.log("Mail=",mail)
    input.input.push(mail);
    this.walletService.getRefEtudeByMail(input).subscribe(
      (data) => {
        this.refEtude = data[0];
        this.getUniteLegaleListByEtude(this.refEtude);
      }
    );
  }

  getUniteLegaleListByEtude(refEtude) {
    this.uniteLegaleListe = [];
    this.loading = true;
    let input = new InputRequest();
    input.input.push(refEtude);

    this.walletService.getUniteLegaleListByEtudeNoPage(input).subscribe((data) => {
      //console.log(data);    
      data.forEach((unite) => {
        this.ficheEntrepriseService.getFicheEntreprise(unite.siren).subscribe((data2) => {
          this.uniteLegaleListe.push({
            path: '/administree',
            siren: data2.siren,
            denomination: data2.denomination,
            icon: 'apartment',
            class: ''
          });
        });        
      });
      this.loading = false;
    });
  }  
}
