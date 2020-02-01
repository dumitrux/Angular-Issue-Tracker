import { CommentService } from './../services/comment.service';
import { Comment } from './../models/comment';
import { Component, OnInit, OnChanges, Input} from '@angular/core';
import { Router } from '@angular/router';
import { CommentDTO } from '../models/commentDTO';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnChanges {
  comments: Comment[];
  public href: string;
  public id: string;
  public currentusername: string;
  nbComments: number;

  @Input() status: string;

  constructor(private commentService: CommentService,
    private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
    this.getCommments();
    this.currentusername = localStorage.getItem("username");
  }

  async getCommments(): Promise<void> {
    const splitstr = this.href.split('/');
    this.id = splitstr.pop();
    (await this.commentService.getComments(this.id))
      .subscribe(result => {
      this.comments = result;
        this.nbComments = this.comments.length;
      });
  }

  async deleteComment(commentid: number) {
    const splitstr = this.href.split('/');
    this.id = splitstr.pop();
    (await this.commentService.deleteComment(commentid, this.id)).subscribe(
      (response) => {
        console.log(response);
        this.getCommments();
      },
      (error) => console.log(error));
  }

  editComment(commentid: number): void {
    console.log(commentid.toString());
    this.router.navigateByUrl("/issues/" + this.id + "/editcomment/" + commentid.toString());
  }

  onCreated(created: boolean) {
    if (created) {
      this.getCommments();
    }
  }

  ngOnChanges() {
    console.log("comment change status");
    this.getCommments();
  }
}
