import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HelpService {
  textInner = new BehaviorSubject('');
  messageWrite(text: any) {
    this.textInner.next('');
    setTimeout(() => {
      this.textInner.next(text);
    }, 200);
  }
}
