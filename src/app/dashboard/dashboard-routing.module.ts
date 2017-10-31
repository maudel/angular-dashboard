import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SidenavComponent} from './sidenav/sidenav.component';

// import { AuthGuard } from './core/guards/auth.guard';

const APP_ROUTES: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [{
      path: '',
      redirectTo: 'configuration',
    }
      , {
        path: 'configuration',
        loadChildren: 'app/configuration/configuration.module#ConfigurationModule'
      }]
  }
];


const appRouting = RouterModule.forChild(APP_ROUTES);

@NgModule({
  imports: [appRouting],
  exports: [RouterModule],
  providers: []
})
export class DashboardRoutingModule {
}

