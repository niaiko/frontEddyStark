import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { LoginComponent } from './account/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';


const routes: Routes = [
  /*{
    path: '',
    redirectTo: 'administree', //redirection par defaut B.O ; Admin
    pathMatch: 'full',
    canActivate: [AuthGuard], data: { roles: [Role.admin, Role.bo] }
  },
  {
    path: '',
    redirectTo: 'fiche-entreprise', //redirection par defaut societe
    pathMatch: 'full',
    canActivate: [AuthGuard], data: { roles: [Role.user] }
  },*/
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
