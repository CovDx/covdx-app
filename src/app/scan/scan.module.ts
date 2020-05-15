import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScanRoutingModule } from './scan-routing.module';
import { ScannerComponent } from './scanner/scanner.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SharedModule } from '../shared';
import { ScanResultsComponent } from './scan-results';


@NgModule({
  declarations: [ScannerComponent, ScanResultsComponent],
  imports: [
    CommonModule,
    ScanRoutingModule,
    SharedModule
  ],
  providers: [
    BarcodeScanner
  ]
})
export class ScanModule { }
