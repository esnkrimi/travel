import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeCompare',
})
export class TimeCOmparePipe implements PipeTransform {
  transform(value: any): any {
    const result = value.includes('0 D ,0 H')
      ? '<i class="fa fa-check">'
      : value;
    return result;
  }
}
