import { Component } from '@angular/core';
import './rxjs-operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  isDarkTheme = false;
  public changeTheme (event){
    this.isDarkTheme = event;
  }
}

