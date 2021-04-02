//Imports
import {Figure} from './classes/figure.js';
import {Astro} from './classes/astro.js';
import {Vector} from './classes/vetor.js';

//Variables

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
let precisionUnit;
let mousePosition = {
    x: null,
    y: null,
}
let selectedAstro;
let isSimulating = false;
let isDraggable = false;
let isOptionOpen = false;
let isPrecisionMode = false;
let isAddAstroMenuOpened = false;
let isMouseOverNewAstroMenu = false;
let isDescriptionMenuOpened = false;
let isTPressed = false;

const HTML_ELEMENTS = {
    scales: {
        space: document.querySelector('div#spaceScale'), 
        time: document.querySelector('div#timeScale') 
    },
    menus:{
        options: {
            window: document.querySelector('article#options'), 
            precisionMode: {
                checkbox: document.querySelector('label#precisionMode span img'), 
                select: document.getElementById("units") 
            }
        },
        addAstro: {
            button: document.querySelector('div#addAstroButton'), 
            window: document.querySelector('article#addAstroMenu'), 
            elements: { 
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
            },
            preset:{
                menu: document.querySelector('div#presetButtons'),
                earthMoon: document.querySelector('div#earthMoon'),
                massCenter: document.querySelector('div#massCenter'),
                colision: document.querySelector('div#colision'),
                binarySistem: document.querySelector('div#binarySistem')
            }
        },
        description: {
            button: document.querySelector('div#moreButton'),
            delete: document.querySelector('div#delete'),
            window: document.querySelector('article#descriptionMenu')
        }
    }
}

//DOM Events
document.addEventListener('DOMContentLoaded', run);  
document.addEventListener('mousedown', (event)=>{if(!isOptionOpen) unlockDrag(event)});
document.addEventListener('mousemove', (event)=>{if(isDraggable && !isAddAstroMenuOpened) drag(event)});
document.addEventListener('mouseup', lockDrag);
document.addEventListener('wheel', (event)=>{if(!isOptionOpen && !isAddAstroMenuOpened) zoom(event)});
document.addEventListener('keydown', (event)=>{keyDownListeners(event)});
document.addEventListener('keyup',(event)=>{keyUpListeners(event)});
HTML_ELEMENTS.menus.options.precisionMode.checkbox.addEventListener('click', precisionMode);
HTML_ELEMENTS.menus.options.precisionMode.select.addEventListener('change', attPrecisionUnit);
HTML_ELEMENTS.menus.addAstro.button.addEventListener('click',()=>{if(!isOptionOpen) addAstroMenu()})
HTML_ELEMENTS.menus.addAstro.window.addEventListener('mouseenter',()=>{isMouseOverNewAstroMenu = true});
HTML_ELEMENTS.menus.addAstro.window.addEventListener('mouseleave',()=>{isMouseOverNewAstroMenu = false});
HTML_ELEMENTS.menus.addAstro.elements.x.addEventListener('input',attTargetPosition);
HTML_ELEMENTS.menus.addAstro.elements.y.addEventListener('input',attTargetPosition);
HTML_ELEMENTS.menus.addAstro.elements.type.addEventListener('change', attDensityInput);
HTML_ELEMENTS.menus.addAstro.elements.velocity.angle.addEventListener('input',attAstroVectorDemonstration);
HTML_ELEMENTS.menus.addAstro.elements.confirm.addEventListener('click',addNewAstro);
HTML_ELEMENTS.menus.addAstro.elements.confirm.addEventListener('mousedown',addNewAstroDown);
HTML_ELEMENTS.menus.addAstro.elements.confirm.addEventListener('mouseup',addNewAstroUp);
HTML_ELEMENTS.menus.addAstro.preset.earthMoon.addEventListener('click', presetEarthMoon);
HTML_ELEMENTS.menus.addAstro.preset.massCenter.addEventListener('click', presetMassCenter);
HTML_ELEMENTS.menus.addAstro.preset.colision.addEventListener('click', presetColision);
HTML_ELEMENTS.menus.addAstro.preset.binarySistem.addEventListener('click', presetBinarySistem);
HTML_ELEMENTS.menus.description.button.addEventListener('click', descriptionMenu);
HTML_ELEMENTS.menus.description.delete.addEventListener('click', ()=>{deleteAstro(selectedAstro);})



//Listeners
/**
 * @description desbloqueia a função arrastar os astros
 * @param {MouseEvent} event 
 */
