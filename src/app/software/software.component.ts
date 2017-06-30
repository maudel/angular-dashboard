import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {
  activeTabIndex = 0;
  addTabPosition = 0;
  tabLinks = [
    {label: 'Redundancy', link: 'redundancy'},
    {label: 'Rules Engine', link: 'rules-engine'},
    {label: 'Reports', link: 'reports'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
