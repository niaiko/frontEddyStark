import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputRequest } from '../_models/Input';
import { environment } from 'environments/environment';
import { Historique } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class BilanService {

  constructor(private http: HttpClient) { }

  getWalletFileLastHistories(siren : InputRequest){
    return this.http.post<Historique[]>(`${environment.apiUrl}/wallets/getWalletLastHistories`,  siren );
}
}
