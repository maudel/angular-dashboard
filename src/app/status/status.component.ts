import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  activeTabIndex = 0;
  addTabPosition = 0;
  tabLinks = [
    {label: 'Readers', link: 'readers-statistics'},
    {label: 'eNodes', link: 'eNodes-statistics'},
    {label: 'Sensors', link: 'io-devices'},
    {label: 'ALE', link: 'antennas'},
  ];
  constructor() { }

  ngOnInit() {
  }

}
