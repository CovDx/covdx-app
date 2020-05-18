import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plugins, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScanService } from '../../services';
import { ScanResult, ScanListItem } from '../../models';
import cmbScanner from 'cmbsdk-cordova/www/CmbScanner';
import { FCM } from "capacitor-fcm";

const fcm = new FCM();
const { Device, PushNotifications, App, Storage } = Plugins;

@Component({
  selector: 'cov-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScannerComponent implements OnInit {
  private isPhone = true;
  editingTag: string;
  editingStatus: string;
  deviceId$ = new BehaviorSubject<string>(null);
  isScanning$ = new BehaviorSubject<boolean>(false);
  hasResult$ = new BehaviorSubject<boolean>(false);
  private deviceType: string;
  scans$ = new BehaviorSubject<ScanListItem[]>([]);
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
    Storage.get({key: 'scans'}).then(scans => {
      this.scans$.next(JSON.parse(scans.value) || []);
      App.addListener('appStateChange', state => {
        app.checkNotifications();
      });
    })
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
    scan.acknowledged = false;
    let scanItem = this.scans$.getValue().filter(x => x.id === scan.id)[0];
    if (scanItem) {
      scanItem.status = 'result';
      scanItem.result = scan;
      this.scanService.saveScanList(this.scans$.getValue());
      this.scanService.historyRecieved(scanItem);
      this.zone.run(() => {
        this.router.navigateByUrl('scan-results');
      });
    }
  }
  result(scanItem: ScanListItem) {
    this.scanService.historyRecieved(scanItem);
    this.zone.run(() => {
      this.router.navigateByUrl('scan-results');
    });
  }
  editTag(scanItem: ScanListItem) {
    const currentEdit = this.scans$.getValue().filter(x => x.status === 'edit')[0];
    if(currentEdit) {
      currentEdit.status = this.editingStatus;
    }
    this.editingStatus = scanItem.status;
    scanItem.status = 'edit';
    this.editingTag = scanItem.tag;
  }
  saveTag(scanItem: ScanListItem) {
    scanItem.tag = this.editingTag;
    scanItem.status = this.editingStatus;
    this.scans$.next(this.scans$.getValue().concat([]));
    this.scanService.saveScanList(this.scans$.getValue());
  }

  newScan(barcode: string) {
    const scanItem: ScanListItem = {
      id: null,
      timestamp: new Date(Date.now()).toString(),
      tag: 'New Scan',
      status: 'saving',
      result: null
    };
    this.scans$.next(this.scans$.getValue().concat([scanItem]));
    this.scanService.save({barcode, deviceId: this.deviceId$.getValue(), deviceType: this.deviceType}).subscribe(scanRes => {
      scanItem.id = scanRes.id;
      scanItem.status = 'pending';
      this.scanService.saveScanList(this.scans$.getValue())
      this.zone.run(() => {
        this.scans$.next(this.scans$.getValue().concat([]));
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
        this.scans$.next(this.scans$.getValue().filter(x => x !== x));
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
