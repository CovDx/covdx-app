import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plugins, PushNotificationToken, PushNotificationActionPerformed, PushNotificationDeliveredList } from '@capacitor/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScanService } from '../../services';
import { ScanHistory } from '../../models';
import { environment } from '../../../environments/environment';
import cmbScanner from 'cmbsdk-cordova/www/CmbScanner';
import { FCM } from "capacitor-fcm";

const fcm = new FCM();
const { Device, PushNotifications, App } = Plugins;

@Component({
  selector: 'cov-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannerComponent implements OnInit {
  private isPhone = true;
  deviceId$ = new BehaviorSubject<string>(null);
  isScanning$ = new BehaviorSubject<boolean>(false);
  hasResult$ = new BehaviorSubject<boolean>(false);
  private deviceType: string;
  scans$ = new BehaviorSubject<ScanHistory[]>([]);
  constructor(private zone: NgZone,
              private scanService: ScanService,
              private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    let app = this;
    Device.getInfo().then(info => {
      this.isPhone = info.platform !== 'web';
      if (!this.isPhone) {
        this.deviceId$.next('web-test-device');
        this.deviceType = 'android';
      } else {
        this.deviceType = info.platform;
      }
      app.push();
    });
    App.addListener('appStateChange', state => {
      app.checkNotifications();
    });
    this.checkNotifications();
    console.log('starting scanner config');
    cmbScanner.setCameraMode(0);
    cmbScanner.enableImageGraphics(true);
    cmbScanner.setPreviewContainerPositionAndSize(0,0,100,80);
    cmbScanner.setPreviewOptions(cmbScanner.CONSTANTS.PREVIEW_OPTIONS.DEFAULTS);
    cmbScanner.setPreviewOverlayMode(cmbScanner.CONSTANTS.PREVIEW_OVERLAY_MODE.OM_CMB);
    cmbScanner.loadScanner("DEVICE_TYPE_MOBILE_DEVICE",function(result){
      console.log(`scanner load: ${result}`);
      cmbScanner.connect().then(result => {
        if(!result) {
          console.error('scanner failed to connect')
        } else {
          console.log('scanner connected successfully');
          cmbScanner.setSymbologyEnabled("SYMBOL.DATAMATRIX", true).then(function(result) {
            if (result.status) {
              console.log('Symbol Matric configured');
            } else {
              alert('Failed to configure symbol matrix');
            }
          });
        }
      });
    });
    cmbScanner.setResultCallback(function(result){
      //alert('result');
      if(result && result.readResults && result.readResults.length > 0){
        result.readResults.forEach(function (item, index){
            if (item.goodRead == true) {
              app.newScan(item.readString);
              console.log('success: ' + item.symbologyString + ' ' + item.readString);
            }
            else{
              console.warn('Failed to scan barcode');
            }
        });
    }});
  }

  checkNotifications() {
    PushNotifications.getDeliveredNotifications().then(notifications => {
      console.log('Checkout existing notifications ' + JSON.stringify(notifications));
      const scan: ScanHistory = notifications.notifications.map(x => x.data)[0]
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
  newResult(scan: ScanHistory) {
    this.scanService.historyRecieved(scan);
    this.zone.run(() => {
      this.router.navigateByUrl('scan-results');
    });
  }
  newScan(barcode: string) {
    this.scanService.save({barcode, deviceId: this.deviceId$.getValue(), deviceType: this.deviceType}).subscribe(scanRes => {
      this.zone.run(() => {
        this.snackBar.open('Your scan has been submitted successfully', 'OK', {
          verticalPosition: 'bottom'
        });
      })
    }, res => {
      console.log(JSON.stringify(res));
      let message: string;
      if (res instanceof HttpErrorResponse) {
        if(res.status === 400) {
          message = res.error;
        } else {
          console.log(res);
          message = `${res.statusText} error`;
        }
      } else {
        message = 'An error has occured while uploading scan';
      }
      this.zone.run(() => {
        this.snackBar.open(message, 'OK', {
          verticalPosition: 'bottom'
        });
      })
    });
    this.zone.run(() => {
      this.isScanning$.next(false);
    });
  }

  stop() {
    this.isScanning$.next(false);
    cmbScanner.stopScanning();
  }
  scan() {
    if (!this.isPhone) {
      this.newScan(`test-barcode-${Math.random()}`);
    } else {
      this.isScanning$.next(true);
      cmbScanner.startScanning();
      cmbScanner.sendCommand('SET CAMERA.ZOOM 1');
    }
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
}
