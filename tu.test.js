const utils = require('./utils')

// ISDAYPRATIQUE

test('This is not a day of pratique empty lines', () => {
    matchingLines = [];
    expect(utils.isDayPratique(matchingLines)).toBe(false);
  });

test('This is not a day of pratique data are False', () => {
    matchingLines = [
        "1618937885,2,False,False,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
        "1618937885,2,False,False,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
    ];
    expect(utils.isDayPratique(matchingLines)).toBe(false);
});

test('This is a day of pratique minimum one true in data', () => {
    matchingLines = [
        "1618937885,2,False,False,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
        "1618937885,2,False,True,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
    ];
    expect(utils.isDayPratique(matchingLines)).toBe(true);
});

test('This is a day of pratique all exercice are true', () => {
    matchingLines = [
        "1618937885,2,True,True,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
        "1618937885,2,True,True,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
    ];
    expect(utils.isDayPratique(matchingLines)).toBe(true);
});

// ISSEANCECOMPLETE

test('Seance not complete because no data', () => {
    matchingLines = [];
    expect(utils.isSeanceComplete(matchingLines)).toBe(false);
});

test('Seance not complete because no excercie allonge', () => {
    matchingLines = [
        "1618937885,2,False,True,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
        "1618937885,2,False,True,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
    ];
    expect(utils.isSeanceComplete(matchingLines)).toBe(false);
});

test('Seance not complete because no excercie assis', () => {
    matchingLines = [
        "1618937885,2,True,False,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
        "1618937885,2,True,False,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
    ];
    expect(utils.isSeanceComplete(matchingLines)).toBe(false);
});

test('Seance complete with level 2 one exercice', () => {
    matchingLines = [
        "1618937885,2,True,True,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
    ];
    expect(utils.isSeanceComplete(matchingLines)).toBe(true);
});

test('Seance complete with level 1 one exercice', () => {
    matchingLines = [
        "1618937885,1,True,True,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
    ];
    expect(utils.isSeanceComplete(matchingLines)).toBe(true);
});

test('Seance complete with level 1 two exercice', () => {
    matchingLines = [
        "1618937885,1,False,True,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
        "1618937885,1,True,False,ed73e2a7-8f8a-493c-9388-c7cc4714b0ad,20/04/2021",
    ];
    expect(utils.isSeanceComplete(matchingLines)).toBe(true);
});

// ADD A DAY

test('Add a day', () => {
    date = "21/04/2021"
    expect(utils.addDayToDate(date)).toBe("22/04/2021");
});