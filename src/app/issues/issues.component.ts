import { Component, OnInit } from '@angular/core';
import { Issue } from '../models/issue';
import { IssueService } from '../services/issue.service';

import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent implements OnInit {
  issues: Issue[];
  currentDate: any = new Date().getTime();

  orderFilter: string;
  newOrderFilter: string;
  //true: ASC, false: DESC
  order: Boolean;
  nbIssues: number;
  public href: string;
  public watched: boolean[];


  constructor(private issueService: IssueService,
              private router: Router) { }

  async ngOnInit() {
    this.href = this.router.url;
    const splitstr = this.href.split("/");
    let params = splitstr.pop();
    if (params != "dashboard") {
      await this.filterByParams(params);
    } else {
      this.orderFilter = 'ALL';
      this.newOrderFilter = 'ALL';
      this.order = false;
      this.getIssues();
    }
  }

  async filterByParams(params: string): Promise<void> {
    let splitstr = params.split("?");
    let aux = splitstr.pop();
    let aux2 = aux.split("=");
    let value = aux2.pop();
    let type = aux2.pop();
    if (value.includes('%20')) value = value.replace(/%20/g, " ");
    if (type == "assignee") this.filterAssigneeWithName(value);
    else if (type == "type") this.filterType(value);
    else if (type == "status") this.filterStatus(value);
    else if (type == "priority") this.filterPriority(value);

  }

  getIssues(): void {
    this.eliminarSelectedTh();
    this.issueService.getIssues()
      .subscribe((issues) => {
        this.issues = issues;
        this.nbIssues = this.issues.length;
        this.eliminarActiveFilterBy();
        let filtreAll = document.getElementById('filterAll');
        let arr = filtreAll.className.split(" ");
        if (arr.indexOf('activeFilter') == -1) {
          filtreAll.className += " " + 'activeFilter';
        }
        // for (let i = 0; i<this.issues.length; i++) {
        //   this.issueWatched(this.issues[i]);
        // }
      });
  }

  filterAssigneeWithName(username: string) {
    console.log("username: " + username);
    this.issueService.filterAssignee(username)
      .subscribe(issues => {
        this.issues = issues;
        this.nbIssues = this.issues.length;
        console.log(this.nbIssues);
        this.eliminarActiveFilterBy();
      });
  }

  issueWatched(issueactual: Issue): boolean {
    let watching: Issue[];
    let username: string = localStorage.getItem("username");
    this.issueService.filterWatching(username)
      .subscribe(issues => {
        watching = issues;
      });
    for(let i=0; i<watching.length; i++){
      if (watching[i] == issueactual) return true;
      else return false;
    }
    console.log(this.watched);
  }

  filterWatching() {
    let username: string = localStorage.getItem("username");
    this.issueService.filterWatching(username)
      .subscribe(issues => {
        this.issues = issues;
        this.nbIssues = this.issues.length;
        this.eliminarActiveFilterBy();
        let filtreAll = document.getElementById('filterWatching');
        let arr = filtreAll.className.split(" ");
        if (arr.indexOf('activeFilter') == -1) {
          filtreAll.className += " " + 'activeFilter';
        }
      });
  }

  filterAssignee() {
    let username: string = localStorage.getItem("username");
    this.issueService.filterAssignee(username)
      .subscribe(issues => {
        this.issues = issues;
        this.nbIssues = this.issues.length;
        this.eliminarActiveFilterBy();
        let filtreAll = document.getElementById('filterMyIssues');
        let arr = filtreAll.className.split(" ");
        if (arr.indexOf('activeFilter') == -1) {
          filtreAll.className += " " + 'activeFilter';
        }
      });
  }

  filterType(type: string) {
    //console.log(type);
    this.issueService.filterType(type)
      .subscribe(issues => {
        this.issues = issues;
        this.nbIssues = this.issues.length;
        this.eliminarActiveFilterBy();
      });
  }

  filterPriority(priority: string) {
    //console.log(priority);

    this.issueService.filterPriority(priority)
      .subscribe(issues => {
        this.issues = issues;
        this.nbIssues = this.issues.length;
        this.eliminarActiveFilterBy();
      });
  }

  filterStatus(status: string) {
    //console.log(status);
    this.issueService.filterStatus(status)
      .subscribe(issues => {
        this.issues = issues;
        this.nbIssues = this.issues.length;
        //console.log(status);
        this.eliminarActiveFilterBy();
        if (status == 'OPEN') {
          let filtreAll = document.getElementById('filterOpen');
          let arr = filtreAll.className.split(" ");
          if (arr.indexOf('activeFilter') == -1) {
            filtreAll.className += " " + 'activeFilter';
          }
        }
      });
  }

  orderBy(orderBy: string) {
    //console.log(orderBy);
    if (orderBy != this.orderFilter) {
      this.orderFilter = this.orderFilter;
      this.orderFilter = orderBy;
      this.order = true;
    }
    else this.order = !this.order;

    this.issueService.orderBy(orderBy, this.order)
      .subscribe(issues => this.issues = issues);

    this.selectedOrderBy(orderBy);
  }

  selectedOrderBy(orderBy) {
    this.eliminarSelectedTh();

    let idTh, thElement, arr;
    if (orderBy == 'TITLE') idTh = 'title';
    else if (orderBy == 'VOTES') idTh = 'votes';
    else if (orderBy == 'ASSIGNEE') idTh = 'assignee';
    else if (orderBy == 'CREATEDAT') idTh = 'createdat';
    else if (orderBy == 'UPDATEDAT') idTh = 'updatedat';
    else idTh = 'MAL';


    thElement = document.getElementById(idTh);
    arr = thElement.className.split(" ");
    if (arr.indexOf('activeTH') == -1) {
      thElement.className += " " + 'activeTH';
    }
  }

  eliminarSelectedTh() {
    var ths = document.getElementsByClassName("th");
    for (var i = 0; i < ths.length; i++) {
      var current = document.getElementsByClassName("activeTH");
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" activeTH", "");
      }
    }
  }

  eliminarActiveFilterBy() {
    var ths = document.getElementsByClassName("filterTop");
    for (var i = 0; i < ths.length; i++) {
      var current = document.getElementsByClassName("activeFilter");
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" activeFilter", "");
      }
    }
  }
}
