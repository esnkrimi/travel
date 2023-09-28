import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({ selector: '[vehicleDirective]' })
export class VehicleDirective implements OnChanges {
  @Input() valueChanged: any;

  constructor(private render: Renderer2, private elRef: ElementRef) {}
  ngOnChanges() {
    if (!this.valueChanged)
      this.render.setStyle(this.elRef.nativeElement, 'color', 'red');
    else this.render.setStyle(this.elRef.nativeElement, 'color', 'green');
  }
}
