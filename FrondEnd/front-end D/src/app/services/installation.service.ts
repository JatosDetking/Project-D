import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { InstallationApiService } from "../api/installation-api.service";
import { SharedService } from "./shared.service";

@Injectable({
    providedIn: 'root'
})
export class InstallationService {

    constructor(
        private installationApiService: InstallationApiService,
        private sharedService: SharedService
    ) { sharedService.shareSelf("InstallationService", this) }

    getAllInstallation() {
        return this.installationApiService.getAllInstallations().pipe(map((res) => {
            return res
        }))
    }
    getInstallation(id:number) {
        return this.installationApiService.getInstallation(id).pipe(map((res) => {
            return res
        }))
    }
    getAllUserInstallations(id:number) {
        return this.installationApiService.getAllUserInstallations(id).pipe(map((res) => {
            return res
        }))
    }
    updateInstallation(id: number, name: string, intervals: string, performance_factors: string, price: number) {
        return this.installationApiService.updateInstalation(id,name,intervals,performance_factors,price).pipe(map((res) => {
            return res
        }))
    }
    addInstallation(name: string, intervals: string, performance_factors: string, price: number, type: string) {
        return this.installationApiService.addInstalation(name,intervals,performance_factors,price,type).pipe(map((res) => {
            return res
        }))
    }
    deleteInstallation(id:number) {
        return this.installationApiService.deleteInstallation(id).pipe(map((res) => {
            return res
        }))
    }
}