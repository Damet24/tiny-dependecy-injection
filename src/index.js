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

export class NewsletterManager {}

export class NewsletterManagerFactory {
    static createNewsletterManager(test) {
        console.log(test)
        let newsletterManager = new NewsletterManager()
        return newsletterManager
    }
}

const container = new ContainerBuilder()
container.register('service2', Service2)


container.register('service1', Service1)
    .addArgument('@service2')
    .addArgument('tu puta madre')
    .addArgument('$env(OS)')
    .asSingleton()

container.register('factory', NewsletterManagerFactory, 'createNewsletterManager')
    .addArgument('tu puta madre')

const service1 = container.get('service1')
const service2 = container.get('factory')
console.log(service2)
service1.test()
