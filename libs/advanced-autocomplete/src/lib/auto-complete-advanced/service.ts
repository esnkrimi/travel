import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdvancedAutoCompleteService {
  constructor(private httpClient: HttpClient) {}
  fetchLocationTypes() {
    return this.httpClient.get(
      'https://burjcrown.com/drm/travel/index.php?id=45'
    );
  }
}
