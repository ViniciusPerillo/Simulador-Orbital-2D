//Imports
import {Figure} from './classes/figure.js';
import {Astro} from './classes/astro.js';
import {Vector} from './classes/vetor.js';

//Variables
/*Simulator*/
let astros = {
    figure: [],
    object: [],
}
let spaceScale = 1e+6; // 1 px : spaceScale m 
let timeScale = {
    'timeScale': 1,
    'selectedUnitIndex': 0,
    'multiplier': 1
}
let isSimulating = false;

/*Interface*/
let spaceScaleHTMLElement = document.querySelector('div#spaceScale');
let timeScaleHTMLElement = document.querySelector('div#timeScale');
let optionsMenuHTMLElement = document.querySelector('article#options')
let mousePosition = {
    x: null,
    y: null,
}
let isDraggable = false;
let isOptionOpen = false;

/*New astro*/
let addAstroButtonHTMLElement = document.querySelector('div#addAstroButton');
let addAstroMenuHTMLElement = document.querySelector('div#addAstroMenu');
let newAstroHTMLElements = {
    target: document.querySelector('img#target'),
    x: document.querySelector('div#xPosition input'),
    y: document.querySelector('div#yPosition input'),
    mass: {
        multiplier: document.querySelector('div#mass input#multiplier'), 
        exponent: document.querySelector('div#mass input#exponent')
    },
    type: document.querySelector('div#type select'),
    density:document.querySelector('div#density input'),
    velocity: {
        module: document.querySelector('div#velocity input#module'), 
        angle: document.querySelector('div#velocity input#angle'),
        demonstration: document.querySelector('img#velocityVectorDemonstration'),
        inputtedAngle: 0
    },
    confirm: document.querySelector('span#confirm')
}
let isAddAstroMenuOpened = false;
let isMouseOverNewAstroMenu = false;

/*PrecisionMode*/
let precisionUnit;
let precisionModeHTMLElement = document.querySelector('label#precisionMode span img')
let precisionUnitsHTMLSelect = document.getElementById("units");
let isPrecisionMode = false;

/*Keyboar booleans*/
let isTPressed = false;

//DOM Events
document.addEventListener('DOMContentLoaded', run);  
document.addEventListener('mousedown', (event)=>{if(!isOptionOpen) unlockDrag(event)});
document.addEventListener('mousemove', (event)=>{if(isDraggable && !isAddAstroMenuOpened) drag(event)});
document.addEventListener('mouseup', lockDrag);
document.addEventListener('wheel', (event)=>{if(!isOptionOpen) zoom(event)});
document.addEventListener('keydown', (event)=>{keyDownListeners(event)});
document.addEventListener('keyup',(event)=>{keyUpListeners(event)});

precisionModeHTMLElement.addEventListener('click', precisionMode);
precisionUnitsHTMLSelect.addEventListener('change', attPrecisionUnit);

addAstroButtonHTMLElement.addEventListener('click',()=>{if(!isOptionOpen) astroMenu()})
addAstroMenuHTMLElement.addEventListener('mouseenter',()=>{isMouseOverNewAstroMenu = true});
addAstroMenuHTMLElement.addEventListener('mouseleave',()=>{isMouseOverNewAstroMenu = false});
newAstroHTMLElements.x.addEventListener('input',attTargetPosition);
newAstroHTMLElements.y.addEventListener('input',attTargetPosition);
newAstroHTMLElements.type.addEventListener('change', attDensityInput);
newAstroHTMLElements.velocity.angle.addEventListener('input',attAstroVectorDemonstration);
newAstroHTMLElements.confirm.addEventListener('click',addNewAstro);
newAstroHTMLElements.confirm.addEventListener('mousedown',addNewAstroDown);
newAstroHTMLElements.confirm.addEventListener('mouseup',addNewAstroUp);


//Listeners
/**
 * @description desbloqueia a função arrastar os astros
 * @param {MouseEvent} event 
 */
function unlockDrag(event){
    isDraggable = true;
    document.querySelector('div#barrier').style.display = 'block'
    setMousePosition(event);
    console.log(isMouseOverNewAstroMenu)
    if(!isMouseOverNewAstroMenu){
        newAstroHTMLElements.x.value = mousePosition.x;
        newAstroHTMLElements.y.value = mousePosition.y;
        attTargetPosition();
    }
}

/**
 * @description bloqueia a função arrastar os astros
 */
function lockDrag(){
    isDraggable = false;
    document.querySelector('div#barrier').style.display = 'none'
}

/**
 * @description Arrasta os astros
 * @param {MouseEvent} event 
 */
