/*
  Assistente vocale telefonico condominio - Twilio Function
  Stessi dati deterministici del sito (seme 20260912):
  ogni chiamata rigenera il dataset identico a quello visibile nell'app.
*/

const PALAZZINE_NOMI = [
  'Viale Roma','Via Garibaldi','Via Mazzini','Piazza Dante','Corso Vittorio',
  'Via Carducci','Via Manzoni','Via Leopardi','Via Foscolo','Via Pascoli'
];
const CATEGORIE = ['Luce comune','Gas','Acqua','Ascensore','Portierato','Pulizia','Manutenzione','Assicurazione','Amministrazione','Altro'];
const NOMI = ['Marco','Giulia','Luca','Sara','Andrea','Martina','Giuseppe','Anna','Matteo','Francesca','Alessandro','Elena','Davide','Chiara','Simone','Laura','Federico','Giulia','Paolo','Alessia','Riccardo','Giovanna','Stefano','Ilaria','Michele','Lucia','Antonio','Valentina','Roberto','Silvia','Carlo','Marta','Nicola','Beatrice','Filippo','Emma','Gabriele','Giorgia'];
const COGNOMI = ['Rossi','Bianchi','Romano','Colombo','Ferrari','Esposito','Ricci','Marino','Greco','Bruno','Gallo','Conti','De Luca','Mancini','Costa','Giordano','Rizzo','Lombardi','Moretti','Barbieri','Fontana','Santoro','Mariani','Rinaldi','Caruso','Fabbri','Pellegrini'];

