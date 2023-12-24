import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scorePipe',
  pure: false,
})
export class ScorePipe implements PipeTransform {
  transform(value: number): string {
    const result = value < 3 ? 'low' : value < 5 ? 'medium' : 'high';
    return result + ' rate';
  }
}
