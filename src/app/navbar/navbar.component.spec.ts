import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from '../app.component';
// modules
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import 'hammerjs';

import { CoreModule } from '../core/core.module';
import { SharedModule } from  '../shared/shared.module'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule , MdDialog  } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {APP_BASE_HREF} from '@angular/common';

// 3rd Party

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { NavbarComponent, DialogOverviewExampleDialog } from '../navbar/navbar.component';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { ComponentNavbarComponent } from '../component-navbar/component-navbar.component';
import { HomepageComponent } from '../homepage/homepage.component';


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarComponent,
        DashboardComponent,
        SidenavComponent,
        SidenavComponent,
        NavbarComponent,
        GenericFormComponent,
        ComponentNavbarComponent,
        HomepageComponent,
        DialogOverviewExampleDialog,

      ],
      imports:[
        MaterialModule.forRoot(),
        NgxDatatableModule,
        SharedModule,
        CommonModule,

        BrowserAnimationsModule,
        HttpModule,
        FormsModule,
        BrowserModule
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
