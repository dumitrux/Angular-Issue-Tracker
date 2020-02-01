import { Component, OnInit } from '@angular/core';
import { Issue } from '../models/issue';
import { FormGroup, FormControl } from '@angular/forms';
import { IssueService } from '../services/issue.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.css']
})
export class IssueCreateComponent implements OnInit {
  newIssue: Issue = new Issue();
  users: User[];

  createForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    assignee: new FormControl(''),
    issueType: new FormControl(''),
    priority: new FormControl('')
  });
  attachments: FileList;

  kindSelect = 'BUG';
  prioritySelect = 'MAJOR';

  constructor(private issueService: IssueService,
    private router: Router) {
  }

  ngOnInit() {
    this.issueService.getAllUsers().subscribe(response => {
      this.users = response;
      console.log(this.users.length);
    });
  }

  async onSubmit() {
    let myresponse;
    let user: User;
    user = new User();


    this.newIssue.title = this.createForm.controls['title'].value;
    this.newIssue.description = this.createForm.controls['description'].value;
    user.username = this.createForm.controls['assignee'].value;
    this.newIssue.assignee = user;
    this.newIssue.issueType = this.createForm.controls['issueType'].value.toUpperCase();
    this.newIssue.priority = this.createForm.controls['priority'].value.toUpperCase();

    (await this.issueService.addIssue(this.newIssue)).subscribe(
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
            (error) => console.log(error));
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
