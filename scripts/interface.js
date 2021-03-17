//Imports-------------------------------------------------------------------------------------------------------------------------------
    import {Figure} from './classes/figure.js';

//DOM Events----------------------------------------------------------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', run);

    document.addEventListener('mousedown',(event)=>{
        mouseDown = true;
        setMousePosition(event);
    });

    document.addEventListener('mousemove',(event)=>{
        if(mouseDown){
            let deltaX = event.x - mousePosition.x;
            let deltaY = event.y - mousePosition.y;
            for(let i in astros.figure){
                astros.figure[i].setPosition(astros.figure[i].getX + deltaX, astros.figure[i].getY + deltaY);
            }
            setMousePosition(event);
        }
    })

    document.addEventListener('mouseup',()=>{
        mouseDown = false;
    })

//Variáveis-----------------------------------------------------------------------------------------------------------------------------
    //Simulador
        let astros = {
            figure: [],
            object: [],
        }
    //Interface
        let mouseDown = false;
        let mousePosition = {
            x: null,
            y: null,
        }
    //Auxiliares
//Funções-------------------------------------------------------------------------------------------------------------------------------
    function run(){
        astros.figure.push(new Figure(50,50,200,200,));
        astros.figure.push(new Figure(100,100,400,400,'../../imagens/teste.jpg'))
        astros.figure[0].getFigure.classList.add('astro');
        astros.figure[1].getFigure.classList.add('astro');
        console.log(astros.figure[0]);
    }

    function setMousePosition(event){
        mousePosition.x = event.x;
        mousePosition.y = event.y;
    }

