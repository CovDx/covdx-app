import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Plugins, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';
import { ScanService } from '../../services';
import { FCM } from "capacitor-fcm";
import { Auth } from 'aws-amplify';

const fcm = new FCM();
const { Device, PushNotifications, App, Storage } = Plugins;

@Component({
  selector: 'summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SummaryComponent implements OnInit {
  private isPhone = true;
  constructor(private zone: NgZone,
              private scanService: ScanService,
              private router: Router) { }

  ngOnInit(): void {
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
    this.router.navigateByUrl('/questionnaire');
  }

}
