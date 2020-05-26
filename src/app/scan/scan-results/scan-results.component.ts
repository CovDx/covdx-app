import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ScanHistory } from '../../models';
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
  scan$ = new BehaviorSubject<ScanHistory>(null);
  ackLoadingState$ = new BehaviorSubject<string>('start');
  constructor(private scanService: ScanService, private router: Router) { }

  ngOnInit() {
    this.scanService.getResults().subscribe(scan => {
      console.log(scan);
      if (!scan || !scan.id || !scan.label) {
        this.errorScan$.next(true);
      } else {
        this.scan$.next(scan);
        this.errorScan$.next(false);
        this.ackLoadingState$.next('start');
      }
    });
  }

  ack() {
    this.ackLoadingState$.next('loading');
    this.scanService.acknowledge(this.scan$.getValue().id).subscribe(x => {
      console.log('acknowledge successful');
      this.ackLoadingState$.next('success');
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
