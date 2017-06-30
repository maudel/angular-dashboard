import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {
  activeTabIndex = 0;
  addTabPosition = 0;
  tabLinks = [
    {label: 'General', link: 'general'},
    {label: 'Email', link: 'email'},
    {label: 'Security', link: 'security'},
    {label: 'Scheduler', link: 'antennas'},
    {label: 'Network', link: 'network'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
