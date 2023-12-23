import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleCompare',
})
export class VehicleCOmparePipe implements PipeTransform {
  transform(value: any): any {
    const result = value
      ? '<i class="fa fa-check">'
      : '<i class="fa fa-close">';
    return result;
  }
}
