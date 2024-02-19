import { Componet } from "./Component.js"

export class ContainerBuilder {
    constructor() {
        this.componets = []
        this.factories = []
    }

    register(key, value, functionName = undefined) {
        const component = new Componet(value, functionName, this)
        this.addComponent(key, component)
        return component
    }

    resolve(service) {
        return this.get(service)
    }

    findComponent(key) {
        const result = this.componets.find(item => item.key === key)
        if (result === undefined) return
        return this.componets.find(item => item.key === key).component
    }

    findComponentOrFactory(key) {

    }

    get(key) {
        const component = this.findComponent(key)
        return component.getInstance()
    }

    addComponent(key, component) {
        this.componets.push({ key, component })
    }
}