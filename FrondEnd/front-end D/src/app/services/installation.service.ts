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

    getAllInstalation() {
        return this.installationApiService.getAllInstalation().pipe(map((res) => {
            return res
        }))
    }
}