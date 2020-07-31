import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScannerComponent } from './scanner';
import { ScanResultsComponent } from './scan-results';
import { SummaryComponent } from './summary';
import { PreScannerComponent } from './pre-scanner';
import { QuestionnaireComponent } from './questionnaire';


const routes: Routes = [
  { path: 'scanner', component: ScannerComponent},
  { path: 'summary', component: SummaryComponent},
  { path: '', redirectTo: 'summary', pathMatch: 'full'},
  { path: 'scan-results', component: ScanResultsComponent },
  { path: 'pre-scanner', component: PreScannerComponent },
  { path: 'questionnaire', component: QuestionnaireComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScanRoutingModule { }
