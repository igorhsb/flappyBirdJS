function newElement (tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barreira(reverse = false) {
    this.element = newElement('div', 'barreira');

    const border = newElement('div', 'borda');
    const body = newElement('div', 'corpo');
    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setAltura = altura => body.style.height = `${altura}px`;
}

function parDeBarreiras (altura, abertura, x) {
    this.element = newElement('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)
    this.element.appendChild(this.superior.element);
    this.element.appendChild(this.inferior.element);

    this.randomOpen = () => {
        const altSuperior = Math.random() * (altura - abertura);
        const altInferior = altura - abertura - altSuperior;
        this.superior.setAltura(altSuperior);
        this.inferior.setAltura(altInferior);
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0]) 
    this.setX = x => {
        this.element.style.left = `${x}px`
    } 
    this.getLargura = () => this.element.clientWidth

    this.randomOpen();
    this.setX(x);
}

function Barreiras (altura, abertura, largura, espaco, notPonto) {
    this.pares = [
        new parDeBarreiras(altura, abertura, largura),
        new parDeBarreiras(altura, abertura, largura + espaco),
        new parDeBarreiras(altura, abertura, largura + espaco*2),
        new parDeBarreiras(altura, abertura , largura + espaco*3)
    ]
    this.deslocamento = 3;
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - this.deslocamento)
            if(par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco*this.pares.length)
                par.randomOpen()
            }
            const meio = largura/2
            const cruzouOMeio = par.getX() + this.deslocamento >= meio && par.getX() < meio
            if(cruzouOMeio) notPonto()
        })
    }

    this.setDeslocamento = x => this.deslocamento = x >= 1 ? x : 1;
}

function Passaro (alturaJogo) {
    let voando = false;

    this.element = newElement('img', 'passaro');
    this.element.src = "imgs/passaro.png";

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0]);
    this.setY = y => {
        this.element.style.bottom = `${y}px`
    } 

    window.onkeydown = e => voando = true;
    window.onkeyup = e => voando = false;

    this.animar = () => {
        const newY =  this.getY() + (voando ? 8 : -5); 
        const alturaMax = alturaJogo - this.element.clientHeight
        console.log("y: ", newY)
        if(newY <= 0) {
            this.setY(0)
        } else if (newY >= alturaMax) {
            this.setY(alturaMax)
        } else {
            this.setY(newY)
        }
    }

    this.setY(alturaJogo/2);
}

const barreiras = new Barreiras(700, 200, 1200, 400)
const areaDoJogo = document.querySelector('#wm-flappy')
const passaro = new Passaro(700)
areaDoJogo.appendChild(passaro.element)
barreiras.pares.forEach(par => {
    areaDoJogo.appendChild(par.element)
})
setInterval(() => {
    barreiras.animar()
    passaro.animar()
}, 20)