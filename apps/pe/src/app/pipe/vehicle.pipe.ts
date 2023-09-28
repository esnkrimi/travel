import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleCompare',
})
export class VehicleCOmparePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const result = value ? 'exact' : 'changed';
    return result;
  }
}
