import { Component } from '@angular/core';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Aswg13d-Angular';


  constructor(private authService: AuthService,
  ) { }

  signOut(): void {
    this.authService.signOut();
  }
}
