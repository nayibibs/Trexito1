//agregar el evento click al boton
let btnStart = document.querySelector(".start");


btnStart.addEventListener("click", () => {
    clearInterval(idInterval)
    iniciarJuego();

});

// idInterval
let idInterval;

//IMAGENES
const trexito = new Image()
trexito.src= "trex1.webp";


const cactusImg = new Image();
cactusImg.src = "cactus1.webp";

const huesoImg = new Image();
huesoImg.src = "hueso.png";

//sprites
const cero = new Image();
cero.src = "0.gif";
const uno = new Image();
uno.src = "1.gif";
const dos = new Image();
dos.src = "2.gif";
const tres = new Image();
tres.src = "3.gif";
const cuatro = new Image();
cuatro.src = "4.gif";
const cinco = new Image();
cinco.src = "5.gif";
const seis = new Image();
seis.src = "6.gif";
const siete = new Image();
siete.src = "7.gif";

///arrglo de las images
const sprites = [ cero,uno,dos,tres,cuatro,cinco,seis,siete]
let posicion = 0;


//Seleccionar canvas

let lienzo = document.getElementById("lienzo");
let ctx = lienzo.getContext("2d")

//lista de enemigos/otros elementos

const nopalitos = [];
const huesos = [];

//Crear Nuestro Personaje --> class
class Trex{
    constructor(x,y,w,h,color,vida, imagen){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.vida = vida;
        this.imagen = imagen;
        this.saltando = false;
        this.score = 0;
    }
    avanzar(){
        this.x += 10;
    }
    retroceder(){
            if(this.x > 0){
            this.x -=10;
        }
        
    }
    saltar(){
        
        if(this.x < 250){
            this.saltando = true;
        }
        
    }
    agacharse(){
        
    }
    dibujarse(){
        ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, this.w, this.h);
        //imagen
        ctx.drawImage(this.imagen, this.x, this.y, this.w, this.h);
           
    }
    morirse(){}
    disparar(){
        const huesito = new Hueso(this.x + this.w, this.y + 10, 20,40, huesoImg);
        huesos.push(huesito); 
        
    }
}

//crear nuestro enemigo --> cactus
class Cactus{
    constructor(x,y,w,h,imagen,nivel){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.imagen = imagen;
        this.nivel = nivel

    }
    dibujarse(){
        ctx.fillStyle = "green";
        //ctx.fillRect(this.x, this.y, this.w,this.h);
        ctx.drawImage(this.imagen,this.x, this.y, this.w,this.h);
        if(this.nivel === "facil"){
            this.x -= 1;
        }else{
            this.x-=3
        }
       
    }
}

//Proyectil/hueso

class Hueso{
    constructor(x,y,w,h,imagen){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.imagen = imagen;

    }
    dibujarse(){
        ctx.fillStyle = "green";
        //ctx.fillRect(this.x, this.y, this.w,this.h);
        ctx.drawImage(this.imagen,this.x, this.y, this.w,this.h);
        this.x +=3;           
    }
    
}



//Dibujar linea

function dibujarPiso(){
    ctx.beginPath()
    ctx.moveTo(0,170);
    ctx.lineTo(340,170);
    ctx.stroke();
    ctx.closePath();
}

dibujarPiso();

// Mostrar el nombre del juego

function mostrarDatos(distancia, score, vida){
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Trexito", 140,20);
    //distacia
    ctx.fillText(`${distancia} m`,20,20);
    //score
    ctx.fillText(`Score: ${score}`, 230, 20);
    ctx.fillText(`Vida: ${vida}`, 230, 50);
}



//Escuche las teclas

function teclas(dinosaurio){
    //recibimos un evento
    document.addEventListener("keyup",(evento) => {
        
        switch(evento.code){
            case "KeyF":
                dinosaurio.disparar();
                break;
            case "Space":
                dinosaurio.saltar();
                break;
            case "ArrowRight":
                dinosaurio.avanzar();
                break;
            case "ArrowLeft":
                dinosaurio.retroceder();
                break;
            case "ArrowDown":
                break;
            case "ArrowUp":
                break;
        }
       
    });
}

//crear enemigos
function crearCactus(){
    const num = Math.floor(Math.random() * 100);
        if(num === 3){
        const cactus = new Cactus(310,130,30,50, cactusImg,"facil")
        nopalitos.push(cactus)
    }

}

function iniciarJuego(){
    let distancia = 0;
    const dinosaurio = new Trex(20, 130, 30, 50, "green", 100, cero)
    teclas(dinosaurio);
    dinosaurio.dibujarse();

    //aqui se reedibuja el videojuego

    idInterval = setInterval(() => {
        ctx.clearRect(0,0,340, 220);
        //mostrar datos
        mostrarDatos(distancia,dinosaurio.score,dinosaurio.vida);
        distancia += 1;
        dibujarPiso();
        
        dinosaurio.imagen = sprites[posicion];

        posicion ++;
        if (posicion === 8){
            posicion = 0;
        }
        dinosaurio.dibujarse();
        
        //esta saltando? y "gravedad"
        if(dinosaurio.saltando === true){
            //altura maximo de salto
            if(dinosaurio.y > 0){
                dinosaurio.y -= 5;
                dinosaurio.x += 5;   
            }else{dinosaurio.saltando = false; 

            }
           
        }

        //no esta saltando
        if(dinosaurio.saltando === false && dinosaurio.y < 130){
            dinosaurio.y += 5;
        }
        //dibujar enemigos/elementos extras
        nopalitos.forEach((cactus, index) =>{
            cactus.dibujarse();
            if(cactus.x <=dinosaurio.x + dinosaurio.w && cactus.x >= dinosaurio.x){
                
            }
            if(cactus.x <= dinosaurio.x + dinosaurio.w && cactus.x >= dinosaurio.x && cactus.y <= dinosaurio.y + dinosaurio.h){
                //eliminar el elemento nopalitos
                //array.splice
                nopalitos.splice(index,1);
                dinosaurio.vida -= 25;
                //si sigue vivo el dinosaurio
                if(dinosaurio.vida < 25){
                    clearInterval(idInterval)                    
                }
            }
        });

        //Proyectil
    huesos.forEach((hueso, hIndex) => {
        hueso.dibujarse();
        nopalitos.forEach((cactus, cIndex) => {
          
          if (hueso.x + hueso.w >= cactus.x) {
            // quitar el hueso y el cactus
            huesos.splice(hIndex, 1);
            nopalitos.splice(cIndex, 1);
            dinosaurio.score +=1;
          }
        });
      });

        crearCactus();
    }, 1000 / 30);

}


//iniciarJuego();

// listo pagina de inicio
//listo agregar la imagen del trex
// listo crear los cactus
//listo brincar
//listorecibir daño trex
//listo contador de avance
//score
//listo perder
//listo trex dispare
//agregar sonido
//ganar
//reiniciar juego