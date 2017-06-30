import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.scss']
})
export class HardwareComponent implements OnInit {
  activeTabIndex = 0;
  addTabPosition = 0;
  tabLinks = [
    {label: 'Readers', link: 'readers'},
    {label: 'Zones', link: 'zones'},
    {label: 'Io Devices', link: 'io-devices'},
    {label: 'Antennas', link: 'antennas'},
    {label: 'Inventory Wizard', link: 'inventory-wizard'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
