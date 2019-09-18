import { words } from './words';

export const generateSecret = () => {
    let secretText = "";
    for ( let i=0; i<5; i++ ) secretText += words[Math.floor( Math.random() * words.length )];
    return secretText;
}