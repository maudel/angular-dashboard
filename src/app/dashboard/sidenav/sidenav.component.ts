import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import {MatExpansionPanel} from "@angular/material";
const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  sideElems = [];
  @ViewChild('myaccordion') myPanels: MatExpansionPanel;

  constructor() { }

  ngOnInit() {
    this.sideElems = [
      {
        id: 'config',
        name: 'Seguridad',
        summary: 'See Configuration pages ',
        items: [
          {id: 'users', name: 'Usuarios', examples: ['autocomplete-overview']},
          {id: 'configuration/software', name: 'Grupos', examples: ['checkbox-configurable']},
          {id: 'configuration/system', name: 'Roles', examples: ['input-form']},
          {id: 'configuration/admin', name: 'Recursos', examples: ['input-form']},
        ]
      },
      {
        id: 'view',
        name: 'Administracion',
        summary: 'See views',
        items: [
          {id: 'view/tag-viewer', name: 'Empresa', examples: ['menu-icons']},
          {id: 'view/report-viewer', name: 'Sucursal', examples: ['sidenav-fab']}]
      },
      {
        id: 'view',
        name: 'Parametros',
        summary: 'See views',
        items: [
          {id: 'view/tag-viewer', name: 'Monitoreo', examples: ['menu-icons']},
          {id: 'view/report-viewer', name: 'Dominio', examples: ['sidenav-fab']}]
      },
      {
        id: 'view',
        name: 'Monitoreo',
        summary: 'See views',
        items: [
          {id: 'view/tag-viewer', name: 'Bitacora', examples: ['menu-icons']},
          {id: 'view/report-viewer', name: 'Conexiones', examples: ['sidenav-fab']},
          {id: 'view/report-viewer', name: 'Jobs', examples: ['sidenav-fab']}]

      },
      {
        id: 'view',
        name: 'Documentos Fiscales',
        summary: 'See views',
        items: [
          {id: 'view/tag-viewer', name: 'Facturas', examples: ['menu-icons']}]


      }

    ];
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
