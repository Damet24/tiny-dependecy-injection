import { ContainerBuilder } from './ContainerBuilder.js'

class Service1 {
    constructor(service2, text, os) {
        this.service2 = service2
        this.text = text
        this.os = os
    }
    test() {
        console.log('Sys:', this.os)
        this.service2.test()
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
    .addArgument('$env(OS)')
    .asSingleton()

container.register('img-manage', context => {
    const img = context.resolve('@service2')
    return new ImageManage(img)
})

const service1 = container.get('service1')
// console.log(process.env)
service1.test()
