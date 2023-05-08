import { AbstractControl } from "@angular/forms";

export let whitespaceControl = (control: AbstractControl) => {
    if (control.value && /[\s\n]/gm.test(control.value)) {
        return { newLineAndSpace: "There should be no new lines or white spaces in the text." }
    }
    return null
}

export let onlyWordChars = (control: AbstractControl) => {
    if (control.value && /\W/gm.test(control.value)) {
        return { onlyWordChars: "There should be only numbers and letters in the name." }
    }
    return null
}

export let letterControl = (control: AbstractControl) => {
    if (control.value && !/[a-zA-Z]/gm.test(control.value)) {
        return { letterControl: "There should should be at least one letter in the name." }
    }
    if(control.value){
        console.log(!/[a-zA-Z]/gm.test(control.value));
    }
    return null
}