function unlockDrag(event){
    isDraggable = true;
    setMousePosition(event);
    if(!isMouseOverNewAstroMenu){
        HTML_ELEMENTS.menus.addAstro.elements.x.value = mousePosition.x;
        HTML_ELEMENTS.menus.addAstro.elements.y.value = mousePosition.y;
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
    document.querySelector('div#barrier').style.display = 'block'
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
            addAstroMenu();
        }else if(selectedAstro != undefined){
            unselectAstro();
        }else{
            toggleOptions();
        }
    }else if(event.code == 'KeyT' && !isOptionOpen){
        isTPressed = true;
    }else if(event.code == 'Equal' && !isAddAstroMenuOpened){
        addAstroMenu();
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
        applySpaceScale(HTML_ELEMENTS.menus.addAstro.elements.x.value,1),
        applySpaceScale(-HTML_ELEMENTS.menus.addAstro.elements.y.value,1),
        HTML_ELEMENTS.menus.addAstro.elements.type.selectedIndex-1,
        HTML_ELEMENTS.menus.addAstro.elements.mass.multiplier.value * Math.pow(10, HTML_ELEMENTS.menus.addAstro.elements.mass.exponent.value),
        new Vector(HTML_ELEMENTS.menus.addAstro.elements.velocity.module.value*1000, HTML_ELEMENTS.menus.addAstro.elements.velocity.angle.value*Math.PI/180),
        HTML_ELEMENTS.menus.addAstro.elements.density.value,
        ''
    );
    addAstroMenu(); 
}



//Main functions
function run(){
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
    let distanceBetweenThem = Math.hypot(astros.object[astro1].getX - astros.object[astro2].getX, astros.object[astro1].getY - astros.object[astro2].getY);
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
    createAstro(x, y, -1, mass, velocityVector, mass / volume, '');
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
    astros.figure[newAstroIndex].getFigure.addEventListener('dblclick',(event)=>{selectAstro(event)})
    attAstrosFigure();
}

function deleteAstro(astroIndex){
    astros.object.splice(astroIndex,1);
    document.body.removeChild(astros.figure[astroIndex].getFigure)
    astros.figure.splice(astroIndex,1);
    selectedAstro = undefined;
    unselectAstro();
}

function deleteAll(){
    if(astros.object[0] != undefined){
        deleteAstro(0);
        deleteAll();
    } 
}

function selectAstro(event){
    for(let astro in astros.figure){
        if(astros.figure[astro].getFigure == event.target || astros.figure[astro].getImg == event.target){
            if(selectedAstro != undefined) astros.figure[selectedAstro].getFigure.style.border = 'none'
            selectedAstro = astro;
            astros.figure[selectedAstro].getFigure.style.border = 'double 5px #ffffff'
            HTML_ELEMENTS.menus.description.button.style.display = 'flex'
            HTML_ELEMENTS.menus.description.delete.style.display = 'flex'
            animateHTML(HTML_ELEMENTS.menus.description.button,[{opacity: '1'}], 250, true, ()=>{HTML_ELEMENTS.menus.description.button.style.opacity = '1'})
            animateHTML(HTML_ELEMENTS.menus.description.delete,[{opacity: '1'}], 250, true, ()=>{HTML_ELEMENTS.menus.description.delete.style.opacity = '1'})
            break;
        }
    }
}

function unselectAstro(){
    if(selectedAstro != undefined) astros.figure[selectedAstro].getFigure.style.border = 'none'
    animateHTML(HTML_ELEMENTS.menus.description.button,[{opacity: '0'}], 250, true, ()=>{
        HTML_ELEMENTS.menus.description.button.style.opacity = '0';
        HTML_ELEMENTS.menus.description.button.style.display = 'none';
    })
    animateHTML(HTML_ELEMENTS.menus.description.delete,[{opacity: '0'}], 250, true, ()=>{
        HTML_ELEMENTS.menus.description.delete.style.opacity = '0';
        HTML_ELEMENTS.menus.description.delete.style.display = 'none';
    })
    closeDescriptionMenu();
    selectedAstro = undefined;

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
    HTML_ELEMENTS.scales.space.innerHTML = `1 px  :  ${
        (spaceScale/Math.pow(10,Math.floor(Math.log10(spaceScale)))).toFixed(1)
    } × 10${
        (Math.floor(Math.log10(spaceScale))-3).toString().sup()
    } Km`
}

