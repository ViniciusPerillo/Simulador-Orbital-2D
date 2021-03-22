import {Vector} from './vetor.js'
/**
 * @description Classe cria um objeto Astro para o Simulador 2D
 * @author Vinicius Gonçalves Perillo --> https://github.com/ViniciusPerillo
 */
export class Astro{
    /**
     * @description Cria uma instância de Astro
     * @param {number} x m
     * @param {number} y m
     * @param {0|1} type 
     * @param {number} mass Kg
     * @param {Vector} initialVelocity velocidade inicial do astro
     */
    constructor(x, y, type, mass, initialVelocity){
        this.setX = x;
        this.setY = y;
        this.setType = type;
        this.setMass = mass;
        this.setVelocityVector = initialVelocity;
    }

    setPosition(x,y){
        this.setX = x;
        this.setY = y;
    }

    applyPhysics(time){
        if(this.getVelocityVector.isNull){
            this.getVelocityVector.setAngle = this.getAccelerationVector.getAngle;
            this.setCentripetalAccelerationVector = new Vector(0,0);
            this.setTangencialAccelerationVector = this.getAccelerationVector;
            console.log('opa')
        }else{
            this.setCentripetalAcceleration();
            this.setTangencialAcceleration();
        }
        this.setPosition(
            positionTimeEquation(this.getX, this.velocityVector.getXaxisProjectionModule, this.getTangencialAccelerationVector.getXaxisProjectionModule, time),
            positionTimeEquation(this.getY, this.velocityVector.getYaxisProjectionModule, this.getTangencialAccelerationVector.getYxisProjectionModule, time)
        )
        this.attVelocityVector(time);
    }
   
    
    

    /**
     * @description  
     * @private
     */
    setCentripetalAcceleration(){
        let angle = this.getVelocityVector.getAngle + Math.PI/2*this.orbitDirection();
        let module = Math.cos(Math.abs(this.getAccelerationVector.getAngle - angle))*this.getAccelerationVector.getModule
        this.setCentripetalAccelerationVector = new Vector(module, angle);
    }
    
    /**
     * @description  
     * @private
     */
    setTangencialAcceleration(){
        this.setTangencialAccelerationVector = new Vector(
            Math.sin(Math.abs(this.getAccelerationVector.getAngle - this.getCentripetalAccelerationVector.getAngle))*this.movementType(),
            this.getVelocityVector.getAngle
        )
    }
    
    /**
     * @description  
     * @private
     */
    attVelocityVector(time){  
        let angle = this.getVelocityVector.getAngle;
        if(!this.getVelocityVector.isNull){
            angle += (time * this.getCentripetalAccelerationVector.getModule / this.getVelocityVector.getModule)*this.orbitDirection();
        }
        let module = velocityTimeEquation(this.getVelocityVector.getModule, this.getTangencialAccelerationVector.getModule, time);
        this.setVelocityVector = new Vector(module,angle);
    }

    orbitDirection(){
        return signal(Math.sin(this.getAccelerationVector.getAngle - this.getVelocityVector.getAngle));
    }

    movementType(){
        return signal(this.getCentripetalAccelerationVector.getAngle - this.getAccelerationVector.getAngle);
    }

    /**
     * @description Define a posição do astro no eixo x
     * @param {number} x m
     */
    set setX(x){
        this.x = x;
    }

    /**
     * @description Define a posição do astro no eixo y
     * @param {number} y m
     */
    set setY(y){
        this.y = y;
    }

    /**
     * @description Define o tipo de astro( Joviano = 0, Telúrico = 1) e sua densidade baseada nisso. Fonte: http://astroweb.iag.usp.br/~dalpino/AGA215/NOTAS-DE-AULA/SSolar-Bete.pdf
     * @param {0|1} tipo
     */
    set setType(tipo){
        switch(tipo){
            case 0: 
                this.density = 1000;
                break;
            case 1: 
                this.density = 5000;
                break;
        }
        this.type = tipo;
    }

    /**
     * @description Define a massa do astro e seu raio, baseado na relação(d=m/V e V_sphere=4πr³/3)
     * @param {number} mass Kg
     */
    set setMass(mass){
        this.mass = mass;
        this.radius = Math.pow((3*this.mass)/(4*Math.PI*this.density),1/3);
    }

    /**
     * @description Define o vetor aceleração do astro
     * @param {Vector} acceleration
     */
    set setAccelerationVector(acceleration){
        this.accelerationVector = acceleration;
    }

    /**
     * @description define o vetor aceleração centrípeta
     * @param {Vector} centripetalA
     * @private
     */
     set setCentripetalAccelerationVector(centripetalA){
        this.centripetalAccelerationVector = centripetalA;
    }

    /**
     * @description define o vetor aceleração tangencial
     * @param {Vector} tangencialA
     * @private
     */
    set setTangencialAccelerationVector(tangencialA){
        this.tangencialAccelerationVector = tangencialA;
    }

    /**
     * @description define o Vector velocidade
     * @param {Vector} velocity
     */
    set setVelocityVector(velocity){
        this.velocityVector = velocity;
    }

    /**
     * @description retorna a posição do astro no eixo x em Km
     */
    get getX(){
        return this.x;
    }
    
    /**
     * @description retorna a posição do astro no eixo y em Km
     */
    get getY(){
        return this.y;
    }

    /**
     * @description retorna a posição do astro no eixo y do plano cartesiano em Km
     */
    get getCartesianY(){
        return this.y*(-1);
    }

    /**
     * @description retorna o raio do astro em Km
     */
    get getRadius(){
        return this.radius;
    }

    /**
     * @description retorna a massa do astro em Kg
     */
    get getMass(){
        return this.mass;
    }

    /**
     * @description retorna o tipo numérico do astro
     */
    get getNumberOfType(){
        return this.type;
    }

    /**
     * @description retorna o tipo do astro
     */
    get getNameOfType(){
        switch(this.type){
            case 0:
                return 'Joviano'
            case 1:
                return 'Telúricos'
        }
    }

    /**
     * @description retorna o Vector da aceleração resultante atuando no astro
     */
    get getAccelerationVector(){
        return this.accelerationVector;
    }

    /**
     * @description retorna o vetor da aceleração centrípeta atuando no astro
     */
    get getCentripetalAccelerationVector(){
        return this.centripetalAccelerationVector;
    }

    /**
     * @description retorna o vetor da aceleração tangencial atuando no astro
     */
    get getTangencialAccelerationVector(){
        return this.tangencialAccelerationVector;
    }

    /**
     * @description retorna o vetor da velocidade resultando atuando no astro
     */
    get getVelocityVector(){
        return this.velocityVector;
    }
}

function signal(targetNumber){
    if(targetNumber != 0){
        return targetNumber/Math.abs(targetNumber);
    }else{
        return 0;
    }
}

function positionTimeEquation(s0, v0, a, t){
    return s0 + v0*t + a*Math.pow(t,2)/2;
}

function velocityTimeEquation(v0, a, t){
    return v0 + a*t;
}