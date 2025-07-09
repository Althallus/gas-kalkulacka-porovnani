// PREVENCE PRESMEROOVANI
function preventFormSubmit() {
var forms = document.querySelectorAll('form');
for (var i = 0; i < forms.length; i++) {
forms[i].addEventListener('submit', function(event) {
event.preventDefault();
});
}
}
 //PREVENCE ZMENY STRANKY
window.addEventListener('load', preventFormSubmit);    


// var instance = M.FloatingActionButton.getInstance(elem);
  //DROPDOWNS & SELECTIVES
  document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
  });
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.fixed-action-btn');
      var instances = M.FloatingActionButton.init(elems, {
        direction: 'left'
      });
    });
  document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems, options);
  });
  
 //COLLAPSIBLES
    // document.addEventListener('DOMContentLoaded', function() {
    //   var elems = document.querySelectorAll('.fixed-action-btn');
    //   var instances = M.FloatingActionButton.init(elems, options);
    // });
   document.addEventListener('DOMContentLoaded', function() {
   var elems = document.querySelectorAll('.collapsible');
   var instances = M.Collapsible.init(elems, options);
   });
   var elem = document.querySelector('.collapsible.popout');
   var instance = M.Collapsible.init(elem, {
   accordion: false
   });
   document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
  });
    document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, options);
  });
 
 window.addEventListener('load', preventFormSubmit);   



//----------------------- SPINACE 

document.getElementById("check_zobrazeni_1").addEventListener("click",switchView_Produkty);
document.getElementById("check_zobrazeni_3").addEventListener("click",switchView_Hodnoty);

document.getElementById("btn_count").addEventListener("click",calculate_all);


//############################################

//---------------------- ZOBRAZENI KARET  
function switchView_Produkty() {
  var check_sporak = document.getElementById("check_sporak");
  var check_stavebko = document.getElementById("check_stavebko");
  var check_penzijko = document.getElementById("check_penzijko");
  var check_investice = document.getElementById("check_investice");

  var sporak = document.getElementById("sporak");
  var stavebko = document.getElementById("stavebko");
  var penzijko = document.getElementById("penzijko");
  var investice = document.getElementById("investice");
  
  if (check_sporak.checked) {
    sporak.style.display = "block";
  } else {
    sporak.style.display = "none";
  }

  if (check_stavebko.checked) {
    stavebko.style.display = "block";
  } else {
    stavebko.style.display = "none";
  }

  if (check_penzijko.checked) {
    penzijko.style.display = "block";
  } else {
    penzijko.style.display = "none";
  }

  if (check_investice.checked) {
    investice.style.display = "block";
  } else {
    investice.style.display = "none";
  }
}
//##################################
//---------------------- ZOBRAZENI KARET  
function switchView_Hodnoty() {
  var check_nominal = document.getElementById("check_nominal");
  var check_real = document.getElementById("check_real");
  var check_plusy = document.getElementById("check_plusy");
  // var check_investice = document.getElementById("check_investice");

  var nominal = document.getElementById("nominal");
  var nominal_2 = document.getElementById("nominal_2");
  var nominal_3 = document.getElementById("nominal_3");
  var nominal_4 = document.getElementById("nominal_4");
  var real = document.getElementById("real");
  var real_2 = document.getElementById("real_2");
  var real_3 = document.getElementById("real_3");
  var real_4 = document.getElementById("real_4");
  var plusy = document.getElementById("plusy");
  var plusy_2 = document.getElementById("plusy_2");
  var plusy_3 = document.getElementById("plusy_3");
  var plusy_4 = document.getElementById("plusy_4");
  // var penzijko = document.getElementById("penzijko");
  // var investice = document.getElementById("investice");
  
  if (check_nominal.checked) {
    nominal.style.display = "block";
    nominal_2.style.display = "block";
    nominal_3.style.display = "block";
    nominal_4.style.display = "block";
  } else {
    nominal.style.display = "none";
    nominal_2.style.display = "none";
    nominal_3.style.display = "none";
    nominal_4.style.display = "none";
  }

  if (check_real.checked) {
    real.style.display = "block";
    real_2.style.display = "block";
    real_3.style.display = "block";
    real_4.style.display = "block";
  } else {
    real.style.display = "none";
    real_2.style.display = "none";
    real_3.style.display = "none";
    real_4.style.display = "none";
  }

  if (check_plusy.checked) {
    plusy.style.display = "block";
    plusy_2.style.display = "block";
    plusy_3.style.display = "block";
    plusy_4.style.display = "block";
  } else {
    plusy.style.display = "none";
    plusy_2.style.display = "none";
    plusy_3.style.display = "none";
    plusy_4.style.display = "none";
  }

  // if (check_penzijko.checked) {
  //   penzijko.style.display = "block";
  // } else {
  //   penzijko.style.display = "none";
  // }

  // if (check_investice.checked) {
  //   investice.style.display = "block";
  // } else {
  //   investice.style.display = "none";
  // }
}
//##################################

