import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeScannerService {
  cameraId:any
  cameras:any
  cameraindex = 0
  constructor() { }
  html5QrCode?:Html5Qrcode
  
  
  switchCamera(){
    if(this.cameraindex == this.cameras.length-1){
      this.cameraindex = 0
    }else{
      this.cameraindex++
    }
    this.cameraId = this.cameras[this.cameraindex].id
  }

  getPermissionAndComareId(){
    Html5Qrcode.getCameras().then(devices => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        this.cameras = devices
        this.cameraId = devices[this.cameraindex].id;
        // .. use this to start scanning.
      }
    }).catch(err => {
      // handle err
    });
    this.html5QrCode = new Html5Qrcode("reader");
  }

  scanImage(imageFile:any,successScan:(message:string)=>void,errFunc:(err:any)=>void){
  // Scan QR Code
  this.html5QrCode!.scanFile(imageFile, true)
  .then(successScan)
  .catch(errFunc);
  }

  startScan(successScan:(message:string)=>void,errScan:(message:string)=>void,errFunc:(err:any)=>void){
    this.html5QrCode!.start(
      this.cameraId,     // retreived in the previous step.
      {
        fps: 10,    // sets the framerate to 10 frame per second
        qrbox: 250  // sets only 250 X 250 region of viewfinder to
                    // scannable, rest shaded.
      },
      successScan,
      errScan)
    .catch(errFunc);
  }

  stopScan(resFunc:(res:any)=>void){
    this.html5QrCode?.stop().then(resFunc)
  }
}
