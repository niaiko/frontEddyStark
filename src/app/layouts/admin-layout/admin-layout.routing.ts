import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

//const accountModule = () => import('../../account/account.module').then(x => x.AccountModule);    
import { AuthGuard } from '../../_helpers/auth.guard';
import { ChiffreAffaireComponent } from '../../chiffre-affaire/chiffre-affaire.component';
import { FicheEntrepriseComponent } from '../../fiche-entreprise/fiche-entreprise.component';
import { EtudesComponent } from '../../etudes/etudes.component';
import { AdministreeComponent } from '../../administree/administree.component';
import { Role } from '../../_models/role';
import { HistoriqueFichierComponent } from '../../historique-fichier/historique-fichier.component';
import { EnvoiFichierComponent } from '../../envoi-fichier/envoi-fichier.component';
import { BilanComponent } from '../../Bilan/bilan/bilan.component';
import { AvantApresComponent } from 'app/avant-apres/avant-apres.component';
import { RapprochementComponent } from 'app/rapprochement/rapprochement.component';
import { ProfilesComponent } from 'app/profiles/profiles.component';



export const AdminLayoutRoutes: Routes = [
    //{ path: 'dashboard',      component: DashboardComponent, canActivate: [AuthGuard] },
    //{ path: 'user-profile',   component: UserProfileComponent, canActivate: [AuthGuard] },
    //{ path: 'table-list',     component: TableListComponent, canActivate: [AuthGuard] },
    //{ path: 'typography',     component: TypographyComponent, canActivate: [AuthGuard] },
    //{ path: 'icons',          component: IconsComponent, canActivate: [AuthGuard] },
    //{ path: 'maps',           component: MapsComponent, canActivate: [AuthGuard] },
    //{ path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard] },
    //{ path: 'upgrade',        component: UpgradeComponent, canActivate: [AuthGuard] },            
    { path: 'fiche-entreprise',component: FicheEntrepriseComponent, canActivate: [AuthGuard],data: { roles: [Role.bo,Role.admin,Role.user] } },
    { path: 'etudes',component: EtudesComponent, canActivate: [AuthGuard], data: { roles: [Role.bo] }}, 
    { path: 'kpi',component: ChiffreAffaireComponent, canActivate: [AuthGuard], data: { roles: [Role.user] }}, 
    { path: 'administree', component: AdministreeComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin] } }, 
    { path: 'historique-fichier', component: HistoriqueFichierComponent, canActivate: [AuthGuard], data: { roles: [Role.user] } }, 
    { path: 'envoi-fichier', component: EnvoiFichierComponent, canActivate: [AuthGuard], data: { roles: [Role.user] } }, 
    { path: 'bilan-resultat', component: BilanComponent, canActivate: [AuthGuard], data: { roles: [Role.bo,Role.admin,Role.user] } },
    { path: 'avant-apres', component: AvantApresComponent, canActivate: [AuthGuard], data: { roles: [Role.bo,Role.admin,Role.user] } } , 
    { path: 'rapprochement', component: RapprochementComponent, canActivate: [AuthGuard], data: { roles: [Role.bo,Role.admin,Role.user] } }  ,
    { path: 'profile', component: ProfilesComponent, canActivate: [AuthGuard], data: { roles: [Role.bo,Role.admin,Role.user] } }          
];