//---------------------VYPOCET
function calculate_all(){

  //ZAKLADNI VTUP
  var jednoraz = document.getElementById("jednoraz").value;
  var pravidelka = document.getElementById("pravidelka").value;
  var doba = document.getElementById("doba").value;
  // var celkem = document.getElementById("celkem").value;


  // VARIABLES NASTAVENI KALKULACE
  var set_sporak_urok = document.getElementById("set_sporak_urok").value;
  var set_stavebko_urok = document.getElementById("set_stavebko_urok").value;
  var set_penzijko_urok = document.getElementById("set_penzijko_urok").value;
  var set_investice_urok = document.getElementById("set_investice_urok").value;
  var set_dan = document.getElementById("set_dan").value;
  var set_inflace = document.getElementById("set_inflace").value;
  
  var set_sporak_poplatky = document.getElementById("set_sporak_poplatky").value;
  var set_stavebko_poplatky = document.getElementById("set_stavebko_poplatky").value;
  var set_penzijko_nakladovost = document.getElementById("set_penzijko_nakladovost").value;
  var set_investice_vstupak = document.getElementById("set_investice_vstupak").value/100;
  var set_investice_mf = document.getElementById("set_investice_mf").value;

  //PREVODY DAT
  var efektivni_sporak_urok = set_sporak_urok/100/12;
  var efektivni_stavebko_urok = set_stavebko_urok/100;
  var efektivni_stavebko_inflace = set_inflace/100;
  var efektivni_penzijko_urok = set_penzijko_urok/100/12;
  var efektivni_investice_urok = set_investice_urok/100/12;
  var efektivni_dan = set_dan/100;
  var efektivni_inflace = set_inflace/100/12;
 //POCET OBDOBI
  var all_n = Number(doba)*12; //POCET OBDOBI PRO VSECHNO
  var stavebko_n = Number(doba); //POCET OBDOBI PRO VSECHNO
  //INFLACE
  var inf_r = 1+Number(efektivni_inflace); //Efektivní inflace
  var inf_stavebko_r = 1+Number(efektivni_stavebko_inflace); //Efektivní inflace
  //VLOZENO
  var zaplaceno_celkem = Number(jednoraz)+Number(pravidelka)*all_n;
  // var zaplaceno_pravidelka = pravidelka*all_n;


    // SPORAK ####################################################xx
    // VARIABLES SPORAK
    var sporak_urok = document.getElementById("sporak_urok");
    var sporak_celkem = document.getElementById("sporak_celkem");
    var sporak_vykonnost = document.getElementById("sporak_vykonnost");

    var sporak_r_urok = document.getElementById("sporak_r_urok");
    var sporak_r_celkem = document.getElementById("sporak_r_celkem");
    var sporak_r_vynos = document.getElementById("sporak_r_vynos");

    var sporak_poplatky = document.getElementById("sporak_poplatky");
    var sporak_urok_po_dani = document.getElementById("sporak_urok_po_dani");

    
    //-----------------SPORAK KALKULACE 
    //POMOCNE VARIABLES
    var sporak_r = 1+Number(efektivni_sporak_urok); //UROCITEL
    var sporak_real_r = Number(sporak_r/inf_r); //REALNY UROCITEL

    //NOMINAL
    var sporak_r_n = Math.pow(sporak_r,all_n); 
    var sporak_r1= Number(sporak_r_n)-1;
    var sporak_r2= Number(sporak_r)-1;
    var sporak_r2_r1 = (sporak_r1/sporak_r2);

    //REAL
    var sporak_real_r_n = Math.pow(sporak_real_r,all_n); 
    var sporak_real_r1= Number(sporak_real_r_n)-1;
    var sporak_real_r2= Number(sporak_real_r)-1;
    var sporak_real_r2_r1 = (sporak_real_r1/sporak_real_r2);

    //VYSLEDKY SPORAK
    //----------------NOMINAL
    //CELKEM NA KONCI
    sporak_urok.innerHTML = set_sporak_urok + ' % p.a.';
    var sporak_result = Number(jednoraz)*sporak_r_n + Number(pravidelka) * sporak_r2_r1;
    var formated_sporak_result = Number(sporak_result.toFixed(0)).toLocaleString("cs-CZ");
    sporak_celkem.innerHTML = formated_sporak_result + ' Kč';
    //NOMINALNI VYKONNOST
    var sporak_vynos_result = (100/zaplaceno_celkem*sporak_result-100);
    formated_sporak_vynos_result = Number(sporak_vynos_result).toFixed(2);
    sporak_vykonnost.innerHTML = formated_sporak_vynos_result + ' %';

    //---------------REALNE
    //REALNY UROK
    var formated_sporak_real_r = Number((sporak_real_r-1)*100*12).toFixed(2);
    sporak_r_urok.innerHTML = formated_sporak_real_r + ' % p.a.';
    //REALNE CELKEM NA KONCI
    var sporak_real_result = Number(jednoraz)*sporak_real_r_n + Number(pravidelka) * sporak_real_r2_r1;
    var formated_real_sporak_result = Number(sporak_real_result.toFixed(0)).toLocaleString("cs-CZ");
    sporak_r_celkem.innerHTML = formated_real_sporak_result + ' Kč';
    //REALNA VYKONNOST
    var sporak_real_vynos_result = (100/zaplaceno_celkem*sporak_real_result-100);
    formated_sporak_real_vynos_result = Number(sporak_real_vynos_result).toFixed(2);
    sporak_r_vynos.innerHTML = formated_sporak_real_vynos_result + ' %';
    //POPLATKY & DAN
    sporak_poplatky.innerHTML = Number((set_sporak_poplatky*all_n).toFixed(0)).toLocaleString("cs-CZ") + ' Kč';
    sporak_urok_po_dani.innerHTML = Number((set_sporak_urok*(1-efektivni_dan)).toFixed(2))+ ' %';
    // ################################################################################










// INVESTICE #####################################################
// VARIABLES INVESTICE
var investice_urok = document.getElementById("investice_urok");
var investice_celkem = document.getElementById("investice_celkem");
var investice_vykonnost = document.getElementById("investice_vykonnost");

var investice_r_urok = document.getElementById("investice_r_urok");
var investice_r_celkem = document.getElementById("investice_r_celkem");
var investice_r_vynos = document.getElementById("investice_r_vynos");

var investice_vstupak = document.getElementById("investice_vstupak");
var investice_dan = document.getElementById("investice_dan");


//INVESTICE KALKULACE 
//----------POMOCNE VARIABLES
var investice_r = 1+Number(efektivni_investice_urok); //UROCITEL
var investice_real_r = Number(investice_r/inf_r); //REALNY UROCITEL
//NOMINAL
var investice_r_n = Math.pow(investice_r,all_n); 
var investice_r1= Number(investice_r_n)-1;
var investice_r2= Number(investice_r)-1;
var investice_r2_r1 = (investice_r1/investice_r2);
//REAL
var investice_real_r_n = Math.pow(investice_real_r,all_n); 
var investice_real_r1= Number(investice_real_r_n)-1;
var investice_real_r2= Number(investice_real_r)-1;
var investice_real_r2_r1 = (investice_real_r1/investice_real_r2);

//VYSLEDKY INVESTICE
//NOMINAL
//CELKEM NA KONCI
investice_urok.innerHTML = set_investice_urok + ' % p.a.';
var investice_result = Number(jednoraz)*investice_r_n + Number(pravidelka) * investice_r2_r1;
var formated_investice_result = Number(investice_result.toFixed(0)).toLocaleString("cs-CZ");
investice_celkem.innerHTML = formated_investice_result + ' Kč';
//NOMINALNI VYKONNOST
var investice_vynos_result = (100/zaplaceno_celkem*investice_result-100);
var formated_investice_vynos_result = Number(investice_vynos_result).toFixed(2);
investice_vykonnost.innerHTML = formated_investice_vynos_result + ' %';
//REAL
//REALNY UROK
var formated_investice_real_r = Number((investice_real_r-1)*100*12).toFixed(2);
investice_r_urok.innerHTML = formated_investice_real_r + ' % p.a.';
//CELKEM NA KONCI
var investice_real_result = Number(jednoraz)*investice_real_r_n + Number(pravidelka) * investice_real_r2_r1-zaplaceno_celkem*set_investice_vstupak;
var formated_investice_real_result = Number(investice_real_result.toFixed(0)).toLocaleString("cs-CZ");
investice_r_celkem.innerHTML = formated_investice_real_result + ' Kč';
//REALNA VYKONNOST
investice_real_vynos_result = (100/zaplaceno_celkem*investice_real_result-100);
formated_investice_real_vynos_result = Number(investice_real_vynos_result).toFixed(2);
investice_r_vynos.innerHTML = formated_investice_real_vynos_result + ' %';
//VSTUPAK A DAN
investice_vstupak.innerHTML = Number((zaplaceno_celkem*set_investice_vstupak).toFixed(0)).toLocaleString("cs-CZ") + ' Kč';
investice_dan.innerHTML = Number(((investice_result-zaplaceno_celkem)*efektivni_dan).toFixed(0)).toLocaleString("cs-CZ") +' Kč';
// ################################################################################












    // STAVEBKO #####################################################
    // VARIABLES STAVEBKO
    var stavebko_urok = document.getElementById("stavebko_urok");
    var stavebko_celkem = document.getElementById("stavebko_celkem");
    var stavebko_vykonnost = document.getElementById("stavebko_vykonnost");
    var stavebko_prispevek = document.getElementById("stavebko_prispevek");
    var stavebko_prispevek_celkem = document.getElementById("stavebko_prispevek_celkem");

    var stavebko_r_urok = document.getElementById("stavebko_r_urok");
    var stavebko_r_celkem = document.getElementById("stavebko_r_celkem");
    var stavebko_r_vynos = document.getElementById("stavebko_r_vynos");
    var stavebko_vstupak = document.getElementById("stavebko_vstupak");
    var stavebko_poplatky = document.getElementById("stavebko_poplatky");

    //STAVEBKO KALKULACE 
    //POMOCNE VARIABLES
    var stavebko_r = 1+Number(efektivni_stavebko_urok); //UROCITEL
    var stavebko_real_r = Number(stavebko_r/inf_stavebko_r); //REALNY UROCITEL
    //NOMINAL
    var stavebko_r_n = Math.pow(stavebko_r,doba); 
    var stavebko_r1= Number(stavebko_r_n)-1;
    var stavebko_r2= Number(stavebko_r)-1;
    var stavebko_r2_r1 = (stavebko_r1/stavebko_r2);
    //REAL
    var stavebko_real_r_n = Math.pow(stavebko_real_r,doba); 
    var stavebko_real_r1= Number(stavebko_real_r_n)-1;
    var stavebko_real_r2= Number(stavebko_real_r)-1;
    var stavebko_real_r2_r1 = (stavebko_real_r1/stavebko_real_r2);

    //STATNI PRISPEVKY
    //1 ROK
    if((pravidelka*12*0.1+jednoraz*0.1)>2000){
      var stavebko_prispevek_1_rok = 2000;
    } else {
      var stavebko_prispevek_1_rok = jednoraz*0.1;
    }
    //OSTATNI PRISPEVKY
    if(pravidelka*12*0.1>2000){
      var stavebko_prispevek_rocni = 2000;
    } else {
      var stavebko_prispevek_rocni = pravidelka*12*0.1;
    }

    //POMOCNE VYPOCTY

    var mx = pravidelka*12;
    var stradatel = 1+(11/24)*efektivni_stavebko_urok;
    var stavebko_vklady_pravidelne_vynos = mx*stradatel*stavebko_r2_r1;
    var stavebko_vklady_real_pravidelne_vynos = mx*stradatel*stavebko_real_r2_r1;


    //VYSLEDKY STAVEBKO

    stavebko_urok.innerHTML = set_stavebko_urok + ' % p.a.';
    //----------NOMINAL
    //CELKEM NA KONCI
    var stavebko_vklady_vynos = Number(jednoraz)*stavebko_r_n + stavebko_vklady_pravidelne_vynos; //VKLADY S VYNOSEM
    var stavebko_prispevky_vynos = Number(stavebko_prispevek_1_rok)*stavebko_r_n + Number(stavebko_prispevek_rocni) * stavebko_r2_r1; //PRISPEVKY S VYNOSEM
    var stavebko_result = stavebko_prispevky_vynos+stavebko_vklady_vynos; //CELKEM
    var formated_stavebko_result = Number(stavebko_result.toFixed(0)).toLocaleString("cs-CZ");
    stavebko_celkem.innerHTML = formated_stavebko_result + ' Kč';
    // PRISPEVKY
    stavebko_prispevek.innerHTML = Number(stavebko_prispevek_rocni.toFixed(0)).toLocaleString("cs-CZ") + ' Kč';
    stavebko_prispevek_celkem.innerHTML = Number((stavebko_prispevek_rocni*(doba-1)+stavebko_prispevek_1_rok).toFixed(0)).toLocaleString("cs-CZ") + ' Kč';
    //VYKONNOST
    var stavebko_vynos_result = (100/zaplaceno_celkem*stavebko_result-100);
    stavebko_vykonnost.innerHTML = Number(stavebko_vynos_result.toFixed(0)) + ' %';
    
    //---------REAL
    //REALNY UROK
    var formated_stavebko_real_r = Number((stavebko_real_r-1)*100).toFixed(2);
    stavebko_r_urok.innerHTML = formated_stavebko_real_r + ' % p.a.';
    //CELKEM ZA VKLADY
    var stavebko_real_vklady_vynos = Number(jednoraz)*stavebko_real_r_n + stavebko_vklady_real_pravidelne_vynos; //VKLADY S VYNOSEM
    var stavebko_real_prispevky_vynos = Number(stavebko_prispevek_1_rok)*stavebko_real_r_n + Number(stavebko_prispevek_rocni) * stavebko_real_r2_r1; //PRISPEVKY S VYNOSEM
    var stavebko_real_result = stavebko_real_prispevky_vynos+stavebko_real_vklady_vynos-zaplaceno_celkem*0.01-set_stavebko_poplatky*doba; //CELKEM
    var formated_stavebko_real_result = Number(stavebko_real_result.toFixed(0)).toLocaleString("cs-CZ");
    stavebko_r_celkem.innerHTML = formated_stavebko_real_result + ' Kč';
    //REALNA VYKONNOST
    stavebko_r_vynos_result = (100/zaplaceno_celkem*stavebko_real_result-100);
    formated_stavebko_r_vynos_result = Number(stavebko_r_vynos_result).toFixed(2);
    stavebko_r_vynos.innerHTML = formated_stavebko_r_vynos_result + ' %';





    // var stavebko_result = stavebko_prispevky_vynos+stavebko_vklady_vynos-zaplaceno_celkem*0.01-set_stavebko_poplatky*doba; //CELKEM



    stavebko_vstupak.innerHTML = Number((zaplaceno_celkem*0.01).toFixed(0)).toLocaleString("cs-CZ") + ' Kč';
    stavebko_poplatky.innerHTML = Number((set_stavebko_poplatky*doba).toFixed(0)).toLocaleString("cs-CZ") + ' Kč';

    //###########################################################################xx

var test = "Ahoj";
    
    // PENZIJKO #####################################################
    // VARIABLES PENZIJKO
    var penzijko_urok = document.getElementById("penzijko_urok");
    var penzijko_celkem = document.getElementById("penzijko_celkem");
    var penzijko_vykonnost = document.getElementById("penzijko_vykonnost");
    var penzijko_prispevek_platba = document.getElementById("penzijko_prispevek_platba");
    var penzijko_prispevek_celkem = document.getElementById("penzijko_prispevek_celkem");

    var penzijko_r_urok = document.getElementById("penzijko_r_urok");
    var penzijko_r_celkem = document.getElementById("penzijko_r_celkem");
    var penzijko_r_vynos = document.getElementById("penzijko_r_vynos");
    var penzijko_vynos_klienta = document.getElementById("penzijko_vynos_klienta");

    // var stavebko_vstupak = document.getElementById("stavebko_vstupak");

    
    if((pravidelka > 0) && (pravidelka < 300)){
      var penzijko_prispevek = 0;
    } else if ((pravidelka => 300) && (pravidelka < 400)){
      var penzijko_prispevek = 90;
    } else if ((pravidelka => 400) && (pravidelka < 500)){
      var penzijko_prispevek = 110;
    } else if ((pravidelka => 500) && (pravidelka < 600)){
      var penzijko_prispevek = 130;
    } else if ((pravidelka => 600) && (pravidelka < 700)){
      var penzijko_prispevek = 150;
    } else if ((pravidelka => 700) && (pravidelka < 800)){
      var penzijko_prispevek = 170;
    } else if ((pravidelka => 800) && (pravidelka < 900)){
      var penzijko_prispevek = 190;
    } else if ((pravidelka => 900) && (pravidelka < 1000)){
      var penzijko_prispevek = 210;
    } else if (pravidelka => 1000){
      var penzijko_prispevek = 230;
    }


    //STAVEBKO KALKULACE 
    //POMOCNE VARIABLES
      var penzijko_r = 1+Number(efektivni_penzijko_urok); //UROCITEL
      var penzijko_real_r = Number(penzijko_r/inf_r); //REALNY UROCITEL
      //NOMINAL
      var penzijko_r_n = Math.pow(penzijko_r,all_n); //REALNY
      var penzijko_r1= Number(penzijko_r_n)-1;
      var penzijko_r2= Number(penzijko_r)-1;
      var penzijko_r2_r1 = (penzijko_r1/penzijko_r2);
      //REAL
      var penzijko_real_r_n = Math.pow(penzijko_real_r,all_n); //REALNY
      var penzijko_real_r1= Number(penzijko_real_r_n)-1;
      var penzijko_real_r2= Number(penzijko_real_r)-1;
      var penzijko_real_r2_r1 = (penzijko_real_r1/penzijko_real_r2);

    //VYSLEDKY PENZIJKO
      penzijko_urok.innerHTML = set_penzijko_urok + ' % p.a.';
    //CELKEM NOMINAL
      var penzijko_vklady_vynos = Number(jednoraz)*penzijko_r_n + Number(pravidelka) * penzijko_r2_r1; //VKLADY S VYNOSEM
      var penzijko_prispevky_vynos = Number(penzijko_prispevek) * penzijko_r2_r1; //PRISPEVKY S VYNOSEM POUZE PRAVIDELKA
      var penzijko_result = penzijko_vklady_vynos+penzijko_prispevky_vynos; //CELKEM
      var formated_penzijko_result = Number(penzijko_result.toFixed(0)).toLocaleString("cs-CZ"); 
      penzijko_celkem.innerHTML = formated_penzijko_result + ' Kč';
      var penzijko_vykonnost_result = (100/zaplaceno_celkem*penzijko_result-100); //CELKEM
      var formated_penzijko_vykonnost = Number(penzijko_vykonnost_result).toFixed(2);
      penzijko_vykonnost.innerHTML = formated_penzijko_vykonnost + ' %';
      penzijko_prispevek_platba.innerHTML = penzijko_prispevek + ' Kč';
      penzijko_prispevek_celkem.innerHTML = Number((penzijko_prispevek*all_n).toFixed(0)).toLocaleString("cs-CZ") + ' Kč';
      
    //CELKEM REAL
      var penzijko_real_vklady_vynos = Number(jednoraz)*penzijko_real_r_n + Number(pravidelka) * penzijko_real_r2_r1; //VKLADY S VYNOSEM
      var penzijko_real_prispevky_vynos = Number(penzijko_prispevek) * penzijko_real_r2_r1; //PRISPEVKY S VYNOSEM POUZE PRAVIDELKA
      var penzijko_real_result = penzijko_real_vklady_vynos + penzijko_real_prispevky_vynos; //CELKEM
      var formated_penzijko_real_result = Number(penzijko_real_result.toFixed(0)).toLocaleString("cs-CZ"); 
      penzijko_r_celkem.innerHTML = formated_penzijko_real_result + ' Kč';
    
    //REALNA VYKONNOST
      var penzijko_r_vynos_result = (100/zaplaceno_celkem*penzijko_real_result-100);
      formated_penzijko_r_vynos_result = Number(penzijko_r_vynos_result).toFixed(2);
      penzijko_r_vynos.innerHTML = formated_penzijko_r_vynos_result + ' %';

    //REALNY UROK
      var formated_penzijko_real_r = Number((penzijko_real_r-1)*100*12).toFixed(2);
      penzijko_r_urok.innerHTML = formated_penzijko_real_r + ' % p.a.';

    //CELKEM ZA VKLADY

      // penzijko_vynos_klienta = zaplaceno_celkem;
      penzijko_vynos_klienta.innerHTML = Number((penzijko_real_vklady_vynos-zaplaceno_celkem).toFixed(0)).toLocaleString("cs-CZ") + ' Kč';
      // penzijko_prispevek_platba.innerHTML = penzijko_prispevek +' Kč';
      // penzijko_prispevek_celkem.innerHTML = penzijko_prispevek*all_n;



    



    // M.updateTextFields();

}
