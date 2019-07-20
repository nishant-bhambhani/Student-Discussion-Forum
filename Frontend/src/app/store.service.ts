import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
// import { ConsoleReporter } from 'jasmine';

/*
*  @description :: Common service to send any AJAX requests.
*  @author      :: Sharmila Thirumalainathan, B00823668
*/

const apiURL = 'https://forum-webservice.herokuapp.com';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})

export class StoreService {
  url = '';

  email = '';

  emailStr = '';

  constructor(private http: HttpClient) {

  }

  private handleError(error: HttpErrorResponse) {
    // Error entry point for all AJAX request made using store

    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status == 403) {
        window.location.href = "/home"
        return throwError('Something went wrong; please try again later.');
      }

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`);
      Swal.fire('Oops..', error.error.message, 'error')

    }
    return throwError('Something went wrong; please try again later.');
  };

  post(endpoint, data = {}) {

    if (endpoint == '/signout') {
      this.email = "";
    }
    else if (endpoint == '/signin') {
      this.email = data["email"];
    }
    else if (endpoint != '/resetpassword' && endpoint != '/user' && endpoint != '/forgotpassword' && this.email != "") {
      data["email"] = this.email;
    }
    this.url = `${apiURL}${endpoint}`;
    return this.http.post(this.url, data, httpOptions)
      .pipe(
        tap(data => console.log('Request successful')),
        catchError(this.handleError)
      );
  }

  get(endpoint, data = {}) {
    this.url = `${apiURL}${endpoint}`;
    if (endpoint != '/user') {
      this.emailStr = (endpoint.indexOf('?') == -1) ? '?email=' : '&email=';
      this.url = this.url + this.emailStr + this.email;
    }
    return this.http.get(this.url, httpOptions)
      .pipe(
        tap(_ => console.log('Request successful')),
        catchError(this.handleError)
      );
  }

  public getDiscussions(endpoint){
    this.url = `${apiURL}${endpoint}`;
    return this.http.get(this.url, httpOptions)
    .pipe(
      tap(_ => console.log('Request successful')),
      catchError(this.handleError)
    );
  }

  /*
*  @description :: Endpoints To Evaluate Comments.
*  @author      :: Fasuyi Jesuseyi Will, B00787413
*/

  public sendComment(endpoint,comment,postID,email){
    var data = {content:comment,postId:postID,email:email};
    var option ={ headers: new HttpHeaders({'Content-Type': 'application/json'}),withCredentials: true};
    var apiURL2="http://localhost:1337"
    this.url = `${apiURL2}${endpoint}`;
    return this.http.post(this.url, data, option)
    .pipe(
      tap(_ => console.log('Post Successful')),
      catchError(this.errorC)
    );
  }

  public getDiscussionWithID(endpoint,postId){
    this.url = `${apiURL}${endpoint}${postId}`;
    return this.http.get(this.url, httpOptions)
    .pipe(
      tap(_ => console.log('Request successful')),
      catchError(this.handleError)
    );
  }

  private errorC(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    }
    return throwError('Something went wrong; please try again later.');
  }
}