const REGOLAMENTO = [
  { n: 1, tit: 'Costituzione del Condominio', k: ['costituz'], s: 'Il regolamento disciplina i diritti e gli obblighi dei proprietari, l\'uso delle cose comuni, i limiti alle proprietà esclusive, la ripartizione delle spese e la tutela del decoro. E\' obbligatorio per tutti i proprietari, gli eredi e gli inquilini.' },
  { n: 2, tit: 'Composizione del Condominio', k: ['composit'], s: 'Il condominio è costituito da tutti i proprietari di immobili nell\'edificio e dalle parti di uso comune esistenti nel fabbricato.' },
  { n: 3, tit: 'Descrizione del fabbricato', k: ['fabbricat','piani'], s: 'Il fabbricato comprende il piano interrato con garages e cantine, il piano terra con porticato, sala riunioni e atrio, sei piani di appartamenti e la copertura con terrazza, lavanderia e stenditoio comuni.' },
  { n: 4, tit: 'Cose comuni e indivisibili', k: ['cose comuni','indivisib','tetto','androni','muri maestri','colonne'], s: 'Sono comuni e indivisibili: l\'area su cui sorge l\'edificio, le fondazioni, i muri maestri, il tetto, gli impianti di riscaldamento, fognature e le colonne di acqua, luce e gas fino alla diramazione, gli androni, i portici, i viali, le scale e gli ascensori.' },
  { n: 5, tit: 'Cose comuni divisibili', k: ['lastric'], s: 'I lastrici solari e le terrazze non destinate ai servizi comuni sono comuni ma divisibili solo tra i condomini dei piani compresi nel fabbricato.' },
  { n: 6, tit: 'Quote di comproprietà', k: ['millesimi','quote di comproprietà'], s: 'Le quote di comproprietà sono espresse in millesimi nelle tabelle allegate. Non è consentito abbandonare o rinunciare alla comproprietà per sottrarsi alle spese.' },
  { n: 7, tit: 'Norme generali', k: ['buon vicinato','tolleranz'], s: 'Il condomino non deve danneggiare le parti comuni né impedirne l\'uso agli altri, deve rispettare la pulizia dei locali comuni e osservare le norme di buon vicinato.' },
  { n: 8, tit: 'Uso degli impianti e locali comuni', k: ['lavatoi','stender','bambini','cabina','cantine','autorimesse','gpl','uso dell ascensore'], s: 'Lavatoi e terrazze si usano secondo i turni e vanno lasciati puliti. Ai bambini è vietato l\'uso dell\'ascensore; in cabina non si introducono animali pericolosi, bagagli o merci pesanti. Nei garages e nelle cantine va chiuso l\'accesso, spenta la luce, e non si lavano le auto né si sosta con veicoli a GPL.' },
  { n: 9, tit: 'Modificazioni delle cose comuni', k: ['innovazion'], s: 'Non si possono variare o innovare le parti comuni senza il consenso della maggioranza dei due terzi dei condomini interessati.' },
  { n: 10, tit: 'Obblighi', k: ['obblighi','sopraelevaz','controlli','vendita','locazioni','domicilio'], s: 'Il condomino deve permettere controlli e lavori sulle parti comuni, comunicare all\'amministratore opere, vendite, locazioni e il proprio domicilio. La sopraelevazione richiede le autorizzazioni comunali e il benestare dell\'assemblea.' },
  { n: 11, tit: 'Divieti', k: ['vietat','divieti','decoro','rumor','insegne','balconi','facciata','davanzali','fioriere','finestre','giardini','animali'], s: 'E\' vietato usare gli immobili contro il decoro, alterare le strutture o la facciata, occupare le parti comuni, apporre insegne, allevare animali pericolosi, fare rumore nelle ore di riposo e dopo le 23, gettare rifiuti negli scarichi o acqua dalle finestre e calpestare i giardini.' },
  { n: 12, tit: 'Manutenzione ordinaria, straordinaria e migliorie', k: ['manutenzion','migliori'], s: 'Si distinguono la manutenzione ordinaria, cioè le riparazioni dovute all\'uso, la manutenzione straordinaria, che riguarda lavori strutturali di ampia portata, e le migliorie, che modificano in modo sostanziale le parti comuni.' },
  { n: 13, tit: 'Esecuzione dei lavori', k: ['fondi','stanziamento','urgent'], s: 'I lavori sono deliberati dall\'assemblea su proposta dell\'amministratore. Quelli urgenti, decisi per pericolo o per ordinanze, vanno eseguiti subito e l\'assemblea viene convocata al più presto per la ratifica.' },
  { n: 14, tit: 'Ripartizione spese', k: ['ripartizion','ripartit','proporzional'], s: 'Le spese per la conservazione e l\'uso delle parti comuni si ripartiscono in proporzione al valore delle unità immobiliari, espresso in millesimi; quelle per i servizi comuni in proporzione all\'uso che ciascuno può farne.' },
  { n: 15, tit: 'Suddivisione delle spese', k: ['suddivision'], s: 'Le spese generali seguono le tabelle di proprietà; scale, ascensore e riscaldamento seguono tabelle specifiche di servizio. Le tabelle si modificano solo per errore o per mutate condizioni.' },
  { n: 16, tit: 'Assicurazione', k: ['assicurazion','polizz','sinistri'], s: 'L\'assemblea stabilisce la copertura del fabbricato contro fuoco, fulmini e scoppio per perdite di gas. I sinistri sulle parti comuni sono denunciati dall\'amministratore, quelli sugli appartamenti dai singoli condomini tramite l\'amministratore.' },
  { n: 17, tit: 'Scale e lastrici solari', k: ['scale e','copertura'], s: 'Le spese di manutenzione e ricostruzione delle scale si ripartiscono secondo l\'articolo 1124 del Codice Civile; i lastrici solari comuni come le altre spese del fabbricato, quelli di uso esclusivo ai sensi dell\'articolo 1126.' },
  { n: 18, tit: 'Ascensore', k: ['ascensore e le spese','ascensore manutenzione','tabella di servizio'], s: 'Le spese di manutenzione dell\'ascensore seguono la tabella di servizio allegata; gli alloggi usati anche a scopo professionale pagano una percentuale in più stabilita dall\'assemblea.' },
  { n: 19, tit: 'Riscaldamento', k: ['riscaldam','termosifon','sigill'], s: 'Le spese di manutenzione ed esercizio del riscaldamento si ripartiscono secondo la tabella millesimale. Chi rinuncia al riscaldamento, previa delibera, paga una quota ridotta e l\'amministratore può sigillare i termosifoni.' },
  { n: 20, tit: 'Acqua', k: ['contatori'], s: 'Ai consumi d\'acqua, esclusi quelli dei contatori individuali, contribuiscono i condomini in base ai millesimi; l\'assemblea può adottare criteri diversi per i consumi passati.' },
  { n: 21, tit: 'Illuminazione', k: ['illuminazion'], s: 'Le spese per l\'illuminazione di giardino, androni, garages e beni comuni si ripartiscono in base ai millesimi della tabella allegata.' },
  { n: 22, tit: 'Custodia', k: ['custodia','vigilanz','guardian'], s: 'Il servizio di custodia e vigilanza dipende dall\'assemblea, che ne decide nomina e revoca. Le relative spese si ripartiscono in base ai millesimi di proprietà.' },
  { n: 23, tit: 'Pulizia e servizi particolari', k: ['pulizi','appalto'], s: 'La pulizia delle parti comuni e i servizi ausiliari sono gestiti dall\'amministratore, che può affidarli a ditte specializzate, a privati o al personale di custodia.' },
  { n: 24, tit: 'Quote condominiali', k: ['conguaglio','fondo condominiale','anticipo'], s: 'Ogni condomino paga mensilmente e in anticipo le quote per l\'esercizio, il fondo condominiale e il risparmio per la manutenzione straordinaria, più eventuali conguagli a debito.' },
  { n: 25, tit: 'Mancato o ritardato pagamento', k: ['ingiunzion','distacco','sospension','ritardo pagamento'], s: 'In caso di ritardo reiterato l\'amministratore può agire con decreto ingiuntivo e arrivare alla sospensione dei servizi comuni; le spese di distacco e ripristino sono a carico del moroso.' },
  { n: 26, tit: 'Assemblea', k: ['assemblea','convocaz','quorum','deliber','presidente','verbale','maggioranza'], s: 'L\'assemblea è l\'organo deliberante: va convocata almeno una volta l\'anno con preavviso di almeno 5 giorni. In prima convocazione servono due terzi del valore e la maggioranza dei partecipanti; in seconda convocazione un terzo di entrambi.' },
  { n: 27, tit: 'Amministratore', k: ['amministrator','revoca','compenso'], s: 'L\'assemblea nomina ogni anno l\'amministratore, che convoca l\'assemblea, gestisce i servizi, predispone bilanci preventivo e consuntivo, riscuote le quote, esegue le delibere e cura i documenti contabili.' },
  { n: 28, tit: 'Esercizio condominiale', k: ['consuntivo','preventivo','bilancio'], s: 'L\'esercizio va dal primo gennaio al 31 dicembre. Entro il 10 marzo l\'amministratore presenta bilancio consuntivo, bilancio preventivo e relazione sulla gestione.' },
  { n: 29, tit: 'Rinvio alle leggi vigenti', k: ['rinvio','codice civile'], s: 'Per quanto non previsto dal regolamento si rinvia al Codice Civile, alle disposizioni di attuazione e alle altre norme applicabili.' }
];

