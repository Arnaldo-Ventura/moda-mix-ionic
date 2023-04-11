import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/storage.service';

@Component({
  selector: 'app-app-start',
  templateUrl: './app-start.page.html',
  styleUrls: ['./app-start.page.scss'],
})
export class AppStartPage implements OnInit {

  constructor(
    private storageService:StorageService
  ) { }

  ngOnInit() {
   // this.role()
  }

  async role(){
    //console.log(await this.storageService.getRoles())
  }

}
