//VARIABILI PER L'AEREO
let aereo;
let x;
let y;

//VARIABILI PER LE FOTO E LO SFONDO
let bgimg;
let menuimg;
let comandiimg;
let infoimg;

//VARIABILI PER IL MOVIMENTO
let velocityY = 0;                  //velocità verticale dell'aereo
let velocityX = 0;                  //velocità orizzontale dell'aereo

//VARIABILI PER GLI OSTACOLI
let obstacleSpeed = 4;              //velocità di nascita ostacoli
let ostacoli = [];                  //array di ostacoli
let ostWidth = 200;                 //larghezza degli ostacoli
let ostHeight = 60;                 //altezza degli ostacoli
let obstacleFrequency = 30;         //frequenza degli ostacoli (più è bassa più ci sono)

//VARIABILI PER GESTIRE IL GIOCO
let livello;                        //per ora inutile
let punteggio = 0;
let statoGioco;                     //viene usata in keyPressed

function preload()
{
    bgimg = loadImage("./img/oceano.png");
    aereo = loadImage("./img/aereo.png");
    menuimg = loadImage("./img/menu.png");
    comandiimg = loadImage("./img/comandi.png");
    infoimg = loadImage("./img/info.png");
}

function setup()
{
    createCanvas(1510, 680);    //per tentativi ho espanso il più possibile l'area di gioco
    frameRate(60);              //ho impostato un framerate elevato per schivare più facilmente gli ostacoli

    bgimg.resize(width, height);
    aereo.resize(65, 0);

    //posiziona l'omino al centro inferiore del canvas
    x = width / 2 - aereo.width / 2;
    y = height - aereo.height - 50;

    //inizializza lo stato del gioco come "playing"
    statoGioco = "menu";
}

function draw() 
{
    background(menuimg);

    if (statoGioco == "commands")
    {
        background(comandiimg);
    }

    if (statoGioco == "info")
    {
        background(infoimg);
    }

    //codice per la modalità "playing"
    if (statoGioco == "playing") 
    {
        background(bgimg);
        x = x + velocityX;
        y = y + velocityY;

        //limito la posizione verticale e orizzontale dell'omino
        x = constrain(x, 0, width - aereo.width);
        y = constrain(y, 0, height - aereo.height);

        image(aereo, x, y);

        //crea ostacoli casualmente
        if (frameCount % obstacleFrequency == 0) 
        {
            createObstacle();
        }
        //ogni 35 frame in facile, 25 in medio, 15 in difficile

        //muove e disegna gli ostacoli
        moveAndDisplayObstacles();

        //scrive il punteggio
        fill(255);
        textSize(20);
        textAlign(LEFT);
        text("Km percorsi: " + punteggio, 20, 30);
    }

    //codice per la modalità "gameover"
    else if (statoGioco == "gameover") 
    {
        background(bgimg);
        fill(255);
        textSize(40);
        textAlign(CENTER);
        text("Game Over", width / 2, height / 2 - 60);
        text("Hai percorso " + punteggio + "km", width / 2, height / 2 - 20);
        text("Premi 1 per la modalità facile", width / 2, height / 2 + 40);
        text("Premi 2 per la modalità media", width / 2, height / 2 + 80);
        text("Premi 3 per la modalità difficile", width / 2, height / 2 + 120);
        text("Premi M per tornare al menù", width / 2, height / 2 + 160);
    }
}

//crea un nuovo ostacolo in posizione X casuale poi lo inserisco nell'array
function createObstacle() 
{
    let ostX = random(width - ostWidth);
    ostacoli.push(new Obstacle(ostX, -ostHeight, ostWidth, ostHeight));
}

//muove e disegna gli ostacoli
function moveAndDisplayObstacles() 
{
    for (let i = ostacoli.length - 1; i >= 0; i--) 
    {
        ostacoli[i].move();
        ostacoli[i].display();

        //gestisco la collisione con l'omino
        if (ostacoli[i].hits(x, y, aereo.width, aereo.height)) 
        {
            statoGioco = "gameover"; //imposto lo stato del gioco a gameover
        }

        //se l'ostacolo esce dallo schermo lo rimuovo dall'array e incremento il punteggio
        if (ostacoli[i].offscreen()) 
        {
            ostacoli.splice(i, 1);
            punteggio++;
        }
    }
}

