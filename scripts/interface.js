//Imports-------------------------------------------------------------------------------------------------------------------------------
    import {Figure} from './classes/figure.js';
    import {Astro} from './classes/astro.js';
    import {Vetor} from './classes/vetor.js';

//Variáveis-----------------------------------------------------------------------------------------------------------------------------
    //Simulador
        let astros = {
            figure: [],
            object: [],
        }
        let spaceScale = 3e+2; // 1 px : spaceScale Km 
    //Interface
        let spaceScaleHTMLElement = document.querySelector('div#spaceScale');
        let arrastar = false;
        let mousePosition = {
            x: null,
            y: null,
        }
    //Auxiliares

//DOM Events------------------------------------------------------------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', run);  
    document.addEventListener('mousedown', (event)=>{unlockDrag(event)});
    document.addEventListener('mousemove', (event)=>{drag(event)})
    document.addEventListener('mouseup', lockDrag)
    document.addEventListener('wheel', (event)=>{zoom(event)});
//Listeners-------------------------------------------------------------------------------------------------------------------------------
    /**
     * @description desbloqueia a função arrastar os astros
     * @param {MouseEvent} event 
     */
    function unlockDrag(event){
        arrastar = true;
        setMousePosition(event);
    }

    /**
     * @description bloqueia a função arrastar os astros
     */
    function lockDrag(){
        arrastar = false;
    }

    /**
     * @description Arrasta os astros
     * @param {MouseEvent} event 
     */
    function drag(event){
        if(arrastar){
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
    }

    /**
     * @description Da zoom in ou zoom out baseado no deslocamento do scroll do mouse, mudando a escala de espaço. 
     * @param {MouseEvent} event 
     */
    function zoom(event){
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
    }

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
        spaceScaleHTMLElement.innerHTML = `1 px  :  ${
            (spaceScale/Math.pow(10,Math.floor(Math.log10(spaceScale)))).toFixed(1)
        } × 10${
            (Math.floor(Math.log10(spaceScale))).toString().sup()
        } Km`
        console.log(spaceScale.toExponential(1));
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

