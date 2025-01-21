

1. Configurarea mediului local
1.1. Instalează și rulează un chain local Ethereum (Anvil)
Instalează Foundry (care include Anvil):
Urmează instrucțiunile de pe pagina oficială: Foundry - Book.
Instalează foundryup, apoi execută foundryup pentru a finaliza instalarea.
Rulează Anvil:
Într-un terminal, tastează comanda anvil.
Ar trebui să vezi că rulează un nod local Ethereum, cu un set de adrese (chei private) și un faucet de ETH.
1.2. Instalează și rulează un chain local Sui (Sui CLI)
Instalează Sui CLI:
Urmează instrucțiunile oficiale de pe Sui - CLI.
Instalează partea de sui client.
Configurează un rețea locală Sui (devnet local):
După instalare, poți folosi comanda sui start (sau sui start --local) pentru a porni un nod local.
Verifică dacă nodul local funcționează (ar trebui să primești log-uri în terminal care indică faptul că node-ul rulează).


2. Scrierea și implementarea contractelor inteligente (Smart Contracts)
Va trebui să creezi două contracte inteligente – unul pe Ethereum și unul pe Sui – care să implementeze tokenul IBT. Contractele trebuie să permită:

Mint și Burn doar de către proprietarul (deployer-ul) contractului.
Transfer normal între adrese (funcționalitate standard de token).

2.1. Contractul Ethereum (solidity)
Definește un contract ERC20 simplu (IBT):
Poți porni de la un template standard ERC20, de exemplu OpenZeppelin ERC20.
În constructor, setează numele tokenului („IBT”) și simbolul (ex: „IBT”).
Restricționează funcțiile de mint și burn:
Adaugă un modifier onlyOwner, care să permită doar proprietarului contractului să realizeze mint și burn.
Pentru owner(), poți să folosești direct Ownable de la OpenZeppelin sau să îți implementezi propriul mecanism.
Compilează și pregătește contractul pentru deployment:
Folosește Hardhat/Foundry/Truffle (la alegere) pentru a compila.


Asigură-te că totul trece testele minime (teste unitare pentru funcțiile de mint, burn și transfer).
2.2. Contractul Sui (Move)
Creează un modul Sui Move care definește un token IBT. În Sui, token-urile sunt de obicei structuri Move ce implementează un soi de „Coin”:
Poți crea un fișier ibt.move (sau un nume la alegere).
Definește structura IBT care să respecte standardul Sui Coin<T>.
Implementează funcționalitatea de mint și burn restrictivă:
Crează o resursă care reprezintă autoritatea (owner-ul / deployer-ul). De exemplu, ceva de genul struct IbtAuthority has key.
Doar deținătorul acestei resurse să poată apela funcțiile de mint și burn.
Testare locală:
Folosește sui move build și sui move test pentru a verifica implementarea.
După ce totul e ok, folosește sui client publish . pentru a instala modulul în rețeaua locală.



3. Construcția mecanismului de „Bridge”
Ideea de bază:

„Burn pe chain-ul de sursă” (unde se află token-urile)
„Mint pe chain-ul de destinație” (acolo unde vrei să muți token-urile)
Pentru un Bridge Centralizat, vei avea probabil un script/serviciu (backend) care:

Ascultă evenimentul de Burn pe contractul Ethereum (sau urmărește tranzacțiile Move pe Sui).
Odată detectată o operațiune de burn, apelează (în mod programatic) funcția de mint pe celălalt chain.
3.1. Varianta simplă (script manual / server centralizat)
Pe Ethereum, atunci când un utilizator face burn pentru X IBT, contractul emite un eveniment (Burn(address, amount)).
Aplicația voastră (un server Node.js, Python etc.) detectează acel eveniment (folosind un web3 provider) și:
Trimite o tranzacție pe Sui, chemând funcția mint din contractul Move (doar cu autoritatea/cheia privată de pe Sui).
În sens invers (de la Sui la Ethereum), faceți același lucru:
Serverul detectează că userul a dat burn pe Sui, și apoi trimite tranzacție de mint pe Ethereum.
Notă: Pentru testare locală, te poți limita la un script simplu care leagă cele două. În producție, ar fi nevoie de un oracol/dispozitiv mai complex (pentru a preveni abuzuri).

