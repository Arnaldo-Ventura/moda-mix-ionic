import { ModalController } from '@ionic/angular';
import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent {
  @Input() title: string;
  constructor(private modalController: ModalController) {}

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    if (key === 'Enter') {
      this.onDismissis(true);
    }
    if (key === 'Escape') {
      this.onDismissis();
    }
  }

  onDismissis(confirm?: boolean) {
    this.modalController.dismiss(confirm);
  }
}
