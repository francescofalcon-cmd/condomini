# Twilio Voice Assistant - Telefonate in ingresso

Assistente vocale telefonico per il condominio. Stessa logica della chatbox
del sito, con gli **stessi dati deterministici** (seme 20260912): il condomino
chiama, dice il cognome (e l'interno se omologhi), poi fa domande sulle
proprie spese o sul regolamento.

## Cosa serve
- Account Twilio (già attivo)
- Un numero Twilio acquistato (costa pochi centesimi, es. ~1 $/mese + chiamate)
- Node.js installato sul PC

## Passi

### 1. Installare la Twilio CLI
Apri il terminale e:

```
npm install -g twilio-cli
twilio login
```

### 2. Configurare le credenziali
Copia `.env.example` in `.env` e metti Account SID e Auth Token
(li trovi in Twilio Console: https://console.twilio.com → Account → Keys & Credentials).
**Non committare `.env` su GitHub.**

### 3. Deploy della funzione
Nella cartella `twilio-function`:

```
twilio serverless:deploy --override-existing-project
```

Al termine ti viene mostrato l'URL del servizio, es.:
`https://<dominio>-1234-dev.twil.io/assistant` (endpoint = nome file senza `.js`).
Per questo progetto l'endpoint è **`/assistant`**.

### 4. Collegare il numero
Twilio Console → **Phone Numbers** → numero acquistato → sezione *Voice*:
- "Accept Incoming": `Voice`
- "A call comes in": `Webhook`
- URL: `https://<dominio>-1234-dev.twil.io/assistant`
- HTTP: `POST`

Salva. Il numero ora risponde con l'assistente.

## Test
Chiama il tuo numero Twilio da un cellulare e prova:
- "Fontana" (o un altro cognome dall'elenco del sito)
- se serve, "A uno" (interno)
- "quanto è il mio residuo?"
- "è vietato fare rumore dopo le 23?"
- "arrivederci" per chiudere

## Aggiornamenti
Quando modifichi la chatbox nel sito, aggiorna anche `functions/assistant.js`
(già sincronizzato: stessi dati e regolamento) e rilancia il deploy.

## Costi orientativi
- Tariffa per minuto in ingresso: ~0,01-0,03 €/min (varia per nazione)
- Riconoscimento vocale incluso nei minuti, addon "Automatic Speech Recognition" se serve
- Verifica su: https://www.twilio.com/voice/pricing/it