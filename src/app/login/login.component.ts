import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { Component, OnInit } from '@angular/core';

import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { User } from '../models/user';

import {Router} from '@angular/router';
import { MaxLengthValidator } from '@angular/forms/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: SocialUser;
  private loggedIn: boolean;
  private localUser: User;
  // isLoggedIn$: Observable<SocialUser>;


  constructor(private authService: AuthService,
              private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      console.log("user: ");
      console.log(user);
      console.log("logged in: ");
      console.log(this.loggedIn);
      localStorage.setItem("username", user.name);
      if (this.loggedIn) {
        this.loginService.getUserByUsername(user.name).subscribe(n => {
          this.localUser = n;
          console.log("Usuari de back   " + this.localUser);
          if (this.localUser == null) {
            this.loginService.saveUserBack(user).subscribe((result) =>{
              if (result != null) this.router.navigateByUrl('/dashboard');
            });
          }});
      }
    }, (error) => console.log(error));
  }



  signInWithGoogle(): void {
    while (!this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)) {}

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      console.log("user: ");
      console.log(user);
      console.log("logged in: ");
      console.log(this.loggedIn);
      if (user != null) localStorage.setItem("username", user.name);
      if (this.loggedIn) {
        this.loginService.getUserByUsername(user.name).subscribe(n => {
          this.localUser = n;
          console.log(n);
          console.log(this.localUser);
          if (n == null) {
            this.loginService.saveUserBack(user).subscribe((result) =>{
              if (result != null) this.router.navigateByUrl('/dashboard');
            });
          } else {
            this.router.navigateByUrl('/dashboard');
          }});
      }
    });


  }

  signOut(): void {
    this.authService.signOut();
  }

  getCurrentUser(): SocialUser {
    return this.user;
  }
}
