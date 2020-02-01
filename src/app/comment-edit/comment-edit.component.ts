import { OnInit, Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.css']
})
export class CommentEditComponent implements OnInit {

  comment: Comment;
  public href: string;
  public id: string;
  public issueid: string;

  createForm = new FormGroup({
    body: new FormControl('')
  });

  constructor(private route: ActivatedRoute,
    private commentService: CommentService,
    private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
    // this.getComment();
  }

  async onSubmit() {
    console.warn(this.createForm.value);
    const splitstr = this.href.split("/");
    this.id = splitstr.pop();
    splitstr.pop();
    this.issueid = splitstr.pop();
    let body = this.createForm.value;
    console.log(body);
    (await this.commentService.editComment(body, this.id, this.issueid)).subscribe(
      (resp) => {
        console.log(resp);
        this.router.navigateByUrl('/detail/' + this.issueid);
      }, (err) => console.log(err)
    );
  }

}
