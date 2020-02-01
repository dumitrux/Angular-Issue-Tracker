import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IssuesComponent } from './issues/issues.component';

import { FormsModule } from '@angular/forms';
import { IssueDetailComponent } from './issue-detail/issue-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // <-- NgModel lives here

import { HttpClientModule }    from '@angular/common/http';

//Modules for login with google and fb
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { LoginComponent } from './login/login.component';
import { IssueEditComponent } from './issue-edit/issue-edit.component';
import { IssueCreateComponent } from './issue-create/issue-create.component';

import { ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from './comment/comment.component';
import { CommentCreateComponent } from './comment-create/comment-create.component';
import { CommentEditComponent } from './comment-edit/comment-edit.component';


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('281763861706-es870jd85j2mtfmv3qugq2b3fft28k0a.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    IssuesComponent,
    IssueDetailComponent,
    DashboardComponent,
    LoginComponent,
    IssueEditComponent,
    IssueCreateComponent,
    CommentComponent,
    CommentCreateComponent,
    CommentEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocialLoginModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
