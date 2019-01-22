import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


import { AuthGuard } from './core/guards/auth.guard';
import {TestDashboradComponent} from './test-dashborad/test-dashborad.component'
import { TestTableComponent} from './test-table/test-table.component'
const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: 'app/dashboard/dashboard.module#DashboardModule',

  }, {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    loadChildren: 'app/home/home.module#HomeModule'
  }, {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule'
  },
  {
    path: 'test',
    component: TestDashboradComponent
  },
  {
    path: 'table',
    component: TestTableComponent
  }
];


const appRouting = RouterModule.forRoot(APP_ROUTES, {
  useHash: true,
  // enableTracing: true,
  // preloadingStrategy: PreloadAllModules
});

@NgModule({
  imports: [appRouting],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}

