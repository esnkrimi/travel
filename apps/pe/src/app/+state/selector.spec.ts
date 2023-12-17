import { TestBed } from '@angular/core/testing';
import { newSelect, selectCurrency } from './select';

describe('CalendarComponent', () => {
  let sampleInitialState: any = {
    currency: [['SOL', '200', 'yellow', '$10', '$10', 'Ƀ10', 'Market', false]],
    dataSignup: {
      firstname: 'ehsan',
      lastname: 'karimi',
      email: 'esn@',
      password: '123',
      mobile: '918',
    },
    dataLogin: {
      uesername: 'usname',
      password: 'pass',
    },
    resultLogin: '1',
    resultSignup: '1',
    active: true,
    user: {
      id: 100,
      email: 'esnkr@gmail',
      address: {
        city: 'hamedan',
        street: 'rokni',
      },
    },
  };

  it('should return', () => {
    const result = selectCurrency.projector(sampleInitialState);
    result;
  });
});
