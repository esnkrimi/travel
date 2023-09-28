import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';

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

  getGeographic(city: string, country: string, geo: any) {
    if (geo.length > 1) {
      const t = [
        {
          country_name: country,
          latitude: geo[0],
          longitude: geo[1],
          name: city,
        },
      ];
      return of(t);
    } else {
      city = city.replace(' ', '-');
      country = country.replace(' ', '-');
      return this.httpClient
        .get('./assets/datas/geography.json')
        .pipe(
          map((res: any) =>
            res.filter(
              (res: any) =>
                res.country_name.replace(' ', '-') === country &&
                res.name.replace(' ', '-') === city
            )
          )
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
            tmp.city = res[i][1].title + ' ' + res[i][1].type;
            tmp.title = res[i][1].title.replace(' ', '-');
            tmp.city && results.push(tmp);
          }
          return results;
        })
      );
  }

  get(item: string) {
    let results: any = [];
    return this.httpClient.get('./assets/datas/locations.json').pipe(
      map((res) => Object.entries(res)),
      map((res) => {
        results = [];
        for (let i = 0; i < res.length; i++) {
          let tmp: any = {
            country: '',
            city: '',
            sym: '',
            geo: [],
          };
          const t = res[i][1].join(' ').toLowerCase();
          if (t.includes(item.toLowerCase())) {
            res[i][1].forEach((element: any) => {
              if (element === item) {
                tmp.city = element;
              }
            });
            tmp.country = res[i][0];
            tmp.geo = [];
            tmp.sym = res[i][0];
            tmp.city && results.push(tmp);
          }
        }
        return results;
      })
    );
  }
}
