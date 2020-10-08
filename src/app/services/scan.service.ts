import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { NewScan } from '../models';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Auth } from 'aws-amplify';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ScanService {
  constructor(private http: HttpClient) { }
  private questions: any;
  save(scan: NewScan) {
    console.log(`Saving scan ${environment.apiBase} ${JSON.stringify(scan)}`);
    return this.setAuthHeader().pipe(
      flatMap(headers => {
        return this.http.post(`${environment.apiBase}api/scans`, {barcode: scan.barcode, questions: this.questions}, {headers})
      })
    );
  }

  setQuestions(questions: any) {
    for(let key of Object.keys(questions)) {
      questions[key] = questions[key].toString();
    }
    this.questions = questions;
  }

  getQuestions() {
    return this.questions;
  }

  private setAuthHeader(headers: HttpHeaders = null): Observable<HttpHeaders> {
    if (!headers) {
      headers = new HttpHeaders();
    }
    return from(Auth.currentSession()).pipe(
      map(session => {
        const token = session.getIdToken().getJwtToken();
        return headers.set('Authorization', `Bearer ${token}`);
      })
    );
  }
}
