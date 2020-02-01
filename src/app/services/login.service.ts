import { UserDTO } from '../models/userDTO';
import { User } from '../models/user';
import { SocialUser } from 'angularx-social-login';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Issue } from '../models/issue';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LoginService {



  private userUrl = 'https://grup13aswd-rest-api-blabla.herokuapp.com/api/v1/users';

  constructor(private http: HttpClient) {
  }

  saveUserBack(user: SocialUser) {
    const postUser: UserDTO = {
      username: user.name,
      apikey: user.authToken,
      urlfoto: user.photoUrl,
    };
    /*this.http.post<User>(this.userUrl, postUser, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'admin'
      })
    }).pipe(
      catchError(this.handleError('postUser', postUser))
    );*/
    return this.http.post(this.userUrl, postUser, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'admin'
      })
    });

  }

  getUserByUsername(username: string): Observable<User> {

    const httpParams = new HttpParams()
      .set('username', username);

    const httpOptions = {
      params: httpParams
    };

    return this.http.get<User>(
    'https://grup13aswd-rest-api-blabla.herokuapp.com/api/v1/users/username', httpOptions);
  }
}
