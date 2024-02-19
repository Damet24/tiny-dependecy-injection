
export class ArgumentTypeNotExistsError extends Error {
    constructor(message) {
        super(message)
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

