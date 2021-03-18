//Imports-------------------------------------------------------------------------------------------------------------------------------
    import {Figure} from './classes/figure.js';
    import {Astro} from './classes/astro.js';
    import {Vetor} from './classes/vetor.js';

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
            for(let i in astros.object){
                astros.object[i].setPosition(
                    astros.object[i].getX + applySpaceScale(deltaX,1),
                    astros.object[i].getY + applySpaceScale(deltaY,1)
                );
            }
            updateAstroFigure();
            setMousePosition(event);
        }
    })

    document.addEventListener('mouseup',()=>{
        mouseDown = false;
    })

    document.addEventListener('wheel',(event)=>{
        setMousePosition(event);
        let mouseX = applySpaceScale(event.x,1);
        let mouseY = applySpaceScale(event.y,1);
        spaceScale *= Math.pow(10, event.deltaY*0.125/Math.abs(event.deltaY));
        for(let i in astros.object){
            astros.object[i].setPosition(
                astros.object[i].getX - (mouseX - applySpaceScale(mousePosition.x,1)),
                astros.object[i].getY - (mouseY - applySpaceScale(mousePosition.y,1)),
            )
        }
        updateAstroFigure();
        attSpaceScaleHTMLElement();
    });

//Variáveis-----------------------------------------------------------------------------------------------------------------------------
    //Simulador
        let astros = {
            figure: [],
            object: [],
        }
        let spaceScale = 3e+2; // 1 px : spaceScale Km 
    //Interface
        let spaceScaleHTMLElement = document.querySelector('div#spaceScale');
        let mouseDown = false;
        let mousePosition = {
            x: null,
            y: null,
        }
    //Auxiliares
//Funções-------------------------------------------------------------------------------------------------------------------------------
    function run(){
        astros.object.push(new Astro(applySpaceScale(200,1),applySpaceScale(200,1),1,6e+24,new Vetor(0,0)));
        astros.object.push(new Astro(applySpaceScale(700,1),applySpaceScale(700,1),0,2e+27,new Vetor(0,0)));
        astros.figure.push(new Figure(0,0,0,));
        astros.figure.push(new Figure(0,0,0,0,'../../imagens/teste.jpg'));
        astros.figure[0].getFigure.classList.add('astro');
        astros.figure[1].getFigure.classList.add('astro');
        updateAstroFigure();
        attSpaceScaleHTMLElement();
    }

    function updateAstroFigure(){
        for(let i in astros.object){
            astros.figure[i].setSize(Math.round(applySpaceScale(2*astros.object[i].getRadius,-1)));
            astros.figure[i].setPosition(
                Math.round(applySpaceScale(astros.object[i].getX-astros.object[i].getRadius,-1)),
                Math.round(applySpaceScale(astros.object[i].getY-astros.object[i].getRadius,-1))
            )
        }
    }

    function attSpaceScaleHTMLElement(){
        spaceScaleHTMLElement.innerHTML = `1 px  :  ${spaceScale.toExponential(1)} Km`
    }

    /**
     * @description Aplica a escala de espaço, tanto de px para Km, como de Km para px
     * @param {number} number 
     * @param {1|-1} operator 1 : px to Km | -1 : Km to px 
     * @returns {number}
     */
    function applySpaceScale(number, operator){
        return number*Math.pow(spaceScale,operator);
    }

    function setMousePosition(event){
        mousePosition.x = event.x;
        mousePosition.y = event.y;
    }

