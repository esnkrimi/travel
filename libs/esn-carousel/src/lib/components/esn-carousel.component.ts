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
import { EsnCarouselService } from './esn-carousel.service';

@Component({
  selector: 'esn-carousels',
  templateUrl: `esn-carousel.component.html`,
  styleUrls: ['esn-carousel.scss'],
})
export class EsnCarouselComponent implements OnInit {
  @ViewChild('frame') frame: ElementRef;
  @Output() viewOnMap = new EventEmitter<any>();
  @Input() info: any;
  @Input() data: any;

  left = 0;
  count = 0;
  numberOfPage: any;
  constructor(private render: Renderer2) {}

  ngOnInit(): void {
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
