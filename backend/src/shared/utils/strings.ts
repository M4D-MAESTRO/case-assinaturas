export function ClearSpecialCharacters(inputString: string) {
    if(!inputString || inputString.trim().length <= 0){
        return '';
    }
    const outputString = inputString.replace(/[^a-zA-Z0-9]/g, '').trim();
    return outputString;
}