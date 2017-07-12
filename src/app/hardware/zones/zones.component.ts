import { Component, OnInit, ViewChild} from '@angular/core';
// import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ZoneService} from '../../core/services/zone.service';
@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {

  dataSource = [];
  temp = [];
  displayedColumns = ['aiaName', 'aiaDottedIP'];

  sideElems = [];
  constructor(private  $zoneService: ZoneService) {

  }

  ngOnInit() {
    this.$zoneService.getZones().then(
      response => {
        this.dataSource = response;
      }
  ).catch(
    );
  }

}
