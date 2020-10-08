import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { ScanService } from '../../services';
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
  isPhone$ = new BehaviorSubject(true);
  editingTag: string;
  editingStatus: string;
  private deviceType: string;
  constructor(private zone: NgZone,
              private scanService: ScanService,
              private router: Router) { }

  ngOnInit(): void {
    let app = this;
    Device.getInfo().then(info => {
      const isPhone = info.platform !== 'web'
      this.isPhone$.next(isPhone);
      if (isPhone) {
        this.deviceType = 'android';
      } else {
        this.deviceType = info.platform;
      }
      console.log('starting scanner config');
      if(isPhone) {
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
    });
  }

  newScan(barcode: string) {
    let app = this;
    this.scanService.save({barcode}).subscribe(scanRes => {
      this.zone.run(() => {
        Modals.alert({
          title: 'Success',
          message: 'Your sample has been saved successfully'
        }).then(() => {
          this.cancel();
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
        title: 'Error',
        message: message
      }).then(() => {
        if(this.isPhone$.value) {
          app.scan();
        }
      });
    });
  }

  cancel() {
    if (this.isPhone$.value) {
      cmbScanner.stopScanning();
    }
    this.router.navigateByUrl('/summary')
  }

  public scan() {
    if (!this.isPhone$.value) {
      this.newScan(`test-barcode-${Math.random()}`);
    } else {
      cmbScanner.startScanning();
      cmbScanner.sendCommand('SET CAMERA.ZOOM 1');
    }
  }
}
