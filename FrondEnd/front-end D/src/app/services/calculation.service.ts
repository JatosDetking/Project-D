import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CalcilationAPIService } from "../api/calculation-api.service";
import { SharedService } from "./shared.service";


@Injectable({
    providedIn: 'root'
})
export class CalculationService {

    constructor(
        private calcilationAPI: CalcilationAPIService,
        private sharedService: SharedService
    )  { sharedService.shareSelf("CalculationService", this) }

    getCalculation(terrainsIds: string, instalationsIds:string,method:string, balance:number) {
         return this.calcilationAPI.getCalculation(terrainsIds,instalationsIds,method,balance).pipe(map((res) => {
            return res
        })) 
    }



}