/* PRNG deterministico — IDENTICO al sito */
let rndState = 20260912;
function rnd() {
  rndState = (rndState * 1664525 + 1013904223) >>> 0;
  return rndState / 4294967296;
}
function resetRnd() { rndState = 20260912; }

function generaNome() {
  return NOMI[Math.floor(rnd() * NOMI.length)] + ' ' + COGNOMI[Math.floor(rnd() * COGNOMI.length)];
}

function descrizioneSpesa(cat) {
  const m = {
    'Luce comune': ['Illuminazione scale','Luce giardino','Luce garage','Illuminazione cortile'],
    'Gas': ['Riscaldamento invernale','Acqua calda'],
    'Acqua': ['Acqua verde','Acqua potabile'],
    'Ascensore': ['Manutenzione ascensore','Revisione periodica'],
    'Portierato': ['Stipendio portiere','Straordinario portiere'],
    'Pulizia': ['Pulizia scale','Pulizia giardino','Pulizia tettoia','Sanificazione'],
    'Manutenzione': ['Tetto','Infissi','Cortile','Tubi comuni','Pavimentazione'],
    'Assicurazione': ['Polizza RC','Polizza incendio'],
    'Amministrazione': ['Compensi amministratore','Bollo gestione','Consulenza'],
    'Altro': ['Spese varie','Consulenza legale','Cassette postali']
  };
  const arr = m[cat] || ['Spesa generica'];
  return arr[Math.floor(rnd() * arr.length)];
}

