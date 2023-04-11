import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IncomeExpenseInfo } from '../../products/models/product';

@Component({
  selector: 'app-select-expense-info',
  templateUrl: './select-expense-info.component.html',
  styleUrls: ['./select-expense-info.component.scss'],
})
export class SelectExpenseInfoComponent {
  @Input() expenseInfo: IncomeExpenseInfo[];
  constructor(private modalController: ModalController) {}

  onDismiss(info?: any) {
    this.modalController.dismiss(info);
  }
}
