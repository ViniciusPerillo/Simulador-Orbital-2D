export class Astro{
    /**
     * @description Cria uma instância de Astro
     * @param {number} x Km
     * @param {number} y Km
     * @param {0|1} type 
     * @param {number} mass Kg
     */
    constructor(x, y, type, mass){
        this.setX = x;
        this.setY = y;
        this.setType = type;
        this.setMass = mass;
    }

//Setters-------------------------------------------------------------------------------------------------------------------------------
    /**
     * @description Define a posição do astro no eixo x
     * @param {number} x Km
     */
    set setX(x){
        this.x = x;
    }

    /**
     * @description Define a posição do astro no eixo y
     * @param {number} y Km
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
        this.radius = Math.pow((3*this.mass)/(4*Math.PI*this.density),1/3)/1000;
    }

    set setAccelerationVector(acceleration){
        this.accelerationVector = acceleration;
    }

    set setCentripetalAccelerationVector(centripetalA){
        this.centripetalAccelerationVector = centripetalA;
    }

    set setTangencialAccelerationVector(tangencialA){
        this.tangencialAccelerationVector = tangencialA;
    }

    set setVelocityVector(velocity){
        this.velocityVector = velocity;
    }

//Getters-------------------------------------------------------------------------------------------------------------------------------
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
     * @description retorna o vetor da aceleração resultante atuando no astro
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
        return this.getTangencialAccelerationVector;
    }

    /**
     * @description retorna o vetor da velocidade resultando atuando no astro
     */
    get getVelocityVector(){

    }
}