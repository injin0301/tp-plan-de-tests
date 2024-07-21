const fs = require('fs');
const { resolve } = require('path');
const readline = require('readline');

// Fonction pour lire le fichier CSV et récupérer les lignes correspondant à une date spécifiée
async function getLinesByDate(inputFilePath, dateColumn, targetDate) {    

    let headers = [];
    const matchingLines = [];
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(inputFilePath),
            output: process.stdout,
            terminal: false
        });

        rl.on('line', (line) => {
            cells = line.split(',');         
    
            // Si les en-têtes ne sont pas encore définis, les définir à partir de la première ligne
            if (headers.length === 0) {
                headers.push(cells[0]);
                headers.push(cells[1]);
                headers.push(cells[2]);
                headers.push(cells[3]);
                headers.push(cells[4]);
                headers.push(cells[5]);
            } else {
                // Trouver l'index de la colonne de date
                const dateColumnIndex = headers.indexOf(dateColumn);
    

                if (dateColumnIndex === -1) {
                    rl.close();
                    callback(new Error(`Colonne de date "${dateColumn}" non trouvée dans le fichier CSV.`), null);
                    return;
                }
    
                // Vérifier si la date de la ligne correspond à la date recherchée
                let dateNorma;  
                if(cells[dateColumnIndex] != '') {
                    dateNorma = normalizeDate(cells[dateColumnIndex])
                }                
                         
                if (dateNorma === targetDate) {                
                    matchingLines.push(cells.join(','));
                }
            }
        });
    
        rl.on('close', () => {
            resolve(matchingLines);
        });
    
        rl.on('error', () => {
            reject(err);
        });
    })    
}

function addDayToDate(dateString) {
    // Convertir la chaîne de date en objet Date
    // Note : Ici, on suppose que le format de la date est 'DD/MM/YYYY'
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day); // Mois est 0-indexé en JavaScript

    // Ajouter un jour
    date.setDate(date.getDate() + 1);

    // Convertir l'objet Date en chaîne de caractères au format 'DD/MM/YYYY'
    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Mois est 1-indexé ici
    const newYear = date.getFullYear();

    return `${newDay}/${newMonth}/${newYear}`;
}

// Fonction pour écrire les lignes dans un nouveau fichier CSV
function writeCsvFile(outputFilePath, headers, lines) {
    const outputStream = fs.createWriteStream(outputFilePath);
    outputStream.write(headers.join(',') + '\n'); // Écrire les en-têtes

    lines.forEach(line => {
        outputStream.write(line + '\n'); // Écrire chaque ligne correspondante
    });

    outputStream.end();
}

function isDayPratique(matchingLines) {
    if(matchingLines.length == 0) {
        return false;
    }

    let result = false;
    matchingLines.forEach(line =>
        {
            cells = line.split(',');
            if(cells[2] == 'True' || cells[3] == 'True') {
                result = true;
            }
        }                       
    );
    return result;    
}

function isSeanceComplete(matchingLines) {
    if(matchingLines.length == 0) {
        return false;
    }

    let seanceComplete = true;
    let allonge = false;
    let assis = false;
    let seance5 = 0;
    let seance10 = 0;
    matchingLines.forEach(line =>
        {
            cells = line.split(',');
            if(cells[1] == '1') {
                // Niveau 1
                if(cells[2] == 'True') {
                    seance5++;
                    allonge = true;
                }

                if(cells[3] == 'True') {
                    seance5++;
                    assis = true;
                }
            }

            if(cells[1] == '2') {
                // Niveau 2
                if(cells[2] == 'True') {
                    seance10++;
                    allonge = true;
                }

                if(cells[3] == 'True') {
                    seance10++;
                    assis = true;
                }
            }
        }                       
    );

    if(allonge && assis && (seance5 >= 2 || seance10 >= 1)){
        seanceComplete = true
    } else {
        seanceComplete = false;
    }

    return seanceComplete;
}

function normalizeDate(dateString) {
    const [day, month, year] = dateString.split(/[/.-]/).map(Number);

    // Créer un objet Date avec les valeurs de jour, mois et année
    const date = new Date(year, month - 1, day); // Les mois sont indexés à partir de 0 en JavaScript

    if (isNaN(date.getTime())) {
        throw new Error(dateString);
    }

    // Convertir la Date en format JJ/MM/YYYY
    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 1 ici
    const newYear = date.getFullYear();

    return `${newDay}/${newMonth}/${newYear}`;
}

(async () => {
    try {
        // Exemple d'utilisation
        const inputFilePath = 'Enregistrement.csv';
        const dateColumn = 'formattedDate'; // Nom de la colonne contenant les dates
        actualDate = '20/04/2021'; // Date recherchée
        maxDate = '22/06/2024';        
        const outputFilePath = 'out2.csv';
        let headers = [ 'Date', 'Niveau', 'Allonge', 'Assis', 'SessionID', 'formattedDate', 'serie' ];        
        let serieActuel = 0;
        let vie = 2;
        let consecutif = 0;

        let resultFinal = []
        while(actualDate != maxDate) {
            let matchingLines = await getLinesByDate(inputFilePath, dateColumn, actualDate);
            //console.log(matchingLines)
            
            if(isDayPratique(matchingLines) && isSeanceComplete(matchingLines)) {
                serieActuel++;
                consecutif++;
                if(consecutif == 5) {
                    consecutif = 0;
                    if(vie == 1) {
                        vie++;
                    }
                } 
            } else {               
                vie--;
                consecutif = 0;
                if(vie == 0) {
                    serieActuel = 0;
                    vie = 2;
                }              
            } 

            matchingLines.forEach(line =>
                    {
                        //let result = line + "," + serieActuel;
                        resultFinal.push(line)  
                    }                       
            );

            console.log(actualDate)
            actualDate = addDayToDate(actualDate);
            
        }
        writeCsvFile(outputFilePath, headers, resultFinal);
        
    } catch (error) {
        console.error(error.message);
    }
})()