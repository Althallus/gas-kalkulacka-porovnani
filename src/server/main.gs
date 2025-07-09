/**
 * F!Dos Počítadlo - Hlavní server-side logika
 * Modernizovaná verze pro Google Apps Script
 */

// Hlavní funkce pro načtení aplikace
function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');
  
  return template
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('F!Dos Počítadlo - Porovnání produktů')
    .setFaviconUrl('https://i.imgur.com/Nbchlci.png');
}

// Include funkce pro vkládání CSS a JS souborů
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Pomocné funkce pro případné server-side operace

/**
 * Uložení nastavení uživatele (volitelné)
 * @param {Object} settings - Nastavení kalkulačky
 * @return {Object} - Status operace
 */
function saveUserSettings(settings) {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = getOrCreateSettingsSheet();
    
    // Najdi nebo vytvoř řádek pro uživatele
    const data = sheet.getDataRange().getValues();
    let userRow = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userEmail) {
        userRow = i + 1;
        break;
      }
    }
    
    // Pokud uživatel neexistuje, přidej nový řádek
    if (userRow === -1) {
      userRow = sheet.getLastRow() + 1;
      sheet.getRange(userRow, 1).setValue(userEmail);
    }
    
    // Ulož nastavení jako JSON
    sheet.getRange(userRow, 2).setValue(JSON.stringify(settings));
    sheet.getRange(userRow, 3).setValue(new Date());
    
    return { success: true, message: 'Nastavení uloženo' };
  } catch (error) {
    console.error('Chyba při ukládání nastavení:', error);
    return { success: false, message: 'Chyba při ukládání: ' + error.toString() };
  }
}

/**
 * Načtení nastavení uživatele (volitelné)
 * @return {Object} - Uživatelská nastavení nebo výchozí hodnoty
 */
function loadUserSettings() {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = getOrCreateSettingsSheet();
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userEmail && data[i][1]) {
        return JSON.parse(data[i][1]);
      }
    }
    
    // Vrať výchozí nastavení
    return getDefaultSettings();
  } catch (error) {
    console.error('Chyba při načítání nastavení:', error);
    return getDefaultSettings();
  }
}

/**
 * Vytvoří nebo získá sheet pro ukládání nastavení
 * @return {Sheet} - Google Sheets objekt
 */
function getOrCreateSettingsSheet() {
  const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Nahraď svým ID
  let spreadsheet;
  
  try {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } catch (error) {
    // Pokud sheet neexistuje, vytvoř nový
    spreadsheet = SpreadsheetApp.create('FiDos Počítadlo - Uživatelská nastavení');
    console.log('Vytvořen nový spreadsheet:', spreadsheet.getId());
  }
  
  let sheet = spreadsheet.getSheetByName('UserSettings');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('UserSettings');
    // Vytvoř hlavičky
    sheet.getRange(1, 1, 1, 3).setValues([['Email', 'Settings', 'LastUpdated']]);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
  
  return sheet;
}

/**
 * Výchozí nastavení kalkulačky
 * @return {Object} - Defaultní hodnoty
 */
function getDefaultSettings() {
  return {
    sporakUrok: 1,
    stavebkoUrok: 1.5,
    penzijkoUrok: 2,
    investiceUrok: 4,
    dan: 15,
    inflace: 3,
    sporakPoplatky: 35,
    stavebkoPoplatky: 360,
    penzijkoNakladovost: 2,
    investiceVstupak: 3,
    investiceMF: 1.75
  };
}

/**
 * Export výsledků do Google Sheets (volitelné)
 * @param {Object} results - Výsledky kalkulace
 * @param {Object} inputs - Vstupní parametry
 * @return {Object} - Status a URL exportu
 */
function exportToSheets(results, inputs) {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const timestamp = new Date();
    
    // Vytvoř nový spreadsheet pro export
    const spreadsheet = SpreadsheetApp.create(`FiDos Export ${timestamp.toLocaleDateString('cs-CZ')}`);
    const sheet = spreadsheet.getActiveSheet();
    sheet.setName('Výsledky porovnání');
    
    // Nastav hlavičky
    const headers = [
      'Datum', 'Uživatel', 'Jednorázový vklad', 'Měsíční vklad', 'Doba (roky)',
      'Produkt', 'Nominální celkem', 'Nominální výkonnost', 
      'Reálně celkem', 'Reálný výnos', 'Poznámky'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
    // Přidej data pro každý produkt
    let row = 2;
    ['sporak', 'investice', 'stavebko', 'penzijko'].forEach(product => {
      if (results[product]) {
        const productNames = {
          sporak: 'Spořící účet',
          investice: 'Investice', 
          stavebko: 'Stavební spoření',
          penzijko: 'Penzijní spoření'
        };
        
        sheet.getRange(row, 1, 1, 11).setValues([[
          timestamp,
          userEmail,
          inputs.jednoraz,
          inputs.pravidelka,
          inputs.doba,
          productNames[product],
          results[product].nominal?.celkem || '-',
          results[product].nominal?.vykonnost || '-',
          results[product].real?.celkem || '-',
          results[product].real?.vynos || '-',
          `Úrok: ${results[product].nominal?.urok || '-'}`
        ]]);
        row++;
      }
    });
    
    // Naformátuj tabulku
    sheet.autoResizeColumns(1, headers.length);
    
    return {
      success: true,
      url: spreadsheet.getUrl(),
      message: 'Export dokončen'
    };
    
  } catch (error) {
    console.error('Chyba při exportu:', error);
    return {
      success: false,
      message: 'Chyba při exportu: ' + error.toString()
    };
  }
}

/**
 * Získání aktuálních úrokových sazeb z externích zdrojů (volitelné)
 * @return {Object} - Aktuální sazby
 */
function getCurrentRates() {
  try {
    // Zde můžeš implementovat API volání na ČNB nebo jiné zdroje
    // Pro demonstraci vrátíme mock data
    
    const cnbUrl = 'https://www.cnb.cz/cs/financni-trhy/penezni-trh/Repo_sazby/';
    
    // Základní implementace - můžeš rozšířit o skutečné API volání
    return {
      cnbSazba: 2.75, // Mock hodnota
      inflace: 3.2,   // Mock hodnota
      timestamp: new Date(),
      source: 'ČNB'
    };
    
  } catch (error) {
    console.error('Chyba při získávání aktuálních sazeb:', error);
    return null;
  }
}

/**
 * Logování použití aplikace (volitelné)
 * @param {string} action - Akce uživatele
 * @param {Object} data - Data k zalogování
 */
function logUsage(action, data = {}) {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const timestamp = new Date();
    
    console.log(`[${timestamp.toISOString()}] ${userEmail}: ${action}`, data);
    
    // Zde můžeš implementovat ukládání do Google Sheets nebo jiného úložiště
    
  } catch (error) {
    console.error('Chyba při logování:', error);
  }
}

/**
 * Test funkce pro ověření funkčnosti
 */
function testCalculator() {
  const testInputs = {
    jednoraz: 50000,
    pravidelka: 2000,
    doba: 10
  };
  
  console.log('Test kalkulačky s následujícími vstupy:', testInputs);
  
  // Test uložení a načtení nastavení
  const settings = getDefaultSettings();
  const saveResult = saveUserSettings(settings);
  const loadedSettings = loadUserSettings();
  
  console.log('Test nastavení - uložení:', saveResult);
  console.log('Test nastavení - načtení:', loadedSettings);
  
  return {
    testInputs,
    saveResult,
    loadedSettings,
    message: 'Test dokončen'
  };
}
