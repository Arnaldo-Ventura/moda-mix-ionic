import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-input-group-items',
  templateUrl: './input-group-items.component.html',
  styleUrls: ['./input-group-items.component.scss'],
})
export class InputGroupItemsComponent implements OnInit {
  @Output() itemChanged = new EventEmitter();
  @Output() itemsVisible = new EventEmitter();
  @Input() items;
  @Input() label: string;
  @Input() group;
  @Input() inputValue;
  indexItemSelected = 0;
  img: null;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    if (key === 'ArrowUp') {
      this.decrement();
      return;
    }
    if (key === 'ArrowDown') {
      this.increment();
      return;
    }
    if (key.toLocaleLowerCase() === this.label[0].toLocaleLowerCase()) {
      this.showGroup();
      return;
    }
    if (this.group && this.items.map((_, i) => i).includes(+key - 1)) {
      this.itemChange(+key - 1);
      return;
    }
    if (key === 'Enter') {
      this.itemChange(this.indexItemSelected);
    }
  }

  ngOnInit() {
    if (this.group) {
      this.showGroup();
    }
  }

  showGroup() {
    this.itemsVisible.emit(true);
    this.group = true;
  }
  hideGroup() {
    this.itemsVisible.emit(false);
    this.group = false;
  }
  increment() {
    if (this.indexItemSelected < this.items.length - 1) {
      this.indexItemSelected++;
    }
  }
  decrement() {
    if (this.indexItemSelected > 0) {
      this.indexItemSelected--;
    }
  }
  itemChange(methodIndex?: number) {
    if (this.group) {
      const item = this.items[methodIndex];
      this.inputValue = item.name;
      this.itemChanged.emit(item);
      this.hideGroup();
      this.img = item.img ? item.img : null;
    }
  }
}
