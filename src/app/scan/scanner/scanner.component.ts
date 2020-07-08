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
const { Device, Modals } = Plugins;

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
  deviceId: string = null;
  private deviceType: string;
  constructor(private zone: NgZone,
              private scanService: ScanService,
              private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    let app = this;
    Device.getInfo().then(info => {
      this.isPhone = info.platform !== 'web';
      if (!this.isPhone) {
        this.deviceId = 'web-test-device';
        this.deviceType = 'android';
      } else {
        this.deviceType = info.platform;
      }
    });
    fcm.getToken().then(token => {
      console.log('FCM token: ' + token.token);
      this.deviceId = token.token;
    });
    console.log('starting scanner config');
    cmbScanner.setCameraMode(0);
    cmbScanner.enableImageGraphics(true);
    cmbScanner.setPreviewContainerPositionAndSize(0,0,100,60);
    cmbScanner.setPreviewOptions(cmbScanner.CONSTANTS.PREVIEW_OPTIONS.DEFAULTS);
    cmbScanner.setPreviewOverlayMode(cmbScanner.CONSTANTS.PREVIEW_OVERLAY_MODE.OM_CMB);
    cmbScanner.setConnectionStateDidChangeOfReaderCallback(connectionState => {
      if(connectionState == cmbScanner.CONSTANTS.CONNECTION_STATE_CONNECTED){
        cmbScanner.setSymbologyEnabled("SYMBOL.DATAMATRIX", true).then(function(result) {
          if (result.status) {
            console.log('Symbol Matric configured');
          } else {
            alert('Failed to configure symbol matrix for data matrix');
          }
        })
        cmbScanner.setSymbologyEnabled("SYMBOL.C128", true).then(function(result) {
          if (result.status) {
            console.log('Symbol Matric configured');
          } else {
            alert('Failed to configure symbol matrix for c128');
          }
        })
      }
    });
    cmbScanner.loadScanner("DEVICE_TYPE_MOBILE_DEVICE",function(result){
      cmbScanner.connect().then(result => {
        if(!result) {
          console.error('scanner failed to connect')
        } else {
          console.log('scanner connected successfully');
          app.scan();
        }
      });
    });
    cmbScanner.setResultCallback(function(result){
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

  newScan(barcode: string) {
    let scanItem: ScanListItem = {
      id: null,
      timestamp: new Date(Date.now()).toString(),
      tag: 'New Scan',
      status: 'saving',
      result: null
    };
    let app = this;
    this.scanService.save({barcode, deviceId: this.deviceId, deviceType: this.deviceType}).subscribe(scanRes => {
      scanItem.id = scanRes.id;
      scanItem.status = 'pending';
      this.zone.run(() => {
        Modals.prompt({
          title: 'Label',
          message: 'If you plan on submitting multiple tests, enter a label for this sample.'
        }).then(result => {
          scanItem.tag = result.value || scanItem.tag;
          this.scanService.saveScan(scanItem).subscribe(() => {
            this.cancel();
          })
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
      Modals.alert({
        title: 'Duplicate',
        message: 'You already scanned that barcode'
      }).then(() => {
        app.scan();
      });
    });
  }

  cancel() {
    if (this.isPhone) {
      cmbScanner.stopScanning();
    }
    this.router.navigateByUrl('/summary')
  }

  scan() {
    if (!this.isPhone) {
      this.newScan(`test-barcode-${Math.random()}`);
    } else {
      if (this.deviceId) {
        cmbScanner.startScanning();
        cmbScanner.sendCommand('SET CAMERA.ZOOM 1');
      } else {
        Modals.alert({
          title: 'Push Notifications',
          message: 'Please enable push notifications so you can recieve your result'
        })
      }
    }
  }
}
