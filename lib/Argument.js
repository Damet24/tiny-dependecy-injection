import { ArgumentTypeNotExistsError, EnvironmentVaribaleNotExistsError, ParseEnvironmentVaribaleError } from './errors.js'

export class Argument {
    static Type = {
        String: 'String',
        Number: 'Number',
        Service: 'Service',
        Func: 'Function',
        Object: 'Object',
        EnvVar: 'EnvVar'
    }

    constructor(value, context) {
        this.value = value
        this.type = ''
        this.context = context
        this.checkArgumentType(value)
    }

    getArgumentStringType() {
        if (this.isService()) return Argument.Type.Service
        else if (this.isEnvVar()) return Argument.Type.EnvVar
        else return Argument.Type.String
    }

    checkArgumentType(arg) {
        const type = typeof arg
        switch (type) {
            case 'string':
                const type = this.getArgumentStringType(arg)
                this.type = type
                break;

            case 'number':
                this.type = Argument.Type.Number
                break;

            case 'object':
                this.type = Argument.Type.Object
                break;

            case 'function':
                this.type = Argument.Type.Func
                break;

            default:
                throw new ArgumentTypeNotExistsError()
        }
    }

    isService() {
        return this.value.startsWith('@')
    }

    isEnvVar() {
        return this.value.startsWith('$env(')
    }

    resolveArgByType() {
        let resolvedArg = null
        switch (this.type) {
            case Argument.Type.Service:
                resolvedArg = this.resolveService()
                break;

            case Argument.Type.EnvVar:
                resolvedArg = this.resolveEnvVar()
                break;
        
            default:
                resolvedArg = this.value
                break;
        }
        return resolvedArg
    }

    resolveService() {
        return this.context.get(this.value.slice(1).trim())
    }

    resolveEnvVar() {
        var resultado = this.value.match(/\$env\((.*?)\)/)
        if (resultado) {
            const envVar = process.env[resultado[1]]
            if(envVar) return envVar;
            throw new EnvironmentVaribaleNotExistsError(resultado[1])
        } else {
            throw new ParseEnvironmentVaribaleError(resultado[1])
        }
    }
}
