import { Component, OnInit, Input } from '@angular/core';
import { Issue } from '../models/issue';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { IssueService } from '../services/issue.service';
import { AttachmentService } from '../services/attachment.service';


@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {
  @Input() issue: Issue;
  description: string;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private attachmentService: AttachmentService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getIssue();
  }

  getIssue(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.issueService.getIssue(id).subscribe(
      (issue => {
      this.issue = issue;
        if (this.issue.description == '' || this.issue.description == undefined) this.description = 'No description provided.'
        else this.description =this.issue.description;
      }
      ),
      (error) => console.log(error));
  }

  async updateStatus(newStatus: string) {
    console.log(newStatus);
    let oldstatus = this.issue.status;
    let res = oldstatus.localeCompare(newStatus);
    if (res !== 0) {
      this.issue.status = newStatus;
      (await this.issueService.updateIssue(this.issue)).subscribe(
        (response) => {
          this.getIssue();
        },
        (error) => console.log(error));
    }
  }


  async deleteIssue() {
    let issueId = String(this.issue.id);
    (await this.issueService.deleteIssue(issueId)).subscribe(
      (response) => {
        console.log(response);
        this.router.navigateByUrl('/dashboard');
      },
      (error) => console.log(error));
  }

  async voteIssue() {
    let issueId = String(this.issue.id);
    (await this.issueService.voteIssue(issueId)).subscribe(
      (response) => {
        //console.log(response);
        this.issue.votes++;
      },
      async (error) => {
        //console.log(error);
        //console.log("UNVOTE");
        --this.issue.votes;
        (await this.issueService.unVoteIssue(issueId)).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => console.log(error));
      });
  }

  async watchIssue() {
    let issueId = String(this.issue.id);
    (await this.issueService.watchIssue(issueId)).subscribe(
      (response) => {
        //console.log(response);
        this.issue.watchers++;
      },
      async (error) => {
        //console.log(error);
        //console.log("UNWATCH");
        this.issue.watchers--;
        (await this.issueService.unWatchIssue(issueId)).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => console.log(error));
      });
  }

  async downloadFile(attchId: number) {
    console.log(attchId);
    (await this.attachmentService.getAttachment(attchId)).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  async deleteAttachment(attchId: number) {
    console.log(attchId);
    (await this.attachmentService.deleteAttachment(attchId)).subscribe(
      (response) => {
        this.getIssue();
      },
      (error) => console.log(error)
    );
  }
}
