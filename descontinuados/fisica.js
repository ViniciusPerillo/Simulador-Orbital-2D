/**
 * @description Uma classe com formulas e constantes fisicas, como Math para matematica.
 */
export class Fisica{
    /**
     * @returns Retorna a Constante Gravitacional Universal: 6.674184e-11
     */
    get G(){
        return 6.674184e-11;
    }

    /**
     * @description Realiza a fómula função horária de primeiro grau da física. Ela pode ser feita usando qualquer um dos quatro elementos como incógtita, basta passar null como o parâmetro da incógnita.
     * 
     * Ex: Desesejo encontrar o s: funcaoHorariaPrimeiroGrau(null, number, number, number)
     * @param {number | null} s 
     * @param {number | null} s0 
     * @param {number | null} v 
     * @param {number | null} t 
     */
    static funcaoHorariaPrimeiroGrau(s, s0, v, t){
        if(isValidAritimeticParamaters(s,[s0,v,t])){
            return s0 + v*t;
        }else if(isValidAritimeticParamaters(s0, [s0,v,t])){
            return s - v*t;
        }else if(isValidAritimeticParamaters(v,[s,s0,t])){
            return (s-s0)/t;
        }else if(isValidAritimeticParamaters(t,[s,s0,v])){
            return (s-s0)/v;
        }else{
            throw INVALID_PARAMATERS;
        }
            
    }
    
    /**
     * @description Realiza a fómula função horária de segundo grau da física. Ela pode ser feita usando qualquer um dos quatro elementos como incógtita, basta passar null como o parâmetro da incógnita.
     * 
     * Ex: Desesejo encontrar o s: funcaoHorariaPrimeiroGrau(null, number, number, number, number)
     * @param {number | null} s 
     * @param {number | null} s0 
     * @param {number | null} v0 
     * @param {number | null} a 
     * @param {number | null} t  
     */
    static funcaoHorariaSegundoGrau(s, s0, v0, a, t){
        if(isValidAritimeticParamaters(s,[s0,v0,a,t])){
            return s0 + v0*t + a*Math.pow(t,2)*0.5;
        }else if(isValidAritimeticParamaters(s0,[s,v0,a,t])){
            return s - v0*t - a*Math.pow(t,2)*0.5;
        }else if(isValidAritimeticParamaters(v0,[s0,s,a,t])){
            return (s-s0)/t - a*t*0.5;
        }else if(isValidAritimeticParamaters(a,[s0,v0,s,t])){
            return 2*(s-s0-v0*t)/Math.pow(t,2);
        }else if(isValidAritimeticParamaters(t,[s0,v0,a,s])){
            return this.bhaskara(a/2,v0,(s0-s));
        }else{
            throw INVALID_PARAMATERS;
        }
    }

    /**
     * @description Resolve uma esquação de segundo grau. Retornando os valores de x
     * @param {number} a 
     * @param {number} b 
     * @param {number} c 
     */
    static bhaskara(a,b,c){
        let delta = Math.pow(b,2)-4*a*c
        if(delta < 0){
            return NaN;
        }else if(delta == 0){
            return -b/2*a;
        }else{
            return [(-b + Math.sqrt(delta))/2*a,(-b - Math.sqrt(delta))/2*a];
        }
    }
}

const INVALID_PARAMATERS = new Error('Parâmetros Inválidos')

/**
 * @description testa se apena uma inconita foi passada.
 * @param {*[]} unknownVariable 
 * @param {*} knownVariables 
 */
function isValidAritimeticParamaters(unknownVariable, knownVariables){
    let isValid = unknownVariable == null;
    for(let i in knownVariables){
        isValid = isValid && typeof knownVariables[i] == 'number';
    }
    return isValid;
}