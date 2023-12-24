export interface IScope {
  center: any;
  city: string;
  country: string;
  state: string;
}

export interface ILocation {
  country_name: string;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  state_name: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILocationtype {
  type: string;
}

export interface ILocationTypes {
  type: ILocationtype[];
}
