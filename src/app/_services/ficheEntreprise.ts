import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "environments/environment";

@Injectable({ providedIn: 'root' })
export class FicheEntrepriseService {
    constructor(
        private http: HttpClient
    ) {
        
    }

    getFicheEntreprise(siren){
        return  this.http.get<any>(`https://api.pappers.fr/v1/entreprise?api_token=${environment.token}&siren=`+siren);
    }

    getDocument(token){
        return  this.http.get<any>(`https://api.pappers.fr/v1/document/telechargement?api_token=${environment.token}&token=`+token);
    }
}