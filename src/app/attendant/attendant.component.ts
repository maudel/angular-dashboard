import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attendant',
  templateUrl: './attendant.component.html',
  styleUrls: ['./attendant.component.scss']
})
export class AttendantComponent implements OnInit {
  settings = {
    columns: {
      nombre: {
        title: 'Nombre'
      },
      paterno: {
        title: 'Paterno'
      },
      materno: {
        title: 'Materno'
      },
      ci: {
        title: 'CI'
      },
      cargo: {
        title: 'Cargo'
      },
      telefono: {
        title: 'Telefono'
      }
    }
  };
  data = [
    {
      nombre: "Paolo",
      paterno: "Ramos",
      materno: "Mendez",
      ci: "6666666",
      cargo: "IOS Developer",
      telefono: "7323433",
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
