//Imports
    import {Figure} from './classes/figure.js';
    import {Astro} from './classes/astro.js';
    import {Vector} from './classes/vetor.js';

//Variáveis
    //Simulador
        let astros = {
            figure: [],
            object: [],
        }
        let spaceScale = 1e+6; // 1 px : spaceScale m 
    //Interface
        let spaceScaleHTMLElement = document.querySelector('div#spaceScale');
        let isDraggable = false;
        let mousePosition = {
            x: null,
            y: null,
        }
    //Auxiliares

//DOM Events
    document.addEventListener('DOMContentLoaded', run);  
    document.addEventListener('mousedown', (event)=>{unlockDrag(event)});
    document.addEventListener('mousemove', (event)=>{drag(event)})
    document.addEventListener('mouseup', lockDrag)
    document.addEventListener('wheel', (event)=>{zoom(event)});
    document.addEventListener('keydown', (event)=>{keyboardListeners(event)})
//Listeners
    /**
     * @description desbloqueia a função arrastar os astros
     * @param {MouseEvent} event 
     */
    function unlockDrag(event){
        isDraggable = true;
        setMousePosition(event);
    }

    /**
     * @description bloqueia a função arrastar os astros
     */
    function lockDrag(){
        isDraggable = false;
    }

    /**
     * @description Arrasta os astros
     * @param {MouseEvent} event 
     */
    function drag(event){
        if(isDraggable){
            let deltaX = event.x - mousePosition.x;
            let deltaY = event.y - mousePosition.y;
            for(let astro in astros.object){
                astros.object[astro].setPosition(
                    astros.object[astro].getX + applySpaceScale(deltaX,1),
                    astros.object[astro].getY - applySpaceScale(deltaY,1)
                );
            }
            attAstrosFigure();
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
        for(let astro in astros.object){
            astros.object[astro].setPosition(
                astros.object[astro].getX - (mouseX - applySpaceScale(mousePosition.x,1)),
                astros.object[astro].getY + (mouseY - applySpaceScale(mousePosition.y,1)),
            )
        }
        attAstrosFigure();
        attSpaceScaleHTMLElement();
    }

    function keyboardListeners(event){
        if(event.code == 'Space'){
            for(let astro in astros.object){
                //console.log(astros.object[astro].getAccelerationVector);
                //console.log(astros.object[astro].getVelocityVector);
                //console.log(astros.object[astro].getCentripetalAccelerationVector);
                astros.object[astro].applyPhysics(60*60);
                //console.log(astros.object[astro].getTangencialAccelerationVector);
                //console.log(astros.object[astro].getVelocityVector);
                //console.log('--------------------------------------------------------------')
            }
        }
        console.log('====================================================================')
        attAstrosFigure();
        attAccelerationsVectors();
    }

//Funções
    function run(){
        astros.object.push(new Astro(applySpaceScale(100,1),applySpaceScale(-400,1),1,6e+24,new Vector(0,0)));
        astros.object.push(new Astro(applySpaceScale(484.4,1),applySpaceScale(-400,1),1,7.36e+22,new Vector(1000,3*Math.PI/2)));
        astros.figure.push(new Figure(0,0,0));
        astros.figure.push(new Figure(0,0,0,0,'imagens/teste.jpg'));
        astros.figure[0].getFigure.classList.add('astro');
        astros.figure[1].getFigure.classList.add('astro');
        attAstrosFigure();
        attSpaceScaleHTMLElement();
        attAccelerationsVectors();
    }

    function attAstrosFigure(){
        for(let astro in astros.object){
            astros.figure[astro].setSize(Math.round(applySpaceScale(2*astros.object[astro].getRadius,-1)));
            astros.figure[astro].setPosition(
                Math.round(applySpaceScale(astros.object[astro].getX-astros.object[astro].getRadius,-1)),
                Math.round(applySpaceScale((astros.object[astro].getY+astros.object[astro].getRadius)*-1,-1))
            )
        }
    }

    function attSpaceScaleHTMLElement(){
        spaceScaleHTMLElement.innerHTML = `1 px  :  ${
            (spaceScale/Math.pow(10,Math.floor(Math.log10(spaceScale)))).toFixed(1)
        } × 10${
            (Math.floor(Math.log10(spaceScale))-3).toString().sup()
        } Km`
    }

    function attAccelerationsVectors(){
        for(let astro in astros.object){
            astros.object[astro].setAccelerationVector = Vector.vectorSum(getAccelerationsActingOnTheAstro(astro));
            
        }
    }

    function getAccelerationsActingOnTheAstro(targetAstro){
        let accelerationsActingOnTheAstro = [];
        for(let astro in astros.object){
            let xAxisDistance = astros.object[astro].getX - astros.object[targetAstro].getX; 
            let yAxisDistance = astros.object[astro].getY - astros.object[targetAstro].getY;
            if(astro != targetAstro){
                accelerationsActingOnTheAstro.push(new Vector(
                    applyLawOfGravitation(Math.hypot(xAxisDistance, yAxisDistance), 
                    astros.object[astro].getMass),Math.atan2(yAxisDistance, xAxisDistance)
                ))
            }
        }
        return accelerationsActingOnTheAstro;
    }

    
//Funções Auxiliares
    function applyLawOfGravitation(distance, mass){
        return 6.674184e-11*mass/Math.pow(distance,2);
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

