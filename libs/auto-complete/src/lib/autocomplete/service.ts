import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FetchLocationService {
  constructor(private httpClient: HttpClient) {}
  getCountry(item: string) {
    return this.httpClient.get('./assets/datas/locations.json').pipe(
      map((d: any) => Object.keys(d)),
      map((res) =>
        res.filter((r: any) =>
          r.toLocaleLowerCase().includes(item.toLocaleLowerCase())
        )
      )
    );
  }

  getGeographic(city: string, country: string, geo: any, sym: any) {
    if (geo?.length > 1) {
      const t = [
        {
          country_name: country,
          latitude: geo[0],
          longitude: geo[1],
          name: city,
          state_name: sym,
          city: sym,
        },
      ];
      return of(t);
    } else {
      country = country.replace(' ', '');
      city = city.replace(' ', '');
      return this.httpClient.get(
        `https://burjcrown.com/drm/travel/index.php?time=19&id=35&city=${city}&country=${country}`
      );
    }
  }
  getExactLocation(item: string) {
    //let tmp: any = [];
    let results: any = [];
    return this.httpClient
      .get(`https://burjcrown.com/drm/travel/index.php?id=9&location=${item}`)
      .pipe(
        map((res) => Object.entries(res)),
        map((res: any) => {
          results = [];
          for (let i = 0; i < res.length; i++) {
            let tmp: any = {
              country: '',
              city: '',
              title: '',
              sym: '',
              geo: [],
              type: '',
            };
            //    if (res[i][1].join(' ').toLowerCase().includes(item.toLowerCase()))
            tmp.country = res[i][1]?.country;
            tmp.geo = [res[i][1].lat, res[i][1].lon];
            tmp.type = res[i][1].type;
            tmp.sym = res[i][1].title.replace(' ', '-');
            tmp.city = res[i][1].city;
            tmp.title = res[i][1].title.replace(' ', '-');
            tmp.city && results.push(tmp);
          }
          return results;
        })
      );
  }

  get(item: string) {
    const results: any = [];
    return this.httpClient
      .get(
        `https://burjcrown.com/drm/travel/index.php?time=19&id=34&item=${item}`
      )
      .pipe(
        map((res: any) => {
          let tmp: any = {
            country: '',
            city: '',
            sym: '',
            geo: [],
          };
          let length = res.length > 1 ? res.length : 1;
          length = res.length > 5 ? 5 : res.length;
          if (res[0]?.country_name === res[1]?.country_name) {
            length = 1;
            // res[0].name = res[0].country_name;
          }
          for (let i = 0; i < length; i++) {
            tmp = {
              country: res[i].country_name,
              city: res[i].name,
              sym: res[i].country_name,
              geo: [],
            };
            results.push(tmp);
          }

          return results;
        })
      );
  }
}
