import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScanRoutingModule } from './scan-routing.module';
import { ScannerComponent } from './scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SharedModule } from '../shared';
import { SummaryComponent } from './summary';
import { PreScannerComponent } from './pre-scanner';
import { QuestionnaireComponent } from './questionnaire';

@NgModule({
  declarations: [ScannerComponent, SummaryComponent, PreScannerComponent, QuestionnaireComponent],
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
