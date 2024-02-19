
export class Argument {
    static Type = {
        String: 'String',
        Number: 'Number',
        Service: 'Service',
        Func: 'Function',
        Object: 'Object',
        EnvVar: 'EnvVar'
    }

    constructor(value) {
        this.value = value
        this.type = ''
        this.checkArgumentType(value)
    }

    getArgumentStringType(arg) {
        if (this.isService(arg)) return Argument.Type.Service
        else if (this.isEnvVar(arg)) return Argument.Type.EnvVar
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
                this.type = Argument.Type.object
                break;

            case 'function':
                this.type = Argument.Type.Func
                break;

            default:
                throw new Error('')
        }
    }

    isService(arg) {
        return arg.startsWith('@')
    }

    isEnvVar(arg) {
        return arg.startsWith('$env(')
    }
}
