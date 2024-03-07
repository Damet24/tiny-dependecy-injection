import {describe, expect, test} from 'vitest'
import {Componet} from '../../lib/Component.js'
import {ContainerBuilder} from '../../lib/index.js'
import {Argument} from '../../lib/Argument.js'

class TestService {
    constructor(arg1, arg2) {
        this.arg1 = arg1
        this.arg2 = arg2
    }
}

class CreateTestFactory {
    static CreateService(arg1) {
        return new TestService(arg1, 'arg2')
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
            const component = new Componet(CreateTestFactory, 'CreateService', container)
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