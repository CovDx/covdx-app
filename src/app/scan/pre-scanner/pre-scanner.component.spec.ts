import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreScannerComponent } from './pre-scanner.component';

describe('PreScannerComponent', () => {
  let component: PreScannerComponent;
  let fixture: ComponentFixture<PreScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
