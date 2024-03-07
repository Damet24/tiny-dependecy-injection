
export class ArgumentTypeNotExistsError extends Error {
    constructor(message) {
        super(message ?? 'ArgumentTypeNotExistsError')
        this.name = 'ArgumentTypeNotExistsError'
    }
}

export class EnvironmentVariableNotExistsError extends Error {
    constructor(varName) {
        const message = `the environment variable with the name '${varName}' does not exist`
        super(message)
        this.name = 'EnvironmentVariableNotExistsError'
    }
}

export class ParseEnvironmentVariableError extends Error {
    constructor(varName) {
        const message = `error when trying to parse an environment variable: ${varName}`
        super(message)
        this.name = 'ParseEnvironmentVariableError'
    }
}

export class ComponentIsNotRegisterError extends Error {
    constructor(message = 'ComponentIsNotRegisterError') {
        super(message)
        this.name = 'ComponentIsNotRegisterError'
    }
}

export class ArgumentNullError extends Error {
    constructor(message = 'ArgumentNullError') {
        super(message)
        this.name = 'ArgumentNullError'
    }
}