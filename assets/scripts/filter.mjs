import {Filter} from 'bad-words';


const filter = new Filter();
const offensiveWords = [
  "abruti",
  "andouille",
  "batard",
  "bouffon",
  "connard",
  "conne",
  "crétin",
  "cul",
  "débile",
  "dégueulasse",
  "enculé",
  "enfoiré",
  "espèce",
  "fils de pute",
  "garce",
  "gogol",
  "idiot",
  "imbécile",
  "lâche",
  "merde",
  "naze",
  "ordure",
  "pauvre con",
  "pédé",
  "petasse",
  "pute",
  "racaille",
  "raté",
  "salope",
  "salaud",
  "suceur",
  "tapette",
  "tas de merde",
  "trou du cul",
  "va te faire",
  "va te faire foutre"
];
filter.addWords(...offensiveWords);
const inputText = process.argv[2]; // Texte passé en argument
const cleanText = filter.clean(inputText);

console.log(cleanText); // Affiche le texte filtré