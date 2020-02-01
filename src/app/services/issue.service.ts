import { Injectable } from '@angular/core';
import { Issue } from '../models/issue';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { LoginService } from './login.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  // URL to web api
  private issuessUrl = 'https://grup13aswd-rest-api-blabla.herokuapp.com/api/v1/issues';

  constructor(
    private http: HttpClient,
    private loginService: LoginService) { }


  getIssues(): Observable<Issue[]> {
    // TODO: send the message _after_ fetching the heroes
    return this.http.get<Issue[]>(this.issuessUrl)
      .pipe(
        catchError(this.handleError<Issue[]>('getIssue', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getIssue(id: number): Observable<Issue> {
    const url = `${this.issuessUrl}/${id}`;
    return this.http.get<Issue>(url).pipe(
      catchError(this.handleError<Issue>(`getIssue id=${id}`))
    );
  }

  async addIssue(issue: Issue) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    let httpParams = new HttpParams()
      .set('title', issue.title)
      .set('description', issue.description)
      .set('kind', issue.issueType)
      .set('priority', issue.priority)
      .set('assignee', issue.assignee.username);

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      }),
      params: httpParams
    };
    return this.http.post(this.issuessUrl, null, httpOptions);
  }

  async updateIssue(issue: Issue) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;
    let issUsername = null;
    if (issue.assignee != null) {
      issUsername = issue.assignee.username;
    }
    const putIssue = {
      assignee: issUsername,
      title: issue.title,
      description: issue.description
    };

    console.log(issue.title);
    console.log(issue.description);

    let httpParams = new HttpParams()
      .set('kind', issue.issueType)
      .set('priority', issue.priority)
      .set('status', issue.status)
      .set('username', username);

    let issueId = String(issue.id);

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      }),
      params: httpParams
    };

    return this.http.put(this.issuessUrl + '/' + issueId, putIssue, httpOptions);
  }


  async deleteIssue(issueId: string) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };

    console.log(issueId);
    return this.http.delete(this.issuessUrl + '/' + issueId, httpOptions);
  }

  async voteIssue(issueId: string) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };
    return this.http.post(this.issuessUrl + '/' + issueId + '/vote', null, httpOptions);
  }

  async unVoteIssue(issueId: string) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };
    return this.http.delete(this.issuessUrl + '/' + issueId + '/vote', httpOptions);
  }

  async watchIssue(issueId: string) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };
    return this.http.post(this.issuessUrl + '/' + issueId + '/watch', null, httpOptions);
  }

  async unWatchIssue(issueId: string) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };
    return this.http.delete(this.issuessUrl + '/' + issueId + '/watch', httpOptions);
  }

  filterWatching(username: string): Observable<Issue[]> {
    let httpParams = new HttpParams()
      .set('username', username);

    const httpOptions = {
      params: httpParams
    };

    return this.http.get<Issue[]>(this.issuessUrl + '/watching', httpOptions);
  }

  filterAssignee(username: string): Observable<Issue[]> {
    let httpParams = new HttpParams()
      .set('username', username);

    const httpOptions = {
      params: httpParams
    };

    return this.http.get<Issue[]>(this.issuessUrl + '/assignee', httpOptions);
  }

  filterType(type: string): Observable<Issue[]> {
    let httpParams = new HttpParams()
      .set('Kind', type)
      .set('Asc/Desc', 'ASCENDENT');

    const httpOptions = {
      params: httpParams
    };

    return this.http.get<Issue[]>(this.issuessUrl + '/kind', httpOptions);
  }

  filterPriority(priority: string): Observable<Issue[]> {
    let httpParams = new HttpParams()
      .set('Priority', priority)
      .set('Asc/Desc', 'ASCENDENT');

    const httpOptions = {
      params: httpParams
    };

    return this.http.get<Issue[]>(this.issuessUrl + '/priority', httpOptions);
  }

  filterStatus(status: string): Observable<Issue[]> {
    let httpParams = new HttpParams()
      .set('Status', status)
      .set('Asc/Desc', 'ASCENDENT');

    const httpOptions = {
      params: httpParams
    };

    return this.http.get<Issue[]>(this.issuessUrl + '/status', httpOptions);
  }

  orderBy(status: string, order: Boolean): Observable<Issue[]> {
    let myOrder;
    if (order) {
      myOrder = 'ASCENDENT';
    }
    else myOrder = 'DESCENDENT';

    let httpParams = new HttpParams()
      .set('atribute', status)
      .set('orderby', myOrder);

    const httpOptions = {
      params: httpParams
    };

    return this.http.get<Issue[]>(this.issuessUrl + '/orderBy', httpOptions);
  }

  async addAttachments(issueId: string, attachment: FormData) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };
    return this.http.post(this.issuessUrl + '/' + issueId + '/attachments', attachment, httpOptions);
  }


  getAllUsers(): Observable<User[]> {
    // TODO: send the message _after_ fetching the heroes
    const usersUrl = 'https://grup13aswd-rest-api-blabla.herokuapp.com/api/v1/users';
    return this.http.get<User[]>(usersUrl)
      .pipe(
        catchError(this.handleError<User[]>('getIssue', []))
      );
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
