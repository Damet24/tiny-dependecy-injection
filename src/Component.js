import { InyectionType } from './InyectionType.js'
import { Argument } from './Argument.js'

export class Componet {
    static staticInstance = null

    constructor(object, context) {
        this.arguments = []
        this.prototype = object
        this.context = context
        this.inyectionType = InyectionType.Scoped
    }

    addArgument(argument) {
        const arg = new Argument(argument)
        this.arguments.push(arg)
        return this
    }

    asSingleton() {
        this.inyectionType = InyectionType.Singleton
        return this
    }

    asScoped() {
        this.inyectionType = InyectionType.Scoped
        return this
    }

    getInstance() {
        let instance = null
        switch (this.inyectionType) {
            case InyectionType.Scoped:
                instance = this.getScopedInstance()
                break

            case InyectionType.Singleton:
                instance = this.getSingletonInstance()
                break
        }
        return instance
    }

    getScopedInstance() {
        let instance = null
        const args = this.resolveArgs()
        if (args === undefined) instance = new this.prototype()
        else instance = new this.prototype(...args)
        return instance
    }

    getSingletonInstance() { 
        if (Componet.staticInstance === null) {
            const args = this.resolveArgs()
            if (args === undefined) {
                Componet.staticInstance = new this.prototype()
            }
            else {
                Componet.staticInstance = new this.prototype(...args)
            }
            return Componet.staticInstance
        }
        return Componet.staticInstance
    } 

    resolveArgs() {
        if (this.arguments === undefined || this.arguments.length === 0) return
        return this.arguments.map(arg => {
            return this.resolveArgByType(arg)
        })
    }
    
    resolveArgByType(arg) {
        let resolvedArg = null
        switch (arg.type) {
            case Argument.Type.Service:
                resolvedArg = this.resolveService(arg)
                break;

            case Argument.Type.EnvVar:
                resolvedArg = this.resolveEnvVar(arg)
                break;
        
            default:
                resolvedArg = arg.value
                break;
        }
        return resolvedArg
    }

    resolveService(arg) {
        return this.context.get(arg.value.slice(1).trim())
    }

    resolveEnvVar(arg) {
        var resultado = arg.value.match(/\$env\((.*?)\)/)
        if (resultado) {
            const envVar = process.env[resultado[1]]
            if(envVar) return envVar;
            throw Error('')
        } else {
            throw Error('')
        }
    }
}
