import { NgModule , LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from '../../_helpers/error.interceptor';
import { JwtInterceptor } from '../../_helpers/jwt.interceptor';
import { ChiffreAffaireComponent } from '../../chiffre-affaire/chiffre-affaire.component';
import {MatListModule} from '@angular/material/list';
import { FicheEntrepriseComponent } from '../../fiche-entreprise/fiche-entreprise.component';
import { EtudesComponent } from '../../etudes/etudes.component';
import { AdministreeComponent } from '../../administree/administree.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HistoriqueFichierComponent } from '../../historique-fichier/historique-fichier.component';
import { DashboardChecklistComponent } from '../../dashboard-checklist/dashboard-checklist.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DashboardEcritureComponent } from '../../dashboard-ecriture/dashboard-ecriture.component';
import { DashboardActifPassifComponent } from '../../dashboard-actif-passif/dashboard-actif-passif.component';
import { EnvoiFichierComponent } from '../../envoi-fichier/envoi-fichier.component';
import { BilanComponent } from '../../Bilan/bilan/bilan.component';
import { ChartsModule } from 'ng2-charts';
import { AvantApresComponent } from 'app/avant-apres/avant-apres.component';
import { TiersFormComponent } from 'app/tiers-form/tiers-form.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { RapprochementComponent } from 'app/rapprochement/rapprochement.component';
import { ProfilesComponent } from 'app/profiles/profiles.component';
import { WebsocketService } from 'app/_services/WebsocketService';
import { MessageService } from 'app/_services/MessageService';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

registerLocaleData(localeFr);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,    
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatListModule, 
    MatTabsModule,
    ChartsModule,
    MatDatepickerModule,    
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,    
    NotificationsComponent,
    UpgradeComponent,
    ChiffreAffaireComponent,
    FicheEntrepriseComponent,
    EtudesComponent,
    AdministreeComponent,
    HistoriqueFichierComponent,    
    DashboardChecklistComponent,
    DashboardEcritureComponent,
    DashboardActifPassifComponent,
    EnvoiFichierComponent,
    BilanComponent,
    AvantApresComponent,
    TiersFormComponent,
    RapprochementComponent,
    ProfilesComponent,    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    MatDatepickerModule,
    DatePipe,
    WebsocketService,
    MessageService
  ]
})

export class AdminLayoutModule {}
