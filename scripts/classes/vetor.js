/**
 * @description Classe cria um objeto Astro para o Simulador 2D
 * @author Vinicius Gonçalves Perillo --> https://github.com/ViniciusPerillo
 */
export class Vector{
    /**
     * @description Cria a instância de Vetor
     * @param {number} module 
     * @param {number} angle radianos
     */
    constructor(module, angle){
        this.setModule = module;
        this.setAngle = angle;
    }
    
    /**
     * @description Realiza uma soma vetorial 
     * @param {Vector []} vectors 
     */
    static vectorSum(vectors){
        let sumVectors = {x: 0, y: 0}
        for(let vector in vectors){
            sumVectors.x += vectors[vector].getXaxisProjectionModule;
            sumVectors.y += vectors[vector].getYaxisProjectionModule;
        }
        return new Vector(Math.hypot(sumVectors.x,sumVectors.y), Math.atan2(sumVectors.y,sumVectors.x));
    }

    /**
     * @description Define o módulo do vetor
     * @param {number} module 
     */
    set setModule(module){
        this.module = module;
    }

    /**
     * @description Define o ângulo do vetor 
     * @param {number} angle radianos
     */
    set setAngle(angle){
        this.angle = angle;
    }

    /**
     * @description Retorna o modulo do vetor
     */
    get getModule(){
        return this.module;
    }
    
    /**
     * @description Retorna o modulo da projeção do vetor no eixo x
     */
    get getXaxisProjectionModule(){
        return this.module*Math.cos(this.angle);
    }

    /**
     * @description Retorna o modulo da projeção do vetor no eixo x
     */
    get getYaxisProjectionModule(){
        return this.module*Math.sin(this.angle);
    }

    /**
     * @description Retorna o ângulo do vetor em radianos
     */
    get getAngle(){
        return this.angle;
    }

    get isNull(){
        return this.module == 0;
    }
}