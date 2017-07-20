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
      }, {
        path: 'status',
        loadChildren: 'app/status/status.module#StatusModule'
      }, {
        path: 'view',
        loadChildren: 'app/view/view.module#ViewModule'
      }, {
        path: '',
        loadChildren: 'app/save-restore/save-restore.module#SaveRestoreModule'
      }, {
        path: 'help',
        loadChildren: 'app/help/help.module#HelpModule'
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

