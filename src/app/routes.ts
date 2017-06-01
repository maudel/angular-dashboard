import {ModuleWithProviders} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GenericFormComponent} from './generic-form/generic-form.component'
import {SidenavComponent} from './sidenav/sidenav.component';
import {Routes, RouterModule} from '@angular/router';
import {ComponentNavbarComponent} from './component-navbar/component-navbar.component'
import {HomepageComponent} from './homepage/homepage.component'
const ANGULAR_MCON_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: SidenavComponent,
    children: [{
      path: 'configuration',
      component: ComponentNavbarComponent
    }, {
        path: 'configuration/:id',
        component: ComponentNavbarComponent
     },{
      path: '',
      redirectTo: 'configuration/zones',
      pathMatch: 'full'
    }, {
      path: '**',
      component: GenericFormComponent
    },{
      path: 'config/readers',
      component: DashboardComponent
    }]
  },{
    path: '',
    component:HomepageComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(ANGULAR_MCON_ROUTES);
