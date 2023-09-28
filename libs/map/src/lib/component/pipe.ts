import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'price' })
export class DistancePipe implements PipeTransform {
  transform(distance: any, type: string): any {
    const vehicle = type === 'car' ? 'fa fa-car' : 'fa fa-male';
    const times =
      type === 'car'
        ? Math.round((distance / 72000) * 66)
        : Math.round(distance / 80);
    const t =
      times > 60
        ? Math.round(Number(times) / 60) +
          ' hour and ' +
          Math.round(Number(times) % 60) +
          ' min'
        : times + ' min';
    const result = (type =
      '<i class="' + vehicle + '" aria-hidden="true"></i> ' + t);

    console.log(t, result);
    return result;
  }
}
