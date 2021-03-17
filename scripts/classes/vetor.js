export class Vetor{
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
     * @param {Vetor []} vectors 
     */
    static vectorSum(vectors){
        let sumVectors = {x: 0, y: 0}
        for(let i in vectors){
            sumVectors.x += vectors[i].getVectorXModule;
            sumVectors.y += vectors[i].getVectorYModule;
        }
        return new Vetor(Math.hypot(sumVectors.x,sumVectors.y), Math.atan2(sumVectors.y,sumVectors.x));
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
    get getVectorXModule(){
        return this.module*Math.cos(angle);
    }

    /**
     * @description Retorna o modulo da projeção do vetor no eixo x
     */
    get getVectorYModule(){
        return this.module*Math.sen(angle);
    }

    /**
     * @description Retorna o ângulo do vetor em radianos
     */
    get getAngle(){
        return this.angle;
    }
}