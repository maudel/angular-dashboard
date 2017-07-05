import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  activeTabIndex = 0;
  addTabPosition = 0;
  tabLinks = [
    {label: 'About', link: 'readers'},
    {label: 'Zones', link: 'zones'},
    {label: 'Io Devices', link: 'io-devices'},
    {label: 'Antennas', link: 'antennas'},
  ];
  constructor() { }

  ngOnInit() {
  }

}
