import { StorageService } from 'src/app/shared/storage.service';
import { ModalController, NavController } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent {
  constructor(
    private storageService: StorageService,
    private modalController: ModalController,
    private navController: NavController
  ) {}

  async logout() {
    await this.storageService.logout();
    this.modalController.dismiss();
    this.navController.navigateRoot('/');
  }
}
