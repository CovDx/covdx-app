import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { ScanHistory } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScanService {
  private scanResults$ = new BehaviorSubject<ScanHistory>(null);
  constructor(private http: HttpClient) { }

  save(scan: {barcode: string, deviceId: string, deviceType: string}) {
    console.log(`Saving scan ${JSON.stringify(scan)}`);
    return this.http.post<ScanHistory>(`${environment.apiBase}api/scans`, scan);
  }

  historyRecieved(scan: ScanHistory) {
    this.scanResults$.next(scan);
  }

  getResults() {
    return this.scanResults$.asObservable();
  }

  acknowledge(scanId: string) {
    return this.http.post(`${environment.apiBase}api/scans/acknowledge`, {scanId});
  }
}
