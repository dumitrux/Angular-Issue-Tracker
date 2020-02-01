import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private attachmentsUrl = 'https://grup13aswd-rest-api-blabla.herokuapp.com/api/v1/attachments';
  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  async getAttachment(attchId: number) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };

    return this.http.get(this.attachmentsUrl + '/' + attchId, httpOptions);
  }

  async deleteAttachment(attchId: number) {
    let username: string = localStorage.getItem("username");
    let apikey: string;
    const t = await this.loginService.getUserByUsername(username).toPromise();
    apikey = t.apikey;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': apikey
      })
    };

    return this.http.delete(this.attachmentsUrl + '/' + attchId, httpOptions);
  }
}
