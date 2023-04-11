import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-found-items',
  templateUrl: './found-items.component.html',
  styleUrls: ['./found-items.component.scss'],
})
export class FoundItemsComponent {
  @Input() list: any[] = [];
  @Input() visible = false;
  @Output() selectedItem = new EventEmitter();

  onSelect(item: string) {
    this.selectedItem.emit(item);
  }
}
