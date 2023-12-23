import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scorePipe',
  pure: false,
})
export class ScorePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const result = value < 3 ? 'low' : value < 5 ? 'medium' : 'high';
    return result + ' rate';
  }
}
