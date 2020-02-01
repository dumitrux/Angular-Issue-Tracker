import { CommentDTO } from '../models/commentDTO';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent implements OnInit {
  
  public href: string;
  newComment: CommentDTO = new CommentDTO();
  public id: string;
  @Output() created = new EventEmitter<boolean>();

  createForm = new FormGroup({
    body: new FormControl('')
  });

  constructor(private commentService: CommentService,
              private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
  }

  async onSubmit() {
    console.warn(this.createForm.value);
    const splitstr = this.href.split("/");
    this.id = splitstr.pop();
    this.newComment = this.createForm.value;
    console.log(this.newComment);
    (await this.commentService.addComment(this.newComment, this.id)).subscribe(
      (resp) => {
        console.log(resp);
        this.created.emit(true);
      }, (err) => console.log(err)
    );
  }

}