function attTimeScaleHTMLElement(){
    let timeUnits = ['segundo','minuto','hora','dia','ano'];
    HTML_ELEMENTS.scales.time.innerHTML = `1 seg : ${
        timeScale.multiplier < 1 ? '1'.sup() + '/' + (Math.pow(2,(Math.log2(timeScale.multiplier)*-1))).toString().sub() : timeScale.multiplier
    } ${timeScale.multiplier<0.5 ? ' de ' : '' }${timeUnits[timeScale.selectedUnitIndex]}${timeScale.multiplier>1 ? 's' : ''}`
}

function toggleOptions(){
    isOptionOpen = !isOptionOpen;
    isSimulating = false;
    HTML_ELEMENTS.menus.options.window.style.display = isOptionOpen ? 'flex' : 'none'
}

function precisionMode(){
    isPrecisionMode = !isPrecisionMode;
    HTML_ELEMENTS.menus.options.precisionMode.checkbox.src = `imagens/icons/${isPrecisionMode?'':'un'}checkedCheckbox.png`
    document.querySelector('p#precisionModeWarning').style.display = isPrecisionMode ? 'flex' : 'none' ;
}

function attPrecisionUnit(){
    precisionUnit = convertIndextoTimeScale(HTML_ELEMENTS.menus.options.precisionMode.select.selectedIndex);
}

function addAstroMenu(){
    isSimulating = false;
    if(isAddAstroMenuOpened){
        closeAddAstroMenu()
    }else{
        openAddAstroMenu()
    }
}

