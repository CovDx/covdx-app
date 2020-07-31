import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScanRoutingModule } from './scan-routing.module';
import { ScannerComponent } from './scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SharedModule } from '../shared';
import { ScanResultsComponent } from './scan-results';
import { SummaryComponent } from './summary';
import { PreScannerComponent } from './pre-scanner';
import { QuestionnaireComponent } from './questionnaire';

@NgModule({
  declarations: [ScannerComponent, ScanResultsComponent, SummaryComponent, PreScannerComponent, QuestionnaireComponent],
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