4. Aplicația Web (Interfața de utilizator)
Aplicația web trebuie să permită:

Autentificarea cu wallet Ethereum (MetaMask):
Vei folosi librăria oficială MetaMask docs sau un library tipic (ex: ethers.js cu window.ethereum).
Autentificarea cu wallet Sui (Sui Wallet / MystenLabs dApp Kit):
Sui Wallet Kit îți oferă un set de API-uri pentru conectare, semnare de tranzacții, etc.
Selectarea direcției de bridging (ETH -> SUI sau SUI -> ETH):
Un dropdown / un buton de toggle cu cele două opțiuni.
Introducerea cantității de token IBT de transferat.
Inițierea procesului de bridging:
Aplicația declanșează un burn pe chain-ul sursă, folosind walletul conectat.
Apoi, serverul / mecanismul central detectează evenimentul și execută mint pe chain-ul destinație.
Actualizarea balanței:
Aplicația trebuie să afișeze balanța actuală de IBT atât pe Ethereum, cât și pe Sui (e posibil să trebuiască să faci 2 conexiuni: una la RPC de Ethereum, alta la RPC de Sui).
După finalizarea bridging-ului, userul ar trebui să vadă noua balanță.
Tehnologii front-end:

React, Next.js, Vue.js sau chiar Vanilla JS. Important e să ai posibilitatea de a interacționa cu walleturile și să afișezi clar ce se întâmplă.
5. Bonus / Funcționalități extra
Notificări în timp real: Afișează un progress bar sau mesaje de confirmare atunci când se face burn/mint.
Istoricul tranzacțiilor: Un mic tab care să arate ce tranzacții a făcut utilizatorul și statusul lor.
UI/UX: O interfață prietenoasă, de ex. un design minimal cu butoane clar definite.
Securitate: Mecanisme de confirmare dublă, sign message pentru a verifica userul, etc.
Mai multe tipuri de token: Poți extinde contractul să suporte bridging pentru mai multe resource types (pe Sui) și multiple ERC20 (pe Ethereum).
6. Livrarea proiectului
Upload pe un repository online (GitHub, GitLab etc.):
Include tot codul (contracte, front-end, scripturi, fișiere de configurare).
Asigură-te că README.md descrie clar:
Cum se instalează deps,
Cum se compilează contractele,
Cum se rulează testele,
Cum se pornește aplicația web,
Cum se face setarea pentru nodurile locale.
Încarcă un video demo cu walk-through complet:
Arată cum pornești Anvil și Sui local,
Cum faci deploy la contracte,
Cum interacționezi cu aplicația web (login cu MetaMask și Sui Wallet),
Cum transferi IBT tokens între cele două blockchain-uri.
7. Sumarul Pas cu Pas
Instalează și pornește local:
Anvil pentru Ethereum
Sui CLI pentru Sui
Scrie contractul Ethereum (solidity + mint/burn restrictiv).
Scrie contractul Sui (Move + mint/burn restrictiv).
Testează ambele contracte local (tranzacții de bază, mint, burn, transfer).
Crează un mecanism de „bridge” (script/serviciu) care:
Ascultă evenimente de burn
Apelează mint pe cealaltă rețea
Construiește aplicația web:
Conectează-te la MetaMask (Ethereum)
Conectează-te la Sui Wallet (Sui)
Permite utilizatorului să selecteze direcția de bridging și cantitatea de IBT
Afișează balanțele pe ambele chain-uri
Arată tranzacțiile reușite / eșuate
Adaugă funcționalități extra (bonus).
Fă un repo online și un video de prezentare.
