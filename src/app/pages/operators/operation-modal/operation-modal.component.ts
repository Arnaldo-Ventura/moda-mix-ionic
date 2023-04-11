import { parseStringToNumber } from './../../../shared/helper/passing-current';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseFormComponent } from 'src/app/shared/base-form.component';
//import { Card } from '../../card/models/card';

@Component({
  selector: 'app-operation-modal',
  templateUrl: './operation-modal.component.html',
  styleUrls: ['./operation-modal.component.scss'],
})
export class OperationModalComponent
  extends BaseFormComponent
  implements OnInit
{
  // @Input() cardList: Card[];
  instalments: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      card: [null, Validators.required],
      debit: this.formBuilder.group({
        rate: [null],
        expected: [null],
        minValue: [null],
      }),
      credit: this.formBuilder.group({
        rate: [null],
        expected: [null],
        minValue: [null],
      }),
      ant: this.formBuilder.group({
        auto: [false],
        expected: [null],
        inst: new FormArray([]),
      }),
      roundFirstInt: [false],
    });
    this.addInsts();
  }

  get insts() {
    return this.formulario.controls.ant.get('inst') as FormArray;
  }

  addInsts() {
    this.instalments.forEach((_) => this.insts.push(new FormControl()));
  }

  submit(save?: boolean) {
    if (!save) {
      this.modalController.dismiss();
    }
    const values = this.formulario.value;
    console.log(values);
    if (values?.debit?.rate) {
      values.debit.rate = parseStringToNumber(values.debit.rate);
    }
    if (values?.debit?.minValue) {
      values.debit.minValue = parseStringToNumber(values.debit.minValue);
    }
    if (values?.credit?.rate) {
      values.credit.rate = parseStringToNumber(values.credit.rate);
    }
    if (values?.credit?.minValue) {
      values.credit.minValue = parseStringToNumber(values.credit.minValue);
      values.credit.ant = values.ant;
      values.credit.ant.inst = values.ant.inst.map((x) => {
        if (x) {
          return parseStringToNumber(x);
        }
        return;
      });
      delete values.ant;
    }

    this.modalController.dismiss(values);
  }
}
