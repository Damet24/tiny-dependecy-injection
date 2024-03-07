import { Componet } from "./Component.js"
import { ComponentIsNotRegisterError } from './errors.js'

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
        if (result === undefined) throw new ComponentIsNotRegisterError('ComponetIsNotRegisterError')
        return this.componets.find(item => item.key === key).component
    }

    get(key) {
        const component = this.findComponent(key)
        return component.getInstance()
    }

    addComponent(key, component) {
        this.componets.push({ key, component })
    }
}