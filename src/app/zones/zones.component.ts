import { Component, OnInit} from '@angular/core';
import { ServerDataSource } from '../../../node_modules/ng2-smart-table/' ;

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {
  settings = {
    columns: {
      nombre: {
        title: 'Nombre'
      },
      edi: {
        title: 'Edificio'
      },
      piso: {
        title: 'Piso'
      }
    }
  };
  data = [
    {
      nombre: "Coderoad SRL",
      edi: "Calacoto Business Center",
      piso: "6"

    }
  ];
  constructor() {
  }
  ngOnInit() {
  }
}
