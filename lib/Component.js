import { InjectionType } from './InjectionType.js'
import { Argument } from './Argument.js'
import { ArgumentNullError} from './errors.js'

export class Componet {
    static staticInstance = null

    constructor(object, functionName = undefined, context) {
        if (object === undefined) throw new ArgumentNullError('object cannot be null')
        if (context === undefined) throw new ArgumentNullError('context cannot be null')
        this.arguments = []
        this.prototype = object
        this.functionName = functionName
        this.context = context
        this.inyectionType = InjectionType.Scoped
    }

    addArgument(argument) {
        const arg = new Argument(argument, this.context)
        this.arguments.push(arg)
        return this
    }

    asSingleton() {
        this.inyectionType = InjectionType.Singleton
        return this
    }

    asScoped() {
        this.inyectionType = InjectionType.Scoped
        return this
    }

    getInstance() {
        if(this.#isFactory()) return this.#getFactoryFcuntion()
        else return this.#getServiceInstace()
    }

    #getServiceInstace() {
        let instance = null
        switch (this.inyectionType) {
            case InjectionType.Scoped:
                instance = this.#getScopedInstance()
                break

            case InjectionType.Singleton:
                instance = this.#getSingletonInstance()
                break
        }
        return instance
    }

    #isFactory() {
        return this.functionName != undefined
    }

    #getFactoryFcuntion () {
        let obj = null
        const args = this.resolveArgs()
        if (args === undefined) this.prototype[this.functionName]()
        else obj = this.prototype[this.functionName](...args)
        return obj
    }

    #getScopedInstance() {
        let instance = null
        const args = this.resolveArgs()
        if (args === undefined) instance = new this.prototype()
        else instance = new this.prototype(...args)
        return instance
    }

    #getSingletonInstance() { 
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

    /**
     * Resolve all arguments of component
     * @returns {any[]|undefined}
     */
    resolveArgs() {
        if (this.arguments === undefined || this.arguments.length === 0) return undefined
        return this.arguments.map(arg => {
            return arg.resolveArgByType()
        })
    }
}
