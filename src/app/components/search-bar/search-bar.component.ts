import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Output() inputKey = new EventEmitter();
  @Output() inputEmpty = new EventEmitter();

  reload() {
    this.inputEmpty.emit();
  }
  onInput(event) {
    let value: string = event.target.value;
    value = value.trim();
    if (value && value.length > 2) {
      this.inputKey.emit(value);
    }
    if (!value) {
      this.inputEmpty.emit();
    }
  }
}
