import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import form_template from '../../../assets/form_template.js';

@Component({
  selector: 'questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireComponent implements OnInit {
  myFormGroup: FormGroup;
  formTemplate: any = form_template;
  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
    let group = {};
    form_template.forEach(input_template => {
      let params = [];
      if (input_template.type !== 'label') {

        if (input_template.minLength) {
          params.push(Validators.minLength(parseInt(input_template.minLength)));
        }
        if (input_template.type === 'email') {
          params.push(Validators.email);
        }
      }
      group[input_template.id] = new FormControl('', params);
    });
    this.myFormGroup = new FormGroup(group);
  }

  onSubmit() {
    if (this.myFormGroup.valid) {
      this.router.navigateByUrl('/scanner');
    }

  }

  cancel() {
    this.location.back();
  }
}
