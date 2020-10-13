import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment'
import { Plugins } from '@capacitor/core';
import { ScanService } from '../../services';
import { ScanHistory } from '../../models';
import { Auth } from 'aws-amplify';
import { Observable } from 'rxjs';

const { App } = Plugins;

@Component({
  selector: 'summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SummaryComponent implements OnInit {
  private isPhone = true;
  public scanHistory$: Observable<ScanHistory[]>;
  constructor(private location: Location,
              private scanService: ScanService,
              private router: Router) { }

  ngOnInit(): void {
    App.addListener('backButton', () => {
    });
    this.scanHistory$ = this.scanService.getHistory();
    const viewportmeta = document.querySelector('meta[name=viewport]');
    viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
  }

  prescanner() {
    this.router.navigateByUrl('/pre-scanner');
  }

  async signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  questionnaire() {
    if(environment.skipQuestions) {
      this.router.navigateByUrl('/pre-scanner');
    } else {
      this.router.navigateByUrl('/questionnaire');
    }
  }

}
