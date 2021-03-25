//Imports
import {Figure} from './classes/figure.js';
import {Astro} from './classes/astro.js';
import {Vector} from './classes/vetor.js';

//Variáveis 
let astros = {
    figure: [],
    object: [],
}
let spaceScale = 1e+6; // 1 px : spaceScale m 
let timeScale = 1
let isSimulating;
let isPrecisionMode = false;

let spaceScaleHTMLElement = document.querySelector('div#spaceScale');
let optionsMenu = document.querySelector('article#options')
let precisionModeCheckbox = document.querySelector('input#precisionMode')
let mousePosition = {
    x: null,
    y: null,
}
let isDraggable = false;
let isOptionOpen = true;

//DOM Events
document.addEventListener('DOMContentLoaded', run);  
document.addEventListener('mousedown', (event)=>{if(!isOptionOpen)unlockDrag(event)});
document.addEventListener('mousemove', (event)=>{drag(event)});
document.addEventListener('mouseup', lockDrag);
document.addEventListener('wheel', (event)=>{if(!isOptionOpen)zoom(event)});
document.addEventListener('keydown', (event)=>{keyboardListeners(event)});
precisionModeCheckbox.addEventListener('change', precisionMode);

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
        
    }else if(event.code == 'Escape'){
        isOptionOpen = !isOptionOpen;
        options();
    }
    
}

function precisionMode(){
    console.log('opa')
    if(precisionModeCheckbox.checked == true){
        document.querySelector('p#precisionModeWarning').style.display = 'block';
    }else{
        document.querySelector('p#precisionModeWarning').style.display = 'none';
    }
}

//Funções
function run(){
    createAstro(applySpaceScale(100,1), applySpaceScale(-400,1), 1, 6e+25, new Vector(2500,Math.PI/2));
    createAstro(applySpaceScale(484.4,1), applySpaceScale(-400,1), 1, 7.36e+22, new Vector(1000,Math.PI), 0, 'imagens/teste.jpg');
    createAstro(applySpaceScale(-284.4,1), applySpaceScale(-400,1), 1, 7.36e+26, new Vector(500,Math.PI), 0, 'imagens/teste.jpg');
    attSpaceScaleHTMLElement();
    attAccelerationsVectors();
    
}

function simulation(){
    for(let astro in astros.object){
        astros.object[astro].applyPhysics(timeScale);
    }
    inelasticCollision();
    attAstrosFigure();
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

function inelasticCollision(){
    for(let targetAstro in astros.object){
        for(let astro in astros.object){
            if(astro != targetAstro && isCollidingWith(astro, targetAstro)){
                applyCollision(targetAstro, astro);
                inelasticCollision();
            }  
        }
    }
}

function isCollidingWith(astro1, astro2){
    let distanceBetweenThem = Math.hypot(astros.object[astro1].getX - astros.object[astro2].getX, astros.object[astro1].getY - astros.object[astro1].getY);
    let sumOfRadiuses = astros.object[astro1].getRadius + astros.object[astro2].getRadius;
    return distanceBetweenThem < sumOfRadiuses;
}

function applyCollision(astro1, astro2){
    let mass = astros.object[astro1].getMass + astros.object[astro2].getMass
    let x = (astros.object[astro1].getX*astros.object[astro1].getMass + astros.object[astro2].getX*astros.object[astro2].getMass) / mass
    let y = (astros.object[astro1].getY*astros.object[astro1].getMass + astros.object[astro2].getY*astros.object[astro2].getMass) / mass
    let volume = (Math.PI*4*Math.pow(astros.object[astro1].getRadius,3) + Math.PI*4*Math.pow(astros.object[astro2].getRadius,3)) / 3;
    let velocityVector = Vector.vectorSum([astros.object[astro1].getLinearMomentumVector,astros.object[astro2].getLinearMomentumVector]);
    velocityVector.setModule = velocityVector.getModule / mass;
    deleteAstro(astro2);
    deleteAstro(astro1);
    createAstro(x, y, -1, mass, velocityVector, mass / volume, 'imagens/teste.jpg');
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

function createAstro(x, y, type, mass, initialVelocity, density = 0,imgPath = ''){
    astros.object.push(new Astro(x, y, type, mass, initialVelocity, density))
    let newAstroIndex = astros.figure.push(new Figure(0,0,0,0,imgPath)) - 1
    astros.figure[newAstroIndex].getFigure.classList.add('astro');
    attAstrosFigure();
}

function deleteAstro(astroIndex){
    astros.object.splice(astroIndex,1);
    document.body.removeChild(astros.figure[astroIndex].getFigure)
    astros.figure.splice(astroIndex,1);
}

function options(){
    if(isOptionOpen){
        optionsMenu.style.display = 'flex'
    }else{
        optionsMenu.style.display = 'none'
    }
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
