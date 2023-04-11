import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-installments-modal',
  templateUrl: './installments-modal.component.html',
  styleUrls: ['./installments-modal.component.scss'],
})
export class InstallmentsModalComponent implements OnInit {
  @Input() instalments: number[];
  constructor(private modalController: ModalController) {}

  ngOnInit() {}
}
