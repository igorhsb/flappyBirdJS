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

    this.setDeslocamento = x => this.deslocamento = (x >= 1 ? x : 1);
}

function Passaro (alturaJogo) {
    let voando = false;
    this.mult = 1;
    this.element = newElement('img', 'passaro');
    this.element.src = "imgs/passaro.png";

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0]);
    this.setY = y => {
        this.element.style.bottom = `${y}px`
    } 

    window.onkeydown = e => voando = true;
    window.onkeyup = e => voando = false;

    this.animar = () => {
        const newY =  this.getY() + (voando ? 8*this.mult : -5*this.mult); 
        const alturaMax = alturaJogo - this.element.clientHeight
        if(newY <= 0) {
            this.setY(0)
        } else if (newY >= alturaMax) {
            this.setY(alturaMax)
        } else {
            this.setY(newY)
        }
    }

    this.setUpDown = mult => this.mult = mult >= 1 ? mult : 1; 

    this.setY(alturaJogo/2);
}

function Progresso() {
    this.element = newElement('span', 'progresso')
    this.updatePoints = points => {
        this.element.innerHTML = points
    }
    this.updatePoints(0);
}

function sobreposicao(elemA, elemB) {
    const a = elemA.getBoundingClientRect();
    const b = elemB.getBoundingClientRect();
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;
    return vertical && horizontal;
}

function colide(passaro, barreiras) {
    let colided = false;
    barreiras.pares.forEach( par => {
        if(!colided) {
            const superior = par.superior.element
            const inferior = par.inferior.element
            colided = sobreposicao(passaro.element, superior) || sobreposicao(passaro.element, inferior) 
        }
    })
    return colided;
}

function game () {
    let points = 0;
    let mult = 1;
    const areaDoJogo = document.querySelector('#wm-flappy');
    const alturaJogo = areaDoJogo.clientHeight;
    const larguraJogo = areaDoJogo.clientWidth;
    const abertura = 200;
    const espaco = 400;
    const progresso = new Progresso();
    const barreiras = new Barreiras(alturaJogo, abertura, larguraJogo, espaco, () => progresso.updatePoints(++points));
    const passaro = new Passaro(alturaJogo);
    areaDoJogo.appendChild(progresso.element)
    areaDoJogo.appendChild(passaro.element)
    barreiras.pares.forEach(par => {
        areaDoJogo.appendChild(par.element)
    })

    this.start = () => {
        const temp = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            if(points === 3) {
                mult = 1.2;
                barreiras.setDeslocamento(3);
                passaro.setUpDown(mult);
            }
            if(colide(passaro, barreiras)) {
                clearInterval(temp)
            }
        }, 20)
    }
}

new game().start();