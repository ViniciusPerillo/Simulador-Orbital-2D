/** 
 * @description Classe Figure cria HTMLElement figure que pode ou não ter um HTMLElement img dentro, dando uma cor aleatória caso não haja um src válido para o img
 */
export class Figure{
    constructor(width = 0, height = 0, x = 0, y = 0, imgPath = '',){
        this.imgPath = imgPath;
        this.figure = document.createElement('figure');
        document.body.appendChild(this.figure)
        this.figure.style.backgroundColor = `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`;
        this.img = document.createElement('img');
        this.figure.appendChild(this.img);
        this.setImgPath = imgPath;
        this.setPosition(x,y);
        this.setSize(width,height);
    }

    setPosition(x,y){
        this.setX = x;
        this.setY = y;
    }

    setSize(width,height){
        this.setWidth = width;
        this.setHeight = height;
    }
//Getters-------------------------------------------------------------------------------------------------------------------------------
    get getFigure(){
        return this.figure;
    }

    get getImg(){
        return this.img;
    }

    get getImgPath(){
        return this.imgPath;
    }

    get getX(){
        return this.figure.offsetLeft;
    }

    get getY(){
        return this.figure.offsetTop;
    }

    get getWidth(){
        return this.figure.offsetWidth;
    }

    get getHeight(){
        return this.figure.offsetHeight;
    }
//Setters-------------------------------------------------------------------------------------------------------------------------------
    
    /**
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
     * @param {number} x
     */
    set setX(x){
        this.figure.style.left = `${x}px`;
    }

    /**
     * @param {number} y
     */
    set setY(y){
        this.figure.style.top = `${y}px`;
    }

    /**
     * @param {number} width
     */
    set setWidth(width){
        this.img.style.width = `${width}px`;
        this.figure.style.width = `${width}px`;
    }
    
    /**
     * @param {number} height
     */
    set setHeight(height){
        this.img.style.height = `${height}px`;
        this.figure.style.height = `${height}px`;
    }
}

function randomRGB(){
    return Math.random()*192 + 64
}