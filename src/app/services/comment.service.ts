import { CommentDTO } from './../models/commentDTO';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private issuessUrl = 'https://grup13aswd-rest-api-blabla.herokuapp.com/api/v1/issues';


  constructor(private http: HttpClient,
    private loginService: LoginService) { }

  async addComment(newComment: CommentDTO, id: string) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };
    console.log(newComment);

    return this.http.post(this.issuessUrl + "/" + id + "/comments", newComment, httpOptions);

  }

  async getComments(id: string): Promise<Observable<Comment[]>> {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };

    return this.http.get<Comment[]>(this.issuessUrl + '/' + id + '/comments', httpOptions);
  }

  async editComment(body, id: string, issueid): Promise<Observable<Comment>> {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };
    let comment: CommentDTO = new CommentDTO();
    comment.body = body;
    return this.http.put<Comment>(this.issuessUrl + '/' + issueid + '/comments/' + id, body, httpOptions);
  }

  getApikey(): string {

    let username: string = localStorage.getItem("username");
    let apikey: string;
    console.log("Abans trucada login Service");
    // NO ENTRA DINS EL GET BY USERNAME
    this.loginService.getUserByUsername(username).subscribe((response) => {
      if (response != null) {
        apikey = response.apikey;
        return apikey;
      } else return null;
    }, (error) => console.log(error));
    return null;

  }


  async deleteComment(commentid, issueId) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };

    return this.http.delete(this.issuessUrl + '/' + issueId + '/comments/' + commentid, httpOptions);
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
