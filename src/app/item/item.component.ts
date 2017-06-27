import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  settings = {
    columns: {
      nombre: {
        title: 'Nombre'
      },
      material: {
        title: 'Material'
      },
      modelo: {
        title: 'Modelo'
      },
      serie: {
        title: 'Serial'
      },
      dimension: {
        title: 'Descripcion'
      },
      capacidad: {
        title: 'Color'
      },
      accesorios: {
        title: 'Talla'
      },
      titulo: {
        title: 'Precio'
      }

    }
  };
  data = [
    {
      nombre: 'string',
      material: 'string',
      modelo: 'string',
      serie: 'string',
      dimension: 'string',
      capacidad: 'string',
      accesorios: 'string',
      titulo: 'string',
      gestion: 'string',
      autor: 'string',
      serial: 'string',
      zone: 'string',
      lastDetectTime: 'string',
      encargado: 'string',
      descripcion: 'string'

    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