//gestisco la pressione dei tasti
function keyPressed() 
{
    //comandi per il menu
    if (statoGioco == "menu") 
    {
        if (key == 'g') 
        {
            resetGame();
            statoGioco = "playing"; //passa alla modalità di gioco
        } 
        else if (key == 'c') 
        {
            statoGioco = "commands"; //passa alla modalità comandi
        } 
        else if (key == 'i') 
        {
            statoGioco = "info"; //passa alla modalità info
        }
    }

    //comandi per uscire da commands e info
    if (statoGioco == "commands" || statoGioco == "info") 
    {
        if (key == 'e') 
        {
            statoGioco = "menu"; // torna alla modalità menu
        }
    }

    //comandi per la modalità playing
    if (statoGioco == "playing") 
    {
        if (keyCode == LEFT_ARROW || key == 'a') 
        {
            velocityX = -10; //velocità negativa -> vado verso 0 (sinistra)
        } 
        else if (keyCode == RIGHT_ARROW || key == 'd') 
        {
            velocityX = 10; //velocità positiva -> vado verso infinito (destra)
        }
        else if (keyCode == UP_ARROW || key == 'w') 
        {
            velocityY = -8; //velocità negativa verso l'alto
        } 
        else if (keyCode == DOWN_ARROW || key == 's') 
        {
            velocityY = 8; //velocità positiva verso il basso
        }
    }    

    //comandi per la modalità "gameover"
    else if (statoGioco == "gameover" && key == '1') 
    {
        livello = "facile";
        obstacleFrequency = 30;
        resetGame();
    } 
    else if (statoGioco == "gameover" && key == '2') 
    {
        livello = "medio";
        obstacleFrequency = 22;
        resetGame();
    } 
    else if (statoGioco == "gameover" && key == '3') 
    {
        livello = "difficile";
        obstacleFrequency = 15;
        resetGame();
    }
    else if (statoGioco == "gameover" && key == '4') //easter egg
    {
        livello = "impossibile";
        obstacleFrequency = 10;
        resetGame();
    } 
    else if (statoGioco == "gameover" && key == 'm') 
    {
        statoGioco = "menu";
    }
}

//quando rilascio un tasto fermo il movimento dell'omino
function keyReleased() 
{
    if ((keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW || key == 'a' || key == 'd') && statoGioco == "playing") 
    {
        velocityX = 0;
    }
    if ((keyCode == UP_ARROW || keyCode == DOWN_ARROW || key == 'w' || key == 's') && statoGioco == "playing") 
    {
        velocityY = 0;
    }
}

// Funzione per riavviare il gioco
function resetGame() 
{
    //riposiziono l'omino al centro inferiore del canvas
    x = width / 2 - aereo.width / 2;
    y = height - aereo.height - 50;

    //inizializzo i parametri del gioco
    velocityX = 0;
    velocityY = 0;
    ostacoli = [];
    punteggio = 0;
    statoGioco = "playing"; //imposto lo stato del gioco a "playing"
    loop(); //riprendo l'animazione
}



//classe e funzioni relative agli ostacoli
class Obstacle 
{
    constructor(x, y, w, h) 
    {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.obstacleImage = loadImage("./img/nuvola.png");
    }

    //muove l'ostacolo
    move() 
    {
        this.y += obstacleSpeed; //sposta gli ostacoli verso il basso
    }

    //disegna l'ostacolo
    display() 
    {
        image(this.obstacleImage, this.x, this.y, this.width, this.height);
    }

    //restituisce true se l'ostacolo è uscito dallo schermo
    offscreen() 
    {
        return this.y > height;
    }

    //restituisce true se c'è una collisione con l'ostacolo
    hits(aereoX, aereoY, aereoWidth, aereoHeight) 
    {
        return ((aereoX + aereoWidth > this.x) && (aereoX < this.x + this.width) && (aereoY + aereoHeight > this.y) && (aereoY < this.y + this.height));
        //se tutte le condizioni sono vere il rettangolo dell'omino ha toccato il rettangolo dell'ostacolo
    }           
}