import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'distanceOrder' })
export class DistanceOredrPipe implements PipeTransform {
  transform(distance: any): any {
    const result: any =
      distance > 1000 ? distance / 1000 + ' KM' : distance + ' M';

    return result;
  }
}
