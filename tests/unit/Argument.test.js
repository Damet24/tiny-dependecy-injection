import { expect, test, describe } from 'vitest'
import { Argument } from '../../lib/Argument.js'
import { ContainerBuilder } from '../../lib/index.js'

class TestService1 { }

describe('Arguments', () => {
    describe('creating arguments', () => {
        test('create an argument without value', () => {
            expect(() => new Argument()).toThrowError(/ArgumentTypeNotExistsError/)
        })

        test('create an argument', () => {
            const arg = new Argument('test arg  constructor')
            expect(arg).toBeInstanceOf(Argument)
            expect(arg.type).toBe(Argument.Type.String)
        })

        test('create an argument as number', () => {
            const arg = new Argument(33)
            expect(arg).toBeInstanceOf(Argument)
            expect(arg.type).toBe(Argument.Type.Number)
        })

        test('create an argument as function', () => {
            const arg = new Argument(() => { })
            expect(arg).toBeInstanceOf(Argument)
            expect(arg.type).toBe(Argument.Type.Func)
        })

        test('create an argument as service', () => {
            const arg = new Argument('@service')
            expect(arg).toBeInstanceOf(Argument)
            expect(arg.type).toBe(Argument.Type.Service)
        })

        test('create an argument as object', () => {
            const arg = new Argument({})
            expect(arg).toBeInstanceOf(Argument)
            expect(arg.type).toBe(Argument.Type.Object)
        })

        test('create an argument as env var', () => {
            const arg = new Argument('$env(OS)')
            expect(arg).toBeInstanceOf(Argument)
            expect(arg.type).toBe(Argument.Type.EnvVar)
        })
    })

    describe('test the behavior of the argument', () => {
        describe('Resolving arguments', () => {
            test('resolve string type', () => {
                const argValue = 'test arg  constructor'
                const arg = new Argument(argValue)
                const argResolved = arg.resolveArgByType()
                expect(arg.type).toBe(Argument.Type.String)
                expect(argResolved).toBe(argValue)
            })

            test('resolve number type', () => {
                const argValue = 1234
                const arg = new Argument(argValue)
                const argResolved = arg.resolveArgByType()
                expect(arg.type).toBe(Argument.Type.Number)
                expect(argResolved).toBe(argValue)
            })

            test('resolve object type', () => {
                const argValue = { test: 123 }
                const arg = new Argument(argValue)
                const argResolved = arg.resolveArgByType()
                expect(arg.type).toBe(Argument.Type.Object)
                expect(argResolved).toBe(argValue)
            })

            test('resolve function type', () => {
                const argValue = () => { }
                const arg = new Argument(argValue)
                const argResolved = arg.resolveArgByType()
                expect(arg.type).toBe(Argument.Type.Func)
                expect(argResolved).toBe(argValue)
            })

            describe('env var type', () => {
                test('resolve env var type', () => {
                    const argValue = '$env(OS)'
                    const arg = new Argument(argValue)
                    const argResolved = arg.resolveArgByType()
                    expect(arg.type).toBe(Argument.Type.EnvVar)
                    expect(argResolved).toBe(process.env['OS'])
                })

                test('resolve env var type that does not exist', () => {
                    const argValue = '$env(NOT_EXISTS)'
                    const arg = new Argument(argValue)
                    expect(arg.type).toBe(Argument.Type.EnvVar)
                    expect(() => arg.resolveArgByType()).toThrowError(/the environment variable with the name 'NOT_EXISTS' does not exist/)
                })

                test('resolve type of var env that is misspelled', () => {
                    const argValue = '$env(NOT_EXISTS'
                    const arg = new Argument(argValue)
                    expect(arg.type).toBe(Argument.Type.EnvVar)
                    expect(() => arg.resolveArgByType()).toThrowError(/error when trying to parse an environment variable: undefined/)
                })

                test('resolve type of var env that is misspelled', () => {
                    const argValue = '$env(NOT_ EXISTS'
                    const arg = new Argument(argValue)
                    expect(arg.type).toBe(Argument.Type.EnvVar)
                    expect(() => arg.resolveArgByType()).toThrowError(/error when trying to parse an environment variable: undefined/)
                })
            })

            const container = new ContainerBuilder()
            container.register('service', TestService1)

            describe('service type', () => {
                test('resolve service type', () => {
                    const argValue = '@service'
                    const arg = new Argument(argValue, container)
                    const argResolved = arg.resolveArgByType()
                    expect(arg.type).toBe(Argument.Type.Service)
                    expect(argResolved).toBeInstanceOf(TestService1)
                })

                test('resolve service type', () => {
                    const argValue = '@not_exists_service'
                    const arg = new Argument(argValue, container)
                    expect(arg.type).toBe(Argument.Type.Service)
                    expect(() => arg.resolveArgByType()).toThrowError(/ComponetIsNotRegisterError/)
                })
            })
        })
    })
})