import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdvancedAutoCompleteService {
  constructor(private httpClient: HttpClient) {}
}
