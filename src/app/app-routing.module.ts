import {ModuleWithProviders, NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GenericFormComponent} from './generic-form/generic-form.component'
import {SidenavComponent} from './sidenav/sidenav.component';
import {Routes, RouterModule} from '@angular/router';
import {ComponentNavbarComponent} from './component-navbar/component-navbar.component'
import {HomepageComponent} from './homepage/homepage.component'

const APP_ROUTES: Routes = [
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
      redirectTo: 'configuration/readers',
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


const appRouting = RouterModule.forRoot(APP_ROUTES, {
  useHash: true,
  // enableTracing: true,
  // preloadingStrategy: PreloadAllModules
});

@NgModule({
  imports: [ appRouting ],
  exports: [ RouterModule ],
  providers: [  ]
})
export class AppRoutingModule {}