function openAddAstroMenu(){
    HTML_ELEMENTS.menus.addAstro.preset.menu.style.display = 'flex';
    animateHTML(HTML_ELEMENTS.menus.addAstro.button,[{top: '92vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.addAstro.button.style.top = '92vh'});
    animateHTML(HTML_ELEMENTS.menus.addAstro.window,[{top: '10vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.addAstro.window.style.top = '10vh'})
    animateHTML(document.querySelector('div#addAstroButton img'),[{transform: 'rotate(45deg)'}], 500, true, ()=>{document.querySelector('div#addAstroButton img').style.transform = 'rotate(45deg)'});
    animateHTML(HTML_ELEMENTS.menus.addAstro.preset.menu,[{opacity: '1'}], 250, true, ()=>{HTML_ELEMENTS.menus.addAstro.preset.menu.style.opacity = '1';})
    resetNewAstroMenu();
    isAddAstroMenuOpened = true;
}

function closeAddAstroMenu(){
    animateHTML(HTML_ELEMENTS.menus.addAstro.button,[{top: '10vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.addAstro.button.style.top = '10vh'});
    animateHTML(HTML_ELEMENTS.menus.addAstro.window,[{top: '-72.4vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.addAstro.window.style.top = '-72.4vh'})
    animateHTML(document.querySelector('div#addAstroButton img'),[{transform: 'rotate(0deg)'}], 500, true, ()=>{document.querySelector('div#addAstroButton img').style.transform = 'rotate(0deg)'});
    animateHTML(HTML_ELEMENTS.menus.addAstro.preset.menu,[{opacity: '0'}], 250, true, ()=>{
        HTML_ELEMENTS.menus.addAstro.preset.menu.style.opacity = '0';
        HTML_ELEMENTS.menus.addAstro.preset.menu.style.display = 'none';
    })
    resetTargetPosition();
    isAddAstroMenuOpened = false;
}

function resetTargetPosition(){
    HTML_ELEMENTS.menus.addAstro.elements.target.style.display =  isAddAstroMenuOpened? 'none' : 'block'
    HTML_ELEMENTS.menus.addAstro.elements.target.style.left = `${-16}px`
    HTML_ELEMENTS.menus.addAstro.elements.target.style.top = `${-16}px`
}

function attTargetPosition(){
    HTML_ELEMENTS.menus.addAstro.elements.target.style.left = `${HTML_ELEMENTS.menus.addAstro.elements.x.value - 16}px`
    HTML_ELEMENTS.menus.addAstro.elements.target.style.top = `${HTML_ELEMENTS.menus.addAstro.elements.y.value - 16}px`
}

function attDensityInput(){
    let predefinedDensities = [1000, 5000];
    let typeSelected = HTML_ELEMENTS.menus.addAstro.elements.type.selectedIndex - 1;
    if(typeSelected >= 0){
        HTML_ELEMENTS.menus.addAstro.elements.density.value = predefinedDensities[typeSelected];
        HTML_ELEMENTS.menus.addAstro.elements.density.disabled = true;
    }else{
        HTML_ELEMENTS.menus.addAstro.elements.density.disabled = false;
    }
}

function attAstroVectorDemonstration(){
    let newAngle = HTML_ELEMENTS.menus.addAstro.elements.velocity.angle.value  
    let deltaAngle = Math.abs(newAngle - HTML_ELEMENTS.menus.addAstro.elements.velocity.inputtedAngle);
    animateHTML(
        HTML_ELEMENTS.menus.addAstro.elements.velocity.demonstration,
        [{transform: `rotate(${-newAngle}deg)`}],
        (deltaAngle < 1080 ? deltaAngle*5 : 1000), 
        true,
        ()=>{HTML_ELEMENTS.menus.addAstro.elements.velocity.demonstration.style.transform = `rotate(${-newAngle}deg)`;}
    );
    HTML_ELEMENTS.menus.addAstro.elements.velocity.inputtedAngle = newAngle;
}

function resetNewAstroMenu(){
    HTML_ELEMENTS.menus.addAstro.elements.x.value = 0; 
    HTML_ELEMENTS.menus.addAstro.elements.y.value = 0;
    HTML_ELEMENTS.menus.addAstro.elements.mass.multiplier.value = 1;
    HTML_ELEMENTS.menus.addAstro.elements.mass.exponent.value = 24;
    HTML_ELEMENTS.menus.addAstro.elements.type.selectedIndex = 1; 
    attDensityInput(); 
    HTML_ELEMENTS.menus.addAstro.elements.velocity.module.value = 0
    HTML_ELEMENTS.menus.addAstro.elements.velocity.angle.value = 0;
    HTML_ELEMENTS.menus.addAstro.elements.velocity.demonstration.style.transform = 'rotate(0deg)';
}

function addNewAstroDown(){
    HTML_ELEMENTS.menus.addAstro.elements.confirm.style.boxShadow = '-1px -1px 2px rgba(255,255,255,.7)'
}

function addNewAstroUp(){
    HTML_ELEMENTS.menus.addAstro.elements.confirm.style.boxShadow = '1px 1px 2px rgba(255,255,255,.7)'
}

function descriptionMenu(){
    isSimulating = false;
    if(isDescriptionMenuOpened){
        closeDescriptionMenu();
    }else{
        openDescriptionMenu();
    }
}

function openDescriptionMenu(){
    animateHTML(HTML_ELEMENTS.menus.description.button,[{top: '92vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.description.button.style.top = '92vh'});
    animateHTML(HTML_ELEMENTS.menus.description.delete,[{top: '92vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.description.delete.style.top = '92vh'});
    animateHTML(HTML_ELEMENTS.menus.description.window,[{top: '10vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.description.window.style.top = '10vh'});
    isDescriptionMenuOpened = true;
}

function closeDescriptionMenu(){
    animateHTML(HTML_ELEMENTS.menus.description.button,[{top: '10vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.description.button.style.top = '10vh'});
    animateHTML(HTML_ELEMENTS.menus.description.delete,[{top: '10vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.description.delete.style.top = '10vh'});
    animateHTML(HTML_ELEMENTS.menus.description.window,[{top: '-72.4vh'}], 500, true, ()=>{HTML_ELEMENTS.menus.description.window.style.top = '-92.4vh'});
    isDescriptionMenuOpened = false;
}

//Presets

function presetEarthMoon(){
    deleteAll();
    closeAddAstroMenu();
}

function presetMassCenter(){
    deleteAll();
    closeAddAstroMenu();
}

function presetColision(){
    deleteAll();
    createAstro(applySpaceScale(300,1), applySpaceScale(-300,1), 1, 6e+24, new Vector(1000, Math.PI/4), 0,'');
    createAstro(applySpaceScale(300,1), applySpaceScale(-600,1), 1, 6e+24, new Vector(1000, 7*Math.PI/4), 0,'');
    createAstro(applySpaceScale(1150,1), applySpaceScale(-450,1), 0, 2e+24, new Vector(500, Math.PI), 0,'');
    timeScale.multiplier = 12 
    timeScale.selectedUnitIndex = 2 
    timeScale.timeScale = 12*60*60
    attTimeScaleHTMLElement();
    closeAddAstroMenu();
}

function presetBinarySistem(){
    deleteAll();
    closeAddAstroMenu();
}