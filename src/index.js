
class ContainerBuilder {
    constructor() {
        this.componets = []
    }

    register(key, value) {
        if(typeof value === 'function' && value.name.length === 0) {
            const instance = value(this)
            console.log(Object.getPrototypeOf(instance), instance)
            const component = new Componet()
            this.addComponent(key, component)
            return component
        }
        else {
            const component = new Componet(value)
            this.addComponent(key, component)
            return component
        }
    }

    resolve(service) {
        return this.get(service)
    }

    resolveArgs(args) {
        if(args === undefined || args.length === 0) return
        return args.map(arg => {
            if (arg.type === Argument.Type.Service)
                return this.get(arg.value.slice(1).trim())
            return arg.value
        })
    }

    get(key) {
        const result = this.componets.find(item => item.key === key)
        if(result === undefined) return
        const component = this.componets.find(item => item.key === key).component
        const args = this.resolveArgs(component.arguments)
        if (args === undefined)
            return new component.object()
        return new component.object(...args)
    }

    addComponent(key, component) {
        this.componets.push({ key, component })
    }
}

class Componet {
    constructor(object) {
        this.arguments = []
        this.object = object
    }

    addArgument(argument) {
        const arg = new Argument(argument)
        this.arguments.push(arg)
        return this
    }
}

class Argument {
    static Type = {
        String: 'String',
        Number: 'Number',
        Service: 'Service',
        Func: 'Function',
        Object: 'Object'
    }

    constructor(value) {
        this.value = value
        this.type = ''
        this.checkArgumentType(value)
    }

    checkArgumentType(arg) {
        const type = typeof arg

        switch (type) {
            case 'string':
                const type = this.isService(arg) ? Argument.Type.Service : Argument.Type.String
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
}

class Service1 {
    constructor(service2, text) {
        this.service1 = service2
        this.text = text
    }
    test() {
        console.log(this.text)
        this.service1.test()
    }
}
class Service2 {
    test() {
        console.log('testing service1')
    }
}

class ImageManage {
    constructor(image) {
        this.image = image
    }
}

const container = new ContainerBuilder()
container.register('service2', Service2)


container.register('service1', Service1)
.addArgument('@service2')
.addArgument('tu puta madre')

container.register('img-manage', context => {
    const img = context.resolve('@service2')
    return new ImageManage(img)
})
const service1 = container.get('service1')
service1.test()