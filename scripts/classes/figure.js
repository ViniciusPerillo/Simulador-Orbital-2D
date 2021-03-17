/** 
 * @description Classe Figure cria HTML figure que pode ou não ter um HTML img dentro, dando uma cor aleatória caso não haja um src válido para o img
 * @author Vinicius Gonçalves Perillo --> https://github.com/ViniciusPerillo
 */
export class Figure{
    /**
     * @description Cria uma instância de Figure. Caso height seja omitido a altura será igual a largura. Caso o imgPath seja omitido ou o path seja inválido o HTML img seja escondido.
     * @param {number} x px
     * @param {number} y px
     * @param {number} width px 
     * @param {number} height px
     * @param {string} imgPath 
     */
    constructor(x, y, width, height = width, imgPath = ''){
        this.figure = document.createElement('figure');
        document.body.appendChild(this.figure)
        this.figure.style.backgroundColor = `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`;
        this.img = document.createElement('img');
        this.figure.appendChild(this.img);
        this.setImgPath = imgPath;
        this.setPosition(x,y);
        this.setSize(width,height);
    }
    
    /**
     * @description Define a distância do HTML figure em relação a borda esquerda e superior em uma mesma função.
     * @param {number} x distância em relação a borda esquerda em px
     * @param {number} y distância em relação a borda superior em px
     */
    setPosition(x,y){
        this.setX = x;
        this.setY = y;
    }

    /**
     * @description Define a Largura e Altura do HTML figure em uma mesma função. Caso height seja omitido a altura será igual a largura
     * @param {number} width Largura em px
     * @param {number} height Altura em px 
     */
    setSize(width,height = width){
        this.setWidth = width;
        this.setHeight = height;
    }
    
    /**
     * @description Define o src do HTML Element img
     * @param {string} path
     */
    set setImgPath(path){
        this.imgPath = path;
        this.img.src = this.imgPath;
        this.img.onerror = ()=>{
            this.img.style.display = 'none'
        }
    }

    /**
     * @description Define a distância do figure em relação a borda esquerda
     * @param {number} x px
     */
    set setX(x){
        this.figure.style.left = `${x}px`;
    }

    /**
     * @description Define a distância do figure em relação a borda superior
     * @param {number} y px
     */
    set setY(y){
        this.figure.style.top = `${y}px`;
    }

    /**
     * @description Define a largura do HTML figure e do HTML img
     * @param {number} width px
     */
    set setWidth(width){
        this.img.style.width = `${width}px`;
        this.figure.style.width = `${width}px`;
    }
    
    /**
     * @description Define a altura do HTML figure e do HTML img
     * @param {number} height px
     */
    set setHeight(height){
        this.img.style.height = `${height}px`;
        this.figure.style.height = `${height}px`;
    }

    /**
     * @description Retorna o HTML figure
     */
    get getFigure(){
        return this.figure;
    }

    /**
     * @description Retorna o HTML img
     */
    get getImg(){
        return this.img;
    }

    /**
     * @description Retorna o src do HTML Element img
     * @returns {string}
     */
    get getImgPath(){
        return this.imgPath;
    }

    /**
     * @description Retorna a distância do HTML figure em relação a borda esquerda da tela
     */
    get getX(){
        return this.figure.offsetLeft;
    }

    /**
     * @description Retorna a distância do HTML figure em relação a borda superior da tela
     */
    get getY(){
        return this.figure.offsetTop;
    }

    /**
     * @description Retorna a largura do HTML figure
     */
    get getWidth(){
        return this.figure.offsetWidth;
    }

    /**
     * @description Retorna a altura do HTML figure
     */
    get getHeight(){
        return this.figure.offsetHeight;
    }
}

function randomRGB(){
    return Math.random()*192 + 64
}