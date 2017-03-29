import {ModuleWithProviders} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GenericFormComponent} from './generic-form/generic-form.component'
import {SidenavComponent} from './sidenav/sidenav.component';
import {Routes, RouterModule} from '@angular/router';
import {ComponentNavbarComponent} from './component-navbar/component-navbar.component'

const ANGULAR_MCON_ROUTES: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [{
      path: 'hardware',
      component: DashboardComponent
    },{
      path: '',
      redirectTo: '/hardware',
      pathMatch: 'full'
    },
      {
      path: '**',
      component: GenericFormComponent
    }],
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(ANGULAR_MCON_ROUTES);
