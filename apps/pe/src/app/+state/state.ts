export interface State {
  currency: any;
  dataSignup: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    mobile: string;
  };
  dataLogin: {
    uesername: string;
    password: string;
  };
  resultLogin: string;
  resultSignup: string;
  active: boolean;
  user: {
    id: number;
    email: string;
    address: {
      city: string;
      street: string;
    };
  };
}
export const initialState: State = {
  currency: [[]],
  dataSignup: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    mobile: '',
  },
  dataLogin: {
    uesername: '',
    password: '',
  },
  resultLogin: '',
  resultSignup: '',
  active: true,
  user: {
    id: 1,
    email: ' ',
    address: {
      city: ' ',
      street: ' ',
    },
  },
};
