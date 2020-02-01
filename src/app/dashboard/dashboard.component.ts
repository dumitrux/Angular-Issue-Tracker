import { Component, OnInit } from '@angular/core';
import { Issue } from '../models/issue';
import { IssueService } from '../services/issue.service';

import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';

import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  issues: Issue[] = [];

  constructor(private issueService: IssueService,
              private authService: AuthService,
              private router: Router,
              private location: Location) { }

  ngOnInit() {
    this.getIssues();
  }

  getIssues(): void {
    this.issueService.getIssues()
      .subscribe(issues => this.issues = issues);
  }

  signOut(): void {
    this.authService.signOut();
    localStorage.setItem("logout", "yes");
    this.router.navigateByUrl('/login');
  }
}
