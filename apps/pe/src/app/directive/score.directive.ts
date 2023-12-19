import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({ selector: '[scoreDirective]' })
export class ScoreDirective implements OnChanges {
  @Input() value: any;

  constructor(private render: Renderer2, private elRef: ElementRef) {}
  ngOnChanges() {
    if (this.value < 3)
      this.render.setStyle(this.elRef.nativeElement, 'color', 'red');
    else if (this.value < 5)
      this.render.setStyle(this.elRef.nativeElement, 'color', 'orange');
    else this.render.setStyle(this.elRef.nativeElement, 'color', 'green');
  }
}
