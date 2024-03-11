# Tiny-dependecy-injection
 
a simple library for dependency injection in node

# Installation
```sh
npm install --save tiny-dependency-injection
```

# Usage: register and get services
```js
// reporitories/UserReporitory.js

export default class UserReporitory {
  /**
   * @param {ExampleService} exampleService
   */
  constructor(exampleService) {
    this._exampleService = exampleService;
  }

  ...
}
```
You can register this in the container as a service:
```js
import {ContainerBuilder} from 'tiny-dependecy-injection'
import {UserReporitory} from './reporitories/UserReporitory.js'
import {ExampleService} from './services/ExampleService' 

const container = new ContainerBuilder()

container.register('service.example', ExampleService)
container
    .register('reporitories.ures-repository', UserReporitory)
    // For the argument to return an instance of the service, the prefix '@' must be used, 
    // otherwise it will be taken as a string
    .addArgument('@service.example')
```
And get services from your container
```js
const reporitory = container.get('reporitories.ures-repository')
```
You can also configure the scope of the service, by default it is scoped
```js
container
    .register('reporitories.ures-repository', UserReporitory)
    .addArgument('@service.example')
    .asSingleton()
```
or
```js
container
    .register('reporitories.ures-repository', UserReporitory)
    .addArgument('@service.example')
    .asScoped()
```
# Arguments
any type of arguments can be set
```js
container
    .register('reporitories.ures-repository', UserReporitory)
    .addArgument('string')
    .addArgument(true)
    .addArgument({ environment: 'test' })
    .addArgument('@service.example')
    .addArgument(new ExampleService())
```
To use environment variables in arguments is done as follows;
```js
container
    .register('reporitories.ures-repository', UserReporitory)
    .addArgument('$env(MY_VARIABLE)')
```
NOTE: If the variable does not exist, an error will be thrown.

# Factories
factories can also be registered
```js
//factories/ServiceFactory.js
import {ExampleService} from './services/ExampleService' 

export default class ServiceFactory {
    static createServise(param) {
        return new ExampleService(param)
    }
}
```
To register the factories you have to specify the name of the function to be invoked, 
you can also assign parameters to the factory function
```js
container
    .register('factories.ServiceFactory', ServiceFactory, 'createServise')
    .addArgument('param')
```
# Mentions
For this package I was inspired by [Node Dependency Injection](https://github.com/zazoomauro/node-dependency-injection)
