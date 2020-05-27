import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { ScanListItem, ScanResult } from '../models';
import { BehaviorSubject } from 'rxjs';

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
    Storage.set({key: 'scans', value: scanStr});
  }

  saveScan(scan: ScanListItem) {
    console.log("starting local save");
    Storage.get({key: 'scans'}).then(scans => {
      let oldScans = JSON.parse(scans.value);
      if (oldScans != null) {
        oldScans = oldScans.filter(x => x.id !== scan.id);
      } else {
        oldScans = [];
      }
      oldScans.push(scan);
      this.saveScanList(oldScans);
      console.log('Updated Scan list to: ', oldScans)
    });
  }
}
