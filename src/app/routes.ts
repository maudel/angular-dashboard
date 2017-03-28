import {ModuleWithProviders} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {Routes, RouterModule} from '@angular/router';


const ANGULAR_MCON_ROUTES: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      {path: '', component: DashboardComponent}
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(ANGULAR_MCON_ROUTES);
