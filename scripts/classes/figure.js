export class Figure{
    constructor( width = 0, height = 0, x = 0, y = 0, imgPath = '',){
        this.imgPath = imgPath;
        this.figure = document.createElement('figure');
        document.body.appendChild(this.figure)
        this.figure.style.backgroundColor = `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`;
        if(this.imgPath != ''){
            this.createImg();
        }else{
            this.img = this.figure;
        }
        this.setPosition(x,y);
        this.setSize(width,height);

    
    }

    addFirstImg(){
        this.img = new Image(this.width,this.heigth);
            this.img.appendChild(this.figure);
            this.img.scr = this.imgPath;
    }

    createImg(){
        this.img = new Image(this.width,this.heigth);
        this.img.appendChild(this.figure);
        this.img.scr = this.imgPath;
    }

    setPosition(x,y){
        this.figure.style.left = `${x}px`;
        this.figure.style.top = `${y}px`;
    }

    setSize(width,height){
        this.img.style.width = `${width}px`;
        this.img.style.height = `${height}px`;
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
        if( this.img == this.figure){
            this.createImg();
        }else{
            this.img.scr = this.imgPath;
        }
    }

    

}

function randomRGB(){
    return Math.random()*192 + 64
}