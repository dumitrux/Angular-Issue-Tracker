import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { IssueDetailComponent }  from './issue-detail/issue-detail.component';
import { LoginComponent } from './login/login.component';
import { IssueEditComponent } from './issue-edit/issue-edit.component';
import { IssueCreateComponent } from './issue-create/issue-create.component';
import { CommentEditComponent } from './comment-edit/comment-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'issues', component: IssuesComponent },
  { path: 'detail/:id', component: IssueDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'issues/edit/:id', component: IssueEditComponent },
  { path: 'issues/new', component: IssueCreateComponent },
  { path: 'issues/:id/editcomment/:commentid', component: CommentEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
