import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { interval, take } from 'rxjs';

@Component({
  selector: 'esn-carousels',
  templateUrl: `esn-carousel.component.html`,
  styleUrls: ['esn-carousel.scss'],
})
export class EsnCarouselComponent implements OnChanges {
  @ViewChild('frame') frame: ElementRef;
  @Output() viewOnMap = new EventEmitter<any>();
  @Input() info: any;
  @Input() data: any;
  simplePictureInCarousel = false;
  left = 0;
  count = 0;
  numberOfPage: any;
  constructor(private render: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    //this.data = [this.data];
    this.simplePictureInCarousel =
      this.data?.length === undefined ? false : true;
    this.data = this.data?.length === undefined ? [this.data] : this.data;
    this.numberOfPage = this.info.numberOfPage;
    const tmp = this.numberOfPage;
    if (this.info.autoPlay)
      interval(2000)
        .pipe(take(this.info.numberOfPage))
        .subscribe((d) => {
          this.scroll(0);
          this.count++;
          if (this.count === tmp)
            this.render.setStyle(this.frame.nativeElement, 'left', '0px');
        });
  }

  getArray(num: any) {
    const arr = ['0', '0', '0', '0', '0'];
    return arr.slice(0, Number(num));
  }
  extractRate(rate: string) {
    const tmp = rate.split('-');
    return tmp;
  }
  changeCenter(lat: any, lon: any, city: string, type: string) {
    const tmp = [[lat, lon], city, type];
    this.viewOnMap.emit(tmp);
  }
  scroll(val: any) {
    if (val === 1) {
      this.left += this.info.Speed;
      this.numberOfPage++;
    } else {
      this.numberOfPage--;
      this.left -= this.info.Speed;
    }
    if (this.numberOfPage) {
      const i = interval(1).pipe(take(50));
      i.subscribe((d) => {
        if (val === 1) {
          this.left += this.info.Speed;
          this.info.numberOfPage++;
        } else {
          this.info.numberOfPage--;
          this.left -= this.info.Speed;
        }
        this.render.setStyle(
          this.frame.nativeElement,
          'left',
          this.left + 'px'
        );
      });
    } else {
      this.numberOfPage = this.info.numberOfPage;
      this.left = 0;
    }
  }
}