function generaDati() {
  resetRnd();
  const palazzine = PALAZZINE_NOMI.map((nome, i) => {
    const famiglie = [];
    const scale = ['A','B','C','D','E'];
    for (const scala of scale) {
      for (let f = 0; f < 4; f++) {
        const ratePagate = Math.floor(rnd() * 12) + 1;
        const quotaMensile = 80 + Math.floor(rnd() * 180);
        famiglie.push({
          id: `${i}-${famiglie.length}`,
          interno: `${scala}${f + 1}`,
          nome: generaNome(),
          password: String(1000 + Math.floor(rnd() * 9000)),
          quotaMensile,
          ratePagate,
          versato: ratePagate * quotaMensile,
          spesaAnnua: quotaMensile * 12
        });
      }
    }
    return { id: i, nome, famiglie, scala: scale };
  });

  const spese = [];
  const anni = [2025, 2026];
  for (const a of anni) {
    for (let m = 0; m < 9; m++) {
      const numSpese = 2 + Math.floor(rnd() * 4);
      for (let s = 0; s < numSpese; s++) {
        const palId = Math.floor(rnd() * 10);
        const cat = CATEGORIE[Math.floor(rnd() * CATEGORIE.length)];
        const imp = 50 + Math.floor(rnd() * 3000);
        const nFam = palazzine[palId].famiglie.length;
        spese.push({
          id: spese.length,
          data: `${a}-${String(m+1).padStart(2,'0')}-${String(1+Math.floor(rnd()*28)).padStart(2,'0')}`,
          palazzinaId: palId,
          categoria: cat,
          descrizione: descrizioneSpesa(cat),
          importo: imp,
          perFamiglia: +(imp / nFam).toFixed(2)
        });
      }
    }
  }
  return { palazzine, spese };
}

function normalizza(txt) {
  return (txt || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/).filter(Boolean);
}

function euro(n) { return '€ ' + Number(n).toLocaleString('it-IT'); }

function statoCondomino(f) {
  return f.ratePagate === 12 ? 'aggiornato' : f.ratePagate >= 9 ? 'in_attesa' : 'in_ritardo';
}
function testoStato(s) {
  return s === 'aggiornato' ? 'in regola' : s === 'in_attesa' ? 'in attesa di pagamento' : 'in ritardo con i pagamenti';
}

function rispondiRegolamento(lq) {
  const L = normalizza(lq).join(' ');
  const numM = L.match(/(?:^|\s)art(?:icolo)?[.\s]?(\d+)(?:\s|$)/);
  if (numM) {
    const art = REGOLAMENTO.find(a => a.n === parseInt(numM[1], 10));
    if (art) return 'Articolo ' + art.n + ' - ' + art.tit + ': ' + art.s;
  }
  const forti = ['vietat','divieti','regolament','assemblea','convocaz','amministrator','millesimi','stender','lavatoi','lastric','sigill','sopraelevaz','quorum','decoro','polizz','contatori'];
  const attivi = numM || forti.some(f => L.includes(f));
  if (!attivi) return null;
  let migliori = REGOLAMENTO
    .map(a => ({ a, p: a.k.reduce((s, kw) => s + (L.includes(kw) ? 1 : 0), 0) }))
    .filter(x => x.p > 0)
    .sort((x, y) => y.p - x.p);
  if (migliori[0] && migliori[0].p > 0) {
    const a = migliori[0].a;
    return 'Articolo ' + a.n + ' - ' + a.tit + ': ' + a.s;
  }
  return null;
}

