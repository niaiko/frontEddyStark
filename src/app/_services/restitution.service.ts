import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InputRequest } from "app/_models/Input";
import { RecapCa } from "app/_models/recapCa";
import { environment } from "environments/environment";

@Injectable({ providedIn: 'root' })
export class RestitutionServices {   
    constructor(        
        private http: HttpClient
    ) {}

    getRecapCaBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getRecapCaBySiren`, input);
    }

    getCheckEcritureBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getCheckEcritureBySiren`, input);
    }    

    getCheckListBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getCheckListBySiren`, input);
    }    

    getCheckList7BySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getCheckList7BySiren`, input);
    }  

    getCheckList64BySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getCheckList64BySiren`, input);
    }  

    getWarningEcritureBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getWarningEcritureBySiren`, input);
    }    

    getDetailEcritureDisparueBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getDetailEcritureDisparueBySiren`, input);
    }  

    getDetailEcritureApparueBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getDetailEcritureApparueBySiren`, input);
    }  

    getListPeriodeEcritureWarningBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getListPeriodeEcritureWarningBySiren`, input);
    }     

    getListPeriodeBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getListPeriodeBySiren`, input);
    }

    
    getListPeriodeOfLastExoBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getListPeriodeBySiren`, input);
    }
    getListPeriodeOfExoBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getListPeriodeOfExoBySiren`, input);
    }
    

    getActifDispoBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getActifDispoBySiren`, input);
    }

    getListPeriodeActifDispoBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getListPeriodeActifDispoBySiren`, input);
    }
    
    getPassifExigibleSiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getPassifExigibleSiren`, input);
    }

    getListExoBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getListExoBySiren`, input);
    }    

    getCrossTabCABySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getCrossTabCABySiren`, input);
    }
    
    getBFRBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getBFRBySiren`, input);
    }
    getCAFBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getCAFBySiren`, input);
    }

    getDisparuAvantApresBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getDisparuAvantApresBySiren`, input);
    }
    
    getApparuAvantApresBySiren(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getApparuAvantApresBySiren`, input);
    }
    
    getImpot(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getImpot`, input);
    } 
    
    addOfxAndBanque(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/addOfxAndBanque`, input);
    } 

    getRapprochementOfx(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getRapprochementOfx`, input);
    }

    getRapprochementFec(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getRapprochementFec`, input);
    }

    getDernierDateArret(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getDernierDateArret`, input);
    }    

    getPropositionBanque(input:InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getPropositionBanque`, input);
    }
}