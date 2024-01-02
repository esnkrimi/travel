import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'pe-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnChanges {
  @Output() action = new EventEmitter<any>();
  @Input() imageGalleryData: any;
  @Input() title: any;
  imageGalleryDataIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {}
  close() {
    this.action.emit('close');
  }
}
