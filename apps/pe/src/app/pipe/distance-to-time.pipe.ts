import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'price' })
export class DistancePipe implements PipeTransform {
  transform(distance: any, type: string): any {
    const vehicle = type === 'car' ? 'fa fa-car' : 'fa fa-male';
    const carSpeedFactor = distance > 40000 ? 75000 : 45000;
    const walkSpeedFactor = 3600;
    let times =
      type === 'car' ? distance / carSpeedFactor : distance / walkSpeedFactor;
    times *= 60;
    const t =
      times > 60
        ? Math.round(Number(times) / 60) +
          ' hour and ' +
          Math.round(Number(times) % 60) +
          ' min'
        : Math.round(times) + ' min';

    const result = (type =
      '<i class="' + vehicle + '" aria-hidden="true"></i> ' + t);

    return result;
  }
}
