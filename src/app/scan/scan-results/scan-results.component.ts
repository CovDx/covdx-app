import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ScanListItem } from '../../models';
import { ScanService } from '../../services';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'scan-results',
  templateUrl: './scan-results.component.html',
  styleUrls: ['./scan-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanResultsComponent implements OnInit {
  errorScan$ = new BehaviorSubject<boolean>(false);
  scan$ = new BehaviorSubject<ScanListItem>(null);
  ackLoadingState$ = new BehaviorSubject<string>('start');
  constructor(private scanService: ScanService, private router: Router) { }

  ngOnInit() {
    this.scanService.getResults().subscribe(scan => {
      console.log(scan);
      if (!scan || !scan.id || !scan.result || !scan.result.label) {
        this.errorScan$.next(true);
      } else {
        this.scan$.next(scan);
        this.errorScan$.next(false);
        if(!scan.result.acknowledged) {
          this.ackLoadingState$.next('start');
        }else{
          this.ackLoadingState$.next('success');
        }
      }
    });
  }

  ack() {
    this.ackLoadingState$.next('loading');
    this.scanService.acknowledge(this.scan$.getValue().id).subscribe(x => {
      console.log('acknowledge successful');
      this.ackLoadingState$.next('success');
      const scan = this.scan$.getValue();
      scan.result.acknowledged = true;
      this.scanService.saveScan(scan);
    }, err => {
      console.log(`An error occured durning ack: ${JSON.stringify(err)}`);
      this.ackLoadingState$.next('error');
    })
  }

  scanner() {
    this.router.navigateByUrl('/scanner');
  }

  exit() {
    this.router.navigateByUrl('/summary');
  }
}
