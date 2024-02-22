import { expect, test, describe, beforeEach } from 'vitest'
import { Componet } from '../../src/Component.js'
import { ContainerBuilder } from '../../src/ContainerBuilder.js'
import { Argument } from '../../src/Argument.js'

class TestService {
    constructor(arg1, arg2) {
        this.arg1 = arg1
        this.arg2 = arg2
    }
}

class CeateTestFactory {
    static CreateService(arg1) {
        const instance = new TestService(arg1, 'arg2')
        return instance
    }
}

describe('Component', () => {
    test('create component without arguments', () => {
        expect(() => new Componet()).toThrowError(/object cannot be null/)
        expect(() => new Componet({}, undefined)).toThrowError(/context cannot be null/)
    })

    describe('add arguments', () => {
        const container = new ContainerBuilder()
        
        test('add arguments', () => {
            const component = new Componet(TestService, undefined, container)
            component.addArgument('test')
            component.addArgument('test2')
            expect(component.arguments.length).toBe(2)
            expect(component.arguments[0].type).toBe(Argument.Type.String)
            expect(component.arguments[1].type).toBe(Argument.Type.String)
        })

        test('get instance', () => {
            const component = new Componet(TestService, undefined, container)
            const arg1 = 'test'
            const arg2 = 'test2'
            component.addArgument(arg1)
            component.addArgument(arg2)
            expect(component.arguments.length).toBe(2)
            const resolvedComponent = component.getInstance()
            expect(resolvedComponent).toBeInstanceOf(TestService)
            expect(resolvedComponent.arg1).toBe(arg1)
            expect(resolvedComponent.arg2).toBe(arg2)
        })

        test('create service from factory', () => {
            const component = new Componet(CeateTestFactory, 'CreateService', container)
            const arg1 = 'test'
            component.addArgument(arg1)
            expect(component.arguments.length).toBe(1)
            const resolvedComponent = component.getInstance()
            expect(resolvedComponent).toBeInstanceOf(TestService)
            expect(resolvedComponent.arg1).toBe(arg1)
            expect(resolvedComponent.arg2).toBe('arg2')
        })
    })
})