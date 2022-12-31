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
        console.log(altSuperior)
        console.log(altInferior)
        this.superior.setAltura(altSuperior);
        this.inferior.setAltura(altInferior);
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0]) 
    this.setX = x => this.element.style.left = `${x}px` 
    this.getAltura = () => this.element.clientWidth

    this.randomOpen()
    this.setX(x)
    console.log('x: ', this.getX())
    console.log('h: ', this.getX())
}

const b = new parDeBarreiras(700, 200,400);
document.querySelector('#wm-flappy').appendChild(b.element);