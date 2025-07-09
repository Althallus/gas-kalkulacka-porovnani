# Nastavení v Google Apps Script

## Vytvoření souborů:

1. **#Base.gs** - zkopíruj obsah z `src/server/main.gs`
2. **Utilities-JS.html** - zkopíruj obsah z `src/server/utilities.gs` a obal do `<script>` tagů
3. **@Porovnani_produktu-HTML.html** - zkopíruj z `src/client/html/index.html`
4. **@Porovnani_produktu-CSS.html** - zkopíruj z `src/client/css/styles.css` a obal do `<style>` tagů
5. **@Porovnani_produktu-JS.html** - zkopíruj z `src/client/js/app.js` a obal do `<script>` tagů

## Include mapování:
- `include('Utilities-JS')` → `src/server/utilities.gs`
- `include('Porovnani_produktu-CSS')` → `src/client/css/styles.css`
- `include('Porovnani_produktu-JS')` → `src/client/js/app.js`
