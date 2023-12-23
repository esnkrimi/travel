import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyCompare',
  pure: false,
})
export class MoneyCOmparePipe implements PipeTransform {
  transform(value: any): any {
    const result = value === 0 ? '<i class="fa fa-check">' : value + ' $';
    return result;
  }
}
