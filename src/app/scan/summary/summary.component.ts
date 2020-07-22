import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Plugins, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';
import { ScanService } from '../../services';
import { ScanListItem, ScanResult } from '../../models';
import { FCM } from "capacitor-fcm";

const fcm = new FCM();
const { Device, PushNotifications, App, Storage } = Plugins;

@Component({
  selector: 'summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SummaryComponent implements OnInit {
  private isPhone = true;
  deviceId$ = new BehaviorSubject<string>(null);
  hasResult$ = new BehaviorSubject<boolean>(false);
  scans$ = new BehaviorSubject<ScanListItem[]>([]);
  constructor(private zone: NgZone,
              private scanService: ScanService,
              private router: Router) { }

  ngOnInit(): void {
    Storage.get({key: 'scans'}).then(scans => {
      this.scans$.next(JSON.parse(scans.value) || []);
    });
    this.push();
  }

  checkNotifications() {
    PushNotifications.getDeliveredNotifications().then(notifications => {
      console.log('Checkout existing notifications ' + JSON.stringify(notifications));
      const scan: ScanResult = notifications.notifications.map(x => x.data)[0]
      if (scan.id) {
        PushNotifications.removeAllDeliveredNotifications();
        console.log('New scan found ' + JSON.stringify(scan));
        this.newResult(scan);
      } else {
        this.zone.run(() => {
          this.hasResult$.next(true);
        });
      }
    });
  }

  newResult(scan: ScanResult) {
    console.log('summary result: ' + JSON.stringify(scan));
    scan.acknowledged = false;
    let scanItem = this.scans$.getValue().filter(x => x.id === scan.id)[0];
    console.log('summary item: ' + JSON.stringify(scanItem));
    if (scanItem) {
      scanItem.status = 'result';
      scanItem.result = scan;
      this.scanService.saveScanList(this.scans$.getValue()).subscribe(() => {
        this.scanService.historyRecieved(scanItem);
        this.zone.run(() => {
          this.router.navigateByUrl('scan-results');
        });
      });
    }
  }

  resultClick(scanItem: ScanListItem) {
    this.scanService.historyRecieved(scanItem);
    this.zone.run(() => {
      this.router.navigateByUrl('scan-results');
    });
  }

  push() {
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        console.info('Push notification permission granted');
        PushNotifications.register();
      } else {
        alert("Please enable notifications to scan a test and recieve your results");
      }
    });
    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      console.log('Push registration success, token: ' + token.value);
      fcm.getToken().then(token => {
        console.log('FCM token: ' + token.token);
        this.zone.run(() => {
          this.deviceId$.next(token.token);
        });
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
      console.log('Push action performed: ' + JSON.stringify(notification.notification));
      this.newResult(notification.notification.data);
    });
    PushNotifications.addListener('pushNotificationReceived', notification => {
      this.newResult(notification.data);
    })
  }

  prescanner() {
    this.router.navigateByUrl('/pre-scanner');
  }

  questionnaire() {
    this.router.navigateByUrl('/questionnaire');
  }

}
