import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { ScanListItem, ScanResult } from '../models';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ScanService {
  private scanResults$ = new BehaviorSubject<ScanListItem>(null);
  constructor(private http: HttpClient) { }

  save(scan: {barcode: string, deviceId: string, deviceType: string}) {
    console.log(`Saving scan ${environment.apiBase} ${JSON.stringify(scan)}`);
    return this.http.post<ScanResult>(`${environment.apiBase}api/scans`, scan);
  }

  historyRecieved(scan: ScanListItem) {
    this.saveScan(scan);
    this.scanResults$.next(scan);
  }

  getResults() {
    return this.scanResults$.asObservable();
  }

  acknowledge(scanId: string) {
    return this.http.post(`${environment.apiBase}api/scans/acknowledge`, {scanId});
  }

  saveScanList(scans: ScanListItem[]) {
    const scanStr = JSON.stringify(scans);
    return from(Storage.set({key: 'scans', value: scanStr}));
  }

  saveScan(scan: ScanListItem) {
    console.log('saving scan ' + JSON.stringify(scan));
    return from(Storage.get({key: 'scans'}).then(scans => {
      const oldScans = JSON.parse(scans.value).filter(x => x.id !== scan.id);
      oldScans.push(scan);
      return oldScans;
    })).pipe(
      flatMap(x => this.saveScanList(x))
    );
  }
}
