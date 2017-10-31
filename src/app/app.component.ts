import {Component} from '@angular/core';
// import './rxjs-operators';
import {InitializationService} from './core/services/initialization.service';
declare var PdMeta: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  isDarkTheme = false;

  public changeTheme(event) {
    console.log(event)
    this.isDarkTheme = event;
  }

  constructor(private $initializationservice: InitializationService) {
    this.$initializationservice.load();
  }


}

