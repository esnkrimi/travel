export const vehicle = new Set([
  'car',
  'ship',
  'boat',
  'airplane',
  'bycycle',
  'motorcycle',
  'train',
  'walk',
]);

export interface ILocationInTrip {
  lat: string;
  lon: string;
  dateIncome: string;
  timeIncome: string;
  vehicle?: typeof vehicle;
  note: string;
  moneyLost: string;
  persons: string;
  locationTitle: string;
}
export interface IReviewLocationInTrip {
  lat: any;
  lon: any;
  dateIncome: string;
  timeIncome: string;
  vehicle?: any;
  note: string;
  moneyLost: string;
  persons: string;
  locationTitle: string;
}

export interface ITrip {
  title: string;
  trip: ILocationInTrip[];
  reviewtrip?: IReviewLocationInTrip[];
}
export interface IloginInfo {
  email?: string | null | undefined;
  password?: string | null | undefined;
}
export interface IAllTrips {
  email: string;
  family: string;
  finish: string;
  name: string;
  tripid: string;
  tripjson: ITrip[];
  tripjson_done?: string;
  uid: string;
}

export interface ISetview {
  country_code: string;
  country_id: string;
  country_name: string;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  state_code: string;
  state_id: number;
  state_name: string;
  wikiDataId: string;
}
export interface state {
  allTrips: IAllTrips[];
  trip: ITrip[];
  reviewtrip: ITrip[];
  location: Ilocation[];
  user: Iuser;
  usersOfSite: IuserOfSite[];
  loginInfo: IloginInfo;
  setview: ISetview;
}
export const AppState: state = {
  trip: [],
  reviewtrip: [],
  location: [],
  user: {
    id: '',
    name: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
  },
  loginInfo: {
    email: 'emails',
    password: 'passwords',
  },
  setview: {
    country_code: '',
    country_id: '',
    country_name: '',
    id: 0,
    latitude: '',
    longitude: '',
    name: '',
    state_code: '',
    state_id: 0,
    state_name: '',
    wikiDataId: '',
  },
  usersOfSite: [],
  allTrips: [],
};

export interface IuserOfSite {
  id: string;
  name: string;
  lnama: string;
  email: string;
}

export interface Iuser {
  id: string;
  name: string;
  lname: string;
  email: string;
  mobile?: string;
  password: string;
}

export interface Ilocation {
  city: string;
  country: string;
  county: string;
  district: string;
  email: string;
  id: number;
  lat: string;
  lon: string;
  phone: string;
  saved?: boolean;
  street: string;
  title: string;
  type: string;
  uid?: number;
  web: string;
  no?: string;
  describe?: string;
  score: number;
}

export abstract class user implements Iuser {
  abstract login(): object;
  abstract register(): boolean;
  abstract recovery(): boolean;
  abstract edit(): boolean;
  name = '';
  id = '';
  lname = '';
  email = '';
  mobile = '';
  password = '';
}

export abstract class location implements Ilocation {
  abstract submit(): void;
  abstract search(): object;
  abstract vote(): void;
  abstract browse(): object;

  id = 1;
  score = 0;
  country = '';
  city = '';
  title = '';
  district = '';
  street = '';
  county = '';
  no = '';
  lon = '';
  lat = '';
  email = '';
  phone = '';
  web = '';
  describe = '';
  type = '';
}

export const typeOflocations = [
  'cinema',
  'hotel',
  'disco',
  'club',
  'autogallery',
  'hospital',
  'gym',
  'restaurant',
  'mall',
  'school',
  'petrol',
  'zoo',
  'park',
  'airport',
  'fun',
  'pool',
];
