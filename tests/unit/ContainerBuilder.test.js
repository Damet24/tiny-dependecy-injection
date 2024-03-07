import { expect, test, describe } from 'vitest'
import { ContainerBuilder } from '../../lib/index.js'

class TestService {
    constructor(arg1, arg2) {
        this.arg1 = arg1
        this.arg2 = arg2
    }

    test(){
        console.log('arg1', this.arg1)
        console.log('arg2', this.arg2)
    }
}

class TestService2 {}

class CeateTestFactory {
    static CreateService(arg1) {
        return new TestService(arg1, 'arg2')
    }
}

describe('Container builder', () => {
    test('create container', () => {
        const container = new ContainerBuilder()
        expect(container).toBeInstanceOf(ContainerBuilder)
    })
    
    describe('resolve services', () => {
        test('sigle service', () => {
            const container = new ContainerBuilder()
            const testArg = 'second arg'
            container.register('s2', TestService2)
            container.register('s1', TestService)
                .addArgument('@s2')
                .addArgument(testArg)
            const service = container.get('s1')
            expect(service).toBeInstanceOf(TestService)
            expect(service.arg1).toBeInstanceOf(TestService2)
            expect(service.arg2).toBe(testArg)
        })

        test('factory', () => {
            const container = new ContainerBuilder()
            const testArg = 'second arg'
            container.register('s1', CeateTestFactory, 'CreateService')
                .addArgument(testArg)
            const service = container.get('s1')
            expect(service).toBeInstanceOf(TestService)
            expect(service.arg1).toBe(testArg)
            expect(service.arg2).toBe('arg2')
        })
    })
})