function rispondiFamiglia(lq, palazzina, f) {
  const speseLocali = speseCtx.filter(s => s.palazzinaId === palazzina.id);
  let t;
  if (/(ciao|salve|buongiorno|hey|ehi)/.test(lq)) {
    return 'Ciao ' + f.nome.split(' ')[0] + '. Dimmi pure: posso dirti la tua quota, quanto hai versato, il tuo residuo o una regola del regolamento.';
  }
  const reg = rispondiRegolamento(lq);
  if (reg) return reg;
  if (/((quota|mensil|rata|canone))/.test(lq)) {
    return 'La tua quota mensile è ' + euro(f.quotaMensile) + ', quindi una spesa annua di ' + euro(f.spesaAnnua) + '.';
  }
  if (/((versat|pagat|rate))/.test(lq)) {
    return 'Hai versato ' + euro(f.versato) + ' in ' + f.ratePagate + ' rate su 12.';
  }
  if (/((residuo|dovut|debit|saldo|resta|quanto.*devo|quanto.*manc))/.test(lq)) {
    const residuo = f.spesaAnnua - f.versato;
    return residuo > 0 ? 'Hai un residuo da saldare di ' + euro(residuo) + '.' : 'Sei in pareggio: nessun residuo da saldare.';
  }
  if (/((spes|importo|quanto.*ho|mio.*cost|a mio carico))/.test(lq)) {
    const tot = speseLocali.reduce((sum, s) => sum + s.perFamiglia, 0);
    return 'Hai ' + speseLocali.length + ' spese correlate per un totale a tuo carico di ' + euro(tot) + '.';
  }
  if (/((stato|situazione|come sto|come va))/.test(lq)) {
    const st = statoCondomino(f);
    return 'La tua situazione è ' + testoStato(st) + ': hai una spesa annua di ' + euro(f.spesaAnnua) + ' e hai versato ' + euro(f.versato) + '.';
  }
  if (/(ascensore|lift|luce|illuminazione|puliz|manutenzion|portier|acqua|gas)/.test(lq)) {
    const cat = /(ascensore|lift)/.test(lq) ? 'Ascensore' : /(luce|illuminazione)/.test(lq) ? 'Luce comune' : /(puliz)/.test(lq) ? 'Pulizia' : /(manutenzion)/.test(lq) ? 'Manutenzione' : /(portier)/.test(lq) ? 'Portierato' : /(acqua)/.test(lq) ? 'Acqua' : /(gas)/.test(lq) ? 'Gas' : null;
    const correlate = speseLocali.filter(s => s.categoria === cat);
    const tot = correlate.reduce((sum, s) => sum + s.perFamiglia, 0);
    return cat + ': hai ' + correlate.length + ' spese a tuo carico per un totale di ' + euro(tot) + '.';
  }
  if (/(aiuto|cosa.*(puoi|so) fare|help|comando)/.test(lq)) {
    return 'Posso dirti la tua quota mensile, quanto hai versato, il tuo residuo, le tue spese per categoria o una regola del regolamento.';
  }
  return 'Non ho capito. Chiedimi ad esempio: "quanto è il mio residuo?", "qual è la mia quota?", "quanto ho versato?" oppure "è vietato fare rumore dopo le 23?".';
}

let speseCtx = [];

