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

module.exports = {
    isDayPratique,
    isSeanceComplete,
    addDayToDate
}