import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'prescanner',
  templateUrl: './pre-scanner.component.html',
  styleUrls: ['./pre-scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreScannerComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {}

  scanner() {
    this.router.navigateByUrl('/scanner');
  }

  cancel() {
    this.router.navigateByUrl('/summary')
  }
}
