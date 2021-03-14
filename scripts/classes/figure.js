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

    get getFigure(){
        return this.figure;
    }

    get getImg(){
        return this.img;
    }

    get getImgPath(){
        return this.imgPath;
    }

    set setImgPath(path){
        this.imgPath = path;
        this.img.scr = this.imgPath;
        if(this.imgPath == ''){
            this.img.style.display = 'none'
        }else{
            this.img.style.display = 'block'
        }
        
    }

    set setX(x){
        this.figure.style.left = `${x}px`;
    }

    set setY(y){
        this.figure.style.top = `${y}px`;
    }

    set setWidth(width){
        this.img.style.width = `${width}px`;
        this.figure.style.width = `${width}px`;
    }

    set setHeight(height){
        this.img.style.height = `${height}px`;
        this.figure.style.height = `${height}px`;
    }
    

}

function randomRGB(){
    return Math.random()*192 + 64
}