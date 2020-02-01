import { Component, OnInit } from '@angular/core';
import { Issue } from '../models/issue';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from '../services/issue.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css']
})
export class IssueEditComponent implements OnInit {
  issue: Issue;
  userAssignee: string;
  users: User[];
  attachments: FileList;

  constructor(private route: ActivatedRoute,
    private issueService: IssueService,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    this.getIssue();
    this.issueService.getAllUsers().subscribe(response => {
      this.users = response;
      console.log(this.users.length);
    });
  }

  getIssue(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.issueService.getIssue(id)
      .subscribe((issue) => {
        this.issue = issue;
        if (this.issue.assignee) this.userAssignee = this.issue.assignee.username;
      });
  }


  async onSubmit() {
    let myresponse;
    let user: User;
    user = new User();
    user.username = this.userAssignee;

    this.issue.assignee = user;

    (await this.issueService.updateIssue(this.issue)).subscribe(
      async (response) => {
        let noAttachments = false;
        myresponse = response;
        let i = -1;
        if (this.attachments) i = this.attachments.length - 1;
        else noAttachments = true;
        while (i >= 0) {
          let file: File = this.attachments[i];
          let formData: FormData = new FormData();
          formData.append('Attachment', file, file.name);
          (await this.issueService.addAttachments(myresponse.id, formData)).subscribe(
            (response) => {
              this.router.navigateByUrl('/detail/' + myresponse.id);
            },
            (error) => {
              console.log(error);
            });
          --i;
        }
        if (noAttachments) this.router.navigateByUrl('/detail/' + myresponse.id);
      },
      (error) => console.log(error));
  }

  fileChange(event) {
    this.attachments = event.target.files;
    console.log(this.attachments.length);
  }
}
