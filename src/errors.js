
export class ArgumentTypeNotExistsError extends Error {
    constructor(message) {
        super(message ?? 'ArgumentTypeNotExistsError')
        this.name = 'ArgumentTypeNotExistsError'
    }
}

export class EnvironmentVaribaleNotExistsError extends Error {
    constructor(varName) {
        const message = `the environment variable with the name '${varName}' does not exist`
        super(message)
        this.name = 'EnvironmentVaribaleNotExistsError'
    }
}

export class ParseEnvironmentVaribaleError extends Error {
    constructor(varName) {
        const message = `error when trying to parse an environment variable: ${varName}`
        super(message)
        this.name = 'ParseEnvironmentVaribaleError'
    }
}

export class ComponetIsNotRegisterError extends Error {
    constructor(message = 'ComponetIsNotRegisterError') {
        super(message)
        this.name = 'ComponetIsNotRegisterError'
    }
}

export class ArgumentNullError extends Error {
    constructor(message = 'ArgumentNullError') {
        super(message)
        this.name = 'ArgumentNullError'
    }
}