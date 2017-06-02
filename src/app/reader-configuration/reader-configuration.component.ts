import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reader-configuration',
  templateUrl: './reader-configuration.component.html',
  styleUrls: ['./reader-configuration.component.scss']
})
export class ReaderConfigurationComponent implements OnInit {
  settings = {
    columns: {
      qSingleScan: {
        title: 'Q Single Scan'
      },
      qMultiScan: {
        title: 'Q Multi Scan'
      },
      qGeigerScan: {
        title: 'Q Geiger Scan'
      },
      readerSinglePower: {
        title: 'Reader Single Power'
      },
      readerMultiplePower: {
        title: 'Reader Multiple Power'
      },
      readerAutoConnect: {
        title: 'Reader AutoConnect'
      },
      readerVibrateEnabled: {
        title: 'Reader Vibrate Enabled'
      },
      readerSoundEnabled: {
        title: 'Reader Sound Enabled'
      }

    }
  };
  data = [
    {
      qGeigerScan: 'string',
      qMultiScan: 'string',
      qSingleScan: 'string',
      readerAutoConnect: 'string',
      readerMultiplePower: 'string',
      readerSinglePower: 'string',
      readerSoundEnabled: 'string',
      readerVibrateEnabled: 'string',

    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
