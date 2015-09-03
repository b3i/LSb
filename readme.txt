Locators Sidebar (v.0.2.4)
patchnote(0.2.4)
	-corretto un bug sulla corretta visualizzazione di "[..]" invece del locator completo
	-corretto un typo in "<th>currInst</th>"

INSTALLAZIONE
Trascinare il file LSb-0.2.3.xpi su una pagina vuota di Firefox, accettare l'installazione. 

Se l'installazione è andata a buon fine apparirà nella barra dei pulsanti in alto a destra un'icona con una lente d'ingrandimento e nel menu "Visualizza -> Barra Laterale" la voce "Locators Sidebar".


UTILIZZO
Cliccando sull'icona nella barra dei pulsanti o sulla voce nel menu "Visualizza -> Barra laterale" si aprirà la Sidebar.

È quindi possibile trascinare un file .xml sul pulsante "Sfoglia" per caricare una lista di locators o aggiungerne a mano scegliendo il tipo, scrivendo la condizione per la quale l'elemento viene cercato (es.: "ul li a[class='40 r70 ff']") e premendo il pulsante "Aggiungi locator".

Cliccando su un locator presente nella tabella verrano marcate nella pagina le eventuali istanze presenti con il colore corrispondente.
Cliccando nuovamente i mark agli elementi corrispondenti a quel locator verranno eliminati.

Cliccando sul pulsante "Ricalcola istanze" è possibile eseguire un ricalcolo delle istanze di tutti gli elementi della tabella (nb.: le entry della tabella non vengono modificate quando viene eseguito un ricalcolo, solo il numero di istanze viene aggiornato).

Con il tasto "Svuota tabella" tutte le entry della tabella vengono eliminate e i mark relativi vegono tolti dalla pagina.

Cliccando con il tasto destro del mouse su un entry della tabella dei locator sarà possibile eliminare la singola riga (dopo aver confermato la scelta).

Se il nome di un locator è tropo lungo per essere visualizzato correttamente sopra il mark del relativo elemento nella pagina basta passare il mouse sopra al simbolo "[..]" per avere una descrizione completa del locator.