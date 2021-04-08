import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment'
import { Wallet, Historique, Parametrage, User } from '../_models';
import { InputRequest } from '../_models/Input';
import { FuseauHoraire } from '../_models/fuseau';
import { UniteLegale } from '../_models/uniteLegale';
import { Tiers } from '../_models/tiers';
import { Dirigeant } from '../_models/dirigeant';
import { InfoMandataire } from '../_models/infoMandataire';
import { Mandataire } from '../_models/mandataire';
import { Etudes } from '../_models/etudes';
import { EtudePrincipal } from '../_models/etudePrincipal';
import { EtudeTiers } from '../_models/etudeTiers';
import { FiscalTab } from '../_models/fiscalTab';
import { LogAction } from '../_models/logAction';


@Injectable({ providedIn: 'root' })
export class WalletService {   
   
    constructor(        
        private http: HttpClient
    ) {}
    sendMail(input:InputRequest) {
        return this.http.post<any>(`${environment.apiUrl}/mail/sendemail`, input);
    }
    addWallet(wallet: Wallet) {
        return this.http.post(`${environment.apiUrl}/wallets/addWallet`, wallet);
    }

    getAll(adminMail : string) {
        return this.http.post<Wallet[]>(`${environment.apiUrl}/wallets`, { adminMail });
    }
    getAllBO() {
        return this.http.get<Wallet[]>(`${environment.apiUrl}/wallets/BO`);
    }

    getWallet(siren: string) {
        return this.http.post<Wallet>(`${environment.apiUrl}/wallets/getWallet`, { siren });
    }

    getWalletFileHistories(input : InputRequest ){
        return this.http.post<Historique[]>(`${environment.apiUrl}/wallets/getWalletHistories`,  input);
    }

    getWalletFileLastHistories(input : InputRequest){
        return this.http.post<Historique[]>(`${environment.apiUrl}/wallets/getWalletLastHistories`,  input );
    }

    getWalletTotalHistories(input : InputRequest){
        return this.http.post<Number>(`${environment.apiUrl}/wallets/getWalletTotalHistories`,  input );
    } 
    
    getAllWalletTotalHistories(){
        return this.http.get<Number>(`${environment.apiUrl}/wallets/getAllWalletTotalHistories`);
    } 

    getAllWalletFileHistories(input : InputRequest ){
        return this.http.post<Historique[]>(`${environment.apiUrl}/wallets/getAllWalletHistories`, input);
    }
    getFuseauHoraire(){
        return this.http.get<FuseauHoraire[]>(`${environment.apiUrl}/wallets/getFuseauHoraire`);
    }  
    
