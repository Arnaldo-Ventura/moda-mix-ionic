import { ProfileMenuComponent } from './../profile-menu/profile-menu.component';
import { StorageService } from './../../shared/storage.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent implements OnInit {
  @Input() color = 'primary';
  @Input() title: string;
  @Input() buttonCloseModal = false;
  userLogged: string;

  constructor(
    private modalController: ModalController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.setUserLogged();
  }

  onDismiss() {
    this.modalController.dismiss();
  }

  async setUserLogged() {
    const { name } = await this.storageService.getUser();
    this.userLogged = name;
  }

  async openProfileMenu() {
    const modal = await this.modalController.create({
      component: ProfileMenuComponent,
      cssClass: 'modal-profile-menu',
    });
    return await modal.present();
  }
}