function drag(event){
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

function keyDownListeners(event){
    if(event.code == 'Space' && !isOptionOpen && !isAddAstroMenuOpened){
        isSimulating = !isSimulating;
        simulate();
    }else if(event.code == 'Escape'){
        if(isAddAstroMenuOpened){
            astroMenu();
        }else{
            toggleOptions();
        }
    }else if(event.code == 'KeyT' && !isOptionOpen){
        isTPressed = true;
    }else if(event.code == 'Equal' && !isAddAstroMenuOpened){
        astroMenu();
    }else if(event.code == 'Enter' && isAddAstroMenuOpened){
        addNewAstro();
    }else if(isTPressed){
        changeTimeScale(event)
    }
}

function keyUpListeners(event){
    if(event.code == 'KeyT'){
        isTPressed = false;
    }
}

function changeTimeScale(event){
    if(event.code == 'ArrowUp'){
        if(timeScale.multiplier<60 && timeScale.multiplier>=1){
            timeScale.multiplier++;
        }else if(timeScale.multiplier<1){
            timeScale.multiplier = Math.pow(Math.pow(timeScale.multiplier,-1)/2,-1)
        }else{
            timeScale.multiplier = 1;
        }
    }else if(event.code == 'ArrowDown'){
        if(timeScale.multiplier>1){
            timeScale.multiplier--;
        }else if(timeScale.multiplier<=1 && timeScale.multiplier > 1/8){
            timeScale.multiplier = Math.pow(Math.pow(timeScale.multiplier,-1)*2,-1)
        }else{
            timeScale.multiplier = 60;
        }
    }else if(event.code == 'ArrowRight'){
        if(timeScale.selectedUnitIndex >= 4){
            timeScale.selectedUnitIndex = 0;
        }else{
            timeScale.selectedUnitIndex++;
        }
    }else if(event.code == 'ArrowLeft'){
        if(timeScale.selectedUnitIndex <= 0){
            timeScale.selectedUnitIndex = 4;
        }else{
            timeScale.selectedUnitIndex--;
        }
    }
    timeScale.timeScale = timeScale.multiplier*convertIndextoTimeScale(timeScale.selectedUnitIndex);
    attTimeScaleHTMLElement();
}

function addNewAstro(){
    createAstro(
        applySpaceScale(newAstroHTMLElements.x.value,1),
        applySpaceScale(-newAstroHTMLElements.y.value,1),
        newAstroHTMLElements.type.selectedIndex-1,
        newAstroHTMLElements.mass.multiplier.value * Math.pow(10, newAstroHTMLElements.mass.exponent.value),
        new Vector(newAstroHTMLElements.velocity.module.value*1000, newAstroHTMLElements.velocity.angle.value*Math.PI/180),
        newAstroHTMLElements.density.value,
        `imagens/${newAstroHTMLElements.type.options[newAstroHTMLElements.type.selectedIndex].value}1.png`
    );
    astroMenu(); 
}



//Main functions
function run(){
    createAstro(applySpaceScale(100,1), applySpaceScale(-400,1), 1, 6e+25, new Vector(2500,Math.PI/2),0,'imagens/telurico1.png');
    createAstro(applySpaceScale(484.4,1), applySpaceScale(-400,1), 0, 7.36e+22, new Vector(1000,Math.PI),0,'imagens/joviano2.png');
    createAstro(applySpaceScale(-284.4,1), applySpaceScale(-400,1), 0, 7.36e+26, new Vector(500,Math.PI),0,'imagens/joviano1.png');
    attSpaceScaleHTMLElement();
    attTimeScaleHTMLElement();
}

function simulate(){
    attAccelerationsVectors();
    for(let astro in astros.object){
        astros.object[astro].applyPhysics(isPrecisionMode ? precisionUnit : timeScale.timeScale/30);
    }
    inelasticCollision();
    attAstrosFigure();
    if(isSimulating) setTimeout(simulate, (isPrecisionMode ? precisionUnit*1000/timeScale.timeScale : 1000/30));
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
    createAstro(x, y, -1, mass, velocityVector, mass / volume, 'imagens/custom1.png');
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

//Auxiliar functions
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

function convertIndextoTimeScale(unitIndex){
    let timeUnits = [1,60,60,24,365.25]
    let unitInSeconds = 1;
    for(let unit = 0; unit <= unitIndex; unit++){
        unitInSeconds *= timeUnits[unit]
    }
    return unitInSeconds;
}

function animateHTML(element, keyFrames, duration, isPermanent, finish){
    let animation = element.animate(keyFrames,duration);
    if(isPermanent){
        animation.addEventListener('finish', finish);
    }
}

//DOM-related functions
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

function attTimeScaleHTMLElement(){
    let timeUnits = ['segundo','minuto','hora','dia','ano'];
    timeScaleHTMLElement.innerHTML = `1 seg : ${
        timeScale.multiplier < 1 ? '1'.sup() + '/' + (Math.pow(2,(Math.log2(timeScale.multiplier)*-1))).toString().sub() : timeScale.multiplier
    } ${timeScale.multiplier<0.5 ? ' de ' : '' }${timeUnits[timeScale.selectedUnitIndex]}${timeScale.multiplier>1 ? 's' : ''}`
}

function toggleOptions(){
    isOptionOpen = !isOptionOpen;
    isSimulating = false;
    optionsMenuHTMLElement.style.display = isOptionOpen ? 'flex' : 'none'
}

function precisionMode(){
    isPrecisionMode = !isPrecisionMode;
    precisionModeHTMLElement.src = `imagens/icons/${isPrecisionMode?'':'un'}checkedCheckbox.png`
    document.querySelector('p#precisionModeWarning').style.display = isPrecisionMode ? 'flex' : 'none' ;
}

function attPrecisionUnit(){
    precisionUnit = convertIndextoTimeScale(precisionUnitsHTMLSelect.selectedIndex);
}

function astroMenu(){
    isSimulating = false;
    isAddAstroMenuOpened = !isAddAstroMenuOpened;
    if(isAddAstroMenuOpened){
        animateHTML(addAstroButtonHTMLElement,[{top: '92vh'}], 500, true, ()=>{addAstroButtonHTMLElement.style.top = '92vh'});
        animateHTML(addAstroMenuHTMLElement,[{top: '10vh'}], 500, true, ()=>{addAstroMenuHTMLElement.style.top = '10vh'})
        animateHTML(document.querySelector('div#addAstroButton img'),[{transform: 'rotate(45deg)'}], 500, true, ()=>{document.querySelector('div#addAstroButton img').style.transform = 'rotate(45deg)'});
        resetTargetPosition();
        resetNewAstroMenu();
    }else{
        resetTargetPosition();
        animateHTML(addAstroButtonHTMLElement,[{top: '10vh'}], 500, true, ()=>{addAstroButtonHTMLElement.style.top = '10vh'});
        animateHTML(addAstroMenuHTMLElement,[{top: '-92.4vh'}], 500, true, ()=>{addAstroMenuHTMLElement.style.top = '-92.4vh'})
        animateHTML(document.querySelector('div#addAstroButton img'),[{transform: 'rotate(0deg)'}], 500, true, ()=>{document.querySelector('div#addAstroButton img').style.transform = 'rotate(0deg)'});
    }
    
}

function resetTargetPosition(){
    newAstroHTMLElements.target.style.display =  isAddAstroMenuOpened? 'block' : 'none'
    newAstroHTMLElements.target.style.left = `${-16}px`
    newAstroHTMLElements.target.style.top = `${-16}px`
}

function attTargetPosition(){
    newAstroHTMLElements.target.style.left = `${newAstroHTMLElements.x.value - 16}px`
    newAstroHTMLElements.target.style.top = `${newAstroHTMLElements.y.value - 16}px`
}

function attDensityInput(){
    let predefinedDensities = [1000, 5000];
    let typeSelected = newAstroHTMLElements.type.selectedIndex - 1;
    console.log(typeSelected)
    if(typeSelected >= 0){
        newAstroHTMLElements.density.value = predefinedDensities[typeSelected];
        newAstroHTMLElements.density.disabled = true;
    }else{
        newAstroHTMLElements.density.disabled = false;
    }
}

function attAstroVectorDemonstration(){
    let newAngle = newAstroHTMLElements.velocity.angle.value  
    let deltaAngle = Math.abs(newAngle - newAstroHTMLElements.velocity.inputtedAngle);
    animateHTML(
        newAstroHTMLElements.velocity.demonstration,
        [{transform: `rotate(${-newAngle}deg)`}],
        (deltaAngle < 1080 ? deltaAngle*5 : 1000), 
        true,
        ()=>{newAstroHTMLElements.velocity.demonstration.style.transform = `rotate(${-newAngle}deg)`;}
    );
    newAstroHTMLElements.velocity.inputtedAngle = newAngle;
}

function resetNewAstroMenu(){
    newAstroHTMLElements.x.value = 0; 
    newAstroHTMLElements.y.value = 0;
    newAstroHTMLElements.mass.multiplier.value = 1;
    newAstroHTMLElements.mass.exponent.value = 24;
    newAstroHTMLElements.type.selectedIndex = 1; 
    attDensityInput(); 
    newAstroHTMLElements.velocity.module.value = 0
    newAstroHTMLElements.velocity.angle.value = 0;
    newAstroHTMLElements.velocity.demonstration.style.transform = 'rotate(0deg)';
}

function addNewAstroDown(){
    newAstroHTMLElements.confirm.style.boxShadow = '-1px -1px 2px rgba(255,255,255,.7)'
}

function addNewAstroUp(){
    newAstroHTMLElements.confirm.style.boxShadow = '1px 1px 2px rgba(255,255,255,.7)'
}