    getFuseauHoraireByRegion(input : InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/wallets/getFuseauHoraireByRegion`, input);
    }
    // Unite Legal Routine
    geAlltUniteLegale(input :InputRequest){
        return this.http.post<UniteLegale[]>(`${environment.apiUrl}/uniteLegale/getAll`, input);
    }    
    
    getUniteLegaleListBySearch(input :InputRequest){
        return this.http.post<UniteLegale[]>(`${environment.apiUrl}/uniteLegale/getUniteLegaleListBySearch`, input);
    }

    getUniteLegaleListByEtude(input :InputRequest){
        return this.http.post<UniteLegale[]>(`${environment.apiUrl}/uniteLegale/getUniteLegaleListByEtude`, input);
    }

    getUniteLegaleListByEtudeNoPage(input :InputRequest){
        return this.http.post<UniteLegale[]>(`${environment.apiUrl}/uniteLegale/getUniteLegaleListByEtudeNoPage`, input);
    }
    
    getTotalUniteLegale(){
        return this.http.get<Number>(`${environment.apiUrl}/uniteLegale/getAllTotal`);
    }  

    getUniteLegaleTotalSearch(input :InputRequest){
        return this.http.post<Number>(`${environment.apiUrl}/uniteLegale/getUniteLegaleTotalSearch`, input);
    }  

    getUniteLegaleTotalByEtude(input :InputRequest){
        return this.http.post<Number>(`${environment.apiUrl}/uniteLegale/getUniteLegaleTotalByEtude`, input);
    }  

    getDirigeantBySiren(input :InputRequest){
        return this.http.post<Dirigeant[]>(`${environment.apiUrl}/uniteLegale/getDirigeantBySiren`, input);
    }

    getJugeCommissaireByEtudeSiren(input :InputRequest){
        return this.http.post<Tiers[]>(`${environment.apiUrl}/uniteLegale/getJugeCommissaireByEtudeSiren`, input);
    }
    
    saveTiers(input :InputRequest){
        return this.http.post<string>(`${environment.apiUrl}/uniteLegale/saveTiers`, input);
    }

    deleteTiers(input :InputRequest){
        return this.http.post<string>(`${environment.apiUrl}/uniteLegale/deleteTiers`, input);
    }

    getAllMandataire(){
        return this.http.get<Mandataire[]>(`${environment.apiUrl}/uniteLegale/getAllMandataire`);
    }
    getTiersAJAll(){
        return this.http.get<Mandataire[]>(`${environment.apiUrl}/uniteLegale/getTiersAJAll`);
    }

    getMandataireInfoMailByID(input :InputRequest){
        return this.http.post<InfoMandataire[]>(`${environment.apiUrl}/uniteLegale/getMandataireInfoMailByID`, input);
    }

    getMandataireInfoPhoneByID(input :InputRequest){
        return this.http.post<InfoMandataire[]>(`${environment.apiUrl}/uniteLegale/getMandataireInfoPhoneByID`, input);
    }
    
    getMandataireByEtudeSiren(input :InputRequest){
        return this.http.post<Tiers[]>(`${environment.apiUrl}/uniteLegale/getMandataireByEtudeSiren`, input);
    }

    getCOAJByEtudeSiren(input :InputRequest){
        return this.http.post<Tiers[]>(`${environment.apiUrl}/uniteLegale/getCOAJByEtudeSiren`, input);
    }

    getExpertComptableByEtudeSiren(input :InputRequest){
        return this.http.post<Tiers[]>(`${environment.apiUrl}/uniteLegale/getExpertComptableByEtudeSiren`, input);
    }
    
    getCommissaireByEtudeSiren(input :InputRequest){
        return this.http.post<Tiers[]>(`${environment.apiUrl}/uniteLegale/getCommissaireByEtudeSiren`, input);
    }

    getComptableByEtudeSiren(input :InputRequest){
        return this.http.post<Tiers[]>(`${environment.apiUrl}/uniteLegale/getComptableByEtudeSiren`, input);
    }

    getAvocatByEtudeSiren(input :InputRequest){
        return this.http.post<Tiers[]>(`${environment.apiUrl}/uniteLegale/getAvocatByEtudeSiren`, input);
    }

    getRefEtudeByMail(input :InputRequest){
        return this.http.post<string[]>(`${environment.apiUrl}/uniteLegale/getRefEtudeByMail`, input);
    }

    ouvrirUnEtude(input :InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/ouvrirUnEtude`, input);
    }

    fermerEtude(input :InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/fermerEtude`, input);
    }

    ouvrirUnDossier(input :InputRequest){
        return this.http.post<string>(`${environment.apiUrl}/uniteLegale/ouvrirUnDossier`, input);
    }

    fermerLeDossier(input :InputRequest){
        return this.http.post<string>(`${environment.apiUrl}/uniteLegale/fermerLeDossier`, input);
    }

    getEtudesByRef(input :InputRequest){
        return this.http.post<Etudes[]>(`${environment.apiUrl}/uniteLegale/getEtudesByRef`, input)
    }

    getAllEtudesPrincipal(){
        return this.http.get<EtudePrincipal[]>(`${environment.apiUrl}/uniteLegale/getAllEtudesPrincipal`);
    }
    
    getEtudeTiersList(input :InputRequest){
        return this.http.post<EtudeTiers[]>(`${environment.apiUrl}/uniteLegale/getEtudeTiersList`, input)
    }

    saveAdminJudiciaire(input :User) {
        return this.http.post(`${environment.apiUrl}/api/auth/signup`, input);
    }
   
    saveTiersEtude(input :InputRequest){
        return this.http.post<string>(`${environment.apiUrl}/uniteLegale/saveTiersEtude`, input);
    }

    attachEtudeTiers(input :InputRequest){
        return this.http.post<string>(`${environment.apiUrl}/uniteLegale/attachEtudeTiers`, input);
    }

    deleteTiersEtude(input :InputRequest){
        return this.http.post<string>(`${environment.apiUrl}/uniteLegale/deleteTiersEtude`, input);
    }
    
    detacherTiersEtude(input :InputRequest){
        return this.http.post<string>(`${environment.apiUrl}/uniteLegale/detacherTiersEtude`, input);
    }

    getBilanBySiren(input :InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getBilanBySiren`, input)
    }

    getFiscalTabBySirenApres(input :InputRequest){
        return this.http.post<FiscalTab[]>(`${environment.apiUrl}/uniteLegale/getFiscalTabBySirenApres`, input)
    }

    getFiscalTabBySirenAvant(input :InputRequest){
        return this.http.post<FiscalTab[]>(`${environment.apiUrl}/uniteLegale/getFiscalTabBySirenAvant`, input)
    }

    getRefFiscalCompte(){
        return this.http.get<string[]>(`${environment.apiUrl}/uniteLegale/getRefFiscalCompte`);
    }
    getRefEtudeDossierBySiren(input :InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/uniteLegale/getRefEtudeDossierBySiren`, input);
    }

    getLoginToCreate(){
        return this.http.get<UniteLegale[]>(`${environment.apiUrl}/uniteLegale/getLoginToCreate`);
    }
    /*ADD TOKEN */
    
    getInfoBilanUniteLegal(input :InputRequest){
       
        return this.http.post<UniteLegale[]>(`${environment.apiUrl}/uniteLegale/getInfoBilanUniteLegal`, input)
    }
    /*FIN ADD TOKEN */


    getAllLogActionTotal(){
        return this.http.get<Number>(`${environment.apiUrl}/wallets/getAllLogActionTotal`);
    }

    getAllLogAction(input: InputRequest){
        return this.http.post<LogAction[]>(`${environment.apiUrl}/wallets/getAllLogAction`, input);
    }

    getAllConnexionHistory(input: InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/wallets/getAllConnexionHistory`, input);
    }

    getRedressement(input: InputRequest){
        return this.http.post<Parametrage>(`${environment.apiUrl}/wallets/getRedressement`, input)
    }

    addRedressement(input: InputRequest){
        return this.http.post<String>(`${environment.apiUrl}/wallets/addRedressement`, input)
    }

    getEcheance(input: InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/wallets/getEcheance`, input)
    }

    addEcheance(input: InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/wallets/addEcheance`, input)
    }

    getBanque(input: InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/wallets/getBanques`, input)
    }

    addBanque(input: InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/wallets/addBanque`, input)
    }

    deleteBanque(input: InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/wallets/deleteBanque`, input)
    }

    recalcul(input :InputRequest){
        return this.http.post<any>(`${environment.apiUrl}/traitement/recalcul`, input);
    }
}