import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScannerComponent } from './scanner';
import { ScanResultsComponent } from './scan-results';


const routes: Routes = [
  { path: 'scanner', component: ScannerComponent},
  { path: '', redirectTo: 'scanner', pathMatch: 'full'},
  { path: 'scan-results', component: ScanResultsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScanRoutingModule { }
