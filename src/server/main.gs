/**
 * Hlavní server-side logika
 * Původní soubor: #Base.gs
 */

//FUNKCE NAČTENÍ HLAVNÍ STRÁNKY
function doGet(e) {
  var tmp = HtmlService.createTemplateFromFile('@Porovnani_produktu_2-HTML');
  
  return tmp
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('F!Dos Počítadlo')
    .setFaviconUrl('https://i.imgur.com/Nbchlci.png');
}

// Include JavaScript and CSS Files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