exports.handler = function (context, event, callback) {
  const { palazzine, spese } = generaDati();
  speseCtx = spese;
  const twiml = new Twilio.twiml.VoiceResponse();
  const step = event.step || 'init';
  const BASE = (context.DOMAIN_NAME ? 'https://' + context.DOMAIN_NAME + '/assistant' : '/assistant');
  const VY = 'Polly.Giorgio';

  function gather(texto, action, timeout) {
    const g = twiml.gather({
      input: 'speech',
      language: 'it-IT',
      speechTimeout: 'auto',
      timeout: timeout || 6,
      action: action,
      method: 'POST'
    });
    g.say({ voice: VY }, texto);
    return g;
  }

  function dì(testo, poi) {
    twiml.say({ voice: VY }, testo);
    if (poi) poi();
  }

  if (step === 'init') {
    gather('Benvenuto all\'assistente del condominio. Dimmi il tuo cognome, per favore.', BASE + '?step=nome');
    twiml.redirect(BASE + '?step=init');
  } else if (step === 'nome') {
    const speech = (event.SpeechResult || '').trim();
    if (!speech) {
      gather('Non ti ho sentito. Ripeti il tuo cognome, per favore.', BASE + '?step=nome');
      twiml.redirect(BASE + '?step=nome');
    } else {
      const cognome = normalizza(speech).pop() || '';
      const famiglie = [];
      palazzine.forEach(p => {
        p.famiglie.forEach(f => {
          if (f.nome.split(' ').pop().toLowerCase() === cognome) famiglie.push({ p, f });
        });
      });
      if (famiglie.length === 0) {
        gather('Non ho trovato nessuna famiglia con questo cognome. Prova a ripeterlo, per favore.', BASE + '?step=nome');
        twiml.redirect(BASE + '?step=nome');
      } else if (famiglie.length === 1) {
        const { p, f } = famiglie[0];
        dì('Ciao ' + f.nome.split(' ')[0] + ' di ' + p.nome + '. Come posso aiutarti?', () => {
          gather('Chiedimi pure: la tua quota, quanto hai versato, il tuo residuo, oppure una regola del regolamento.', BASE + '?step=domanda&fid=' + f.id);
        });
        twiml.redirect(BASE + '?step=nome');
      } else {
        gather('Ho trovato più famiglie con questo cognome. Dimmi l\'interno, per esempio, A uno.', BASE + '?step=interno&c=' + encodeURIComponent(cognome));
        twiml.redirect(BASE + '?step=nome');
      }
    }
  } else if (step === 'interno') {
    const cognome = (event.c || '').toLowerCase();
    const speech = (event.SpeechResult || '').trim();
    const parole = normalizza(speech);
    const numParole = { uno:1, due:2, tre:3, quattro:4, cinque:5 };
    let scala = '';
    let num = 0;
    for (const parola of parole) {
      if (/^[a-e]$/.test(parola)) scala = parola.toUpperCase();
      else if (numParole[parola] !== undefined) num = numParole[parola];
      else if (/^[1-5]$/.test(parola)) num = parseInt(parola, 10);
    }
    let trovata = null;
    palazzine.forEach(p => {
      p.famiglie.forEach(f => {
        if (f.nome.split(' ').pop().toLowerCase() === cognome && f.interno === scala + num && num > 0) trovata = { p, f };
      });
    });
    if (trovata) {
      const { p, f } = trovata;
      dì('Ciao ' + f.nome + ' di ' + p.nome + '. Come posso aiutarti?', () => {
        gather('Chiedimi pure: la tua quota, quanto hai versato, il tuo residuo, oppure una regola del regolamento.', BASE + '?step=domanda&fid=' + f.id);
      });
      twiml.redirect(BASE + '?step=interno&c=' + encodeURIComponent(cognome));
    } else {
      gather('Non ho riconosciuto l\'interno. Ripeti l\'interno, per esempio, B due.', BASE + '?step=interno&c=' + encodeURIComponent(cognome));
      twiml.redirect(BASE + '?step=interno&c=' + encodeURIComponent(cognome));
    }
  } else if (step === 'domanda') {
    const speech = (event.SpeechResult || '').trim();
    let f = null, p = null;
    palazzine.forEach(pp => pp.famiglie.forEach(ff => { if (ff.id === event.fid) { f = ff; p = pp; } }));
    if (!f) {
      gather('Non ti ho riconosciuto. Ripeti il tuo cognome, per favore.', BASE + '?step=nome');
      twiml.redirect(BASE + '?step=nome');
    } else if (!speech || /(arrivederci|basta|fine|chiuso|null|nient altro|non ho altre domande|chiudi)/.test(speech.toLowerCase())) {
      dì('Grazie ' + f.nome.split(' ')[0] + ', arrivederci.');
    } else {
      const risposta = rispondiFamiglia(speech.toLowerCase(), p, f);
      dì(risposta, () => {
        gather('Vuoi sapere altro?', BASE + '?step=domanda&fid=' + f.id);
      });
      twiml.redirect(BASE + '?step=domanda&fid=' + f.id);
    }
  } else {
    gather('Benvenuto all\'assistente del condominio. Dimmi il tuo cognome, per favore.', BASE + '?step=nome');
    twiml.redirect(BASE + '?step=init');
  }

  callback(null, twiml);
};