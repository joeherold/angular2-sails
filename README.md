# angular2-sails
An angular module for using the sails socket.io api in angular2 (@angular)

## INDEX

* [Usage with angular-cli](#usage-with-angular-cli)
* [Installing](#1-installing)
* [Configure angular-cli](#2-configure-angular-cli)
    * [app_rootangular-cli-build.js](#app_rootangular-cli-buildjs)
    * [system-config.ts](#app_rootsrcsystem-configts)
* [Using it](#3-using-it)

* [Working with it](#working-with-it)
* [Example](#example)
* [Example with async pipe](#example-with-async-pipe)

## Usage with angular-cli
Angular-cli is a great angular2 app starter for creating fancy angular stuff.

Here I will describe on how to install and use it:

### 1. Installing

install the package with the node package manager (npm)

```npm install --save angular2-sails```

[back to top](#index)

### 2. Configure angular-cli

[back to top](#index)

#### APP_ROOT/angular-cli-build.js
Here you may add a line of code, to add the package to your vendor files

```javascript
var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function (defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
     ...
      'angular2-sails/dist/**/*.+(js|js.map)',
    ]
  })
    ;
};
```

[back to top](#index)

#### APP_ROOT/src/system-config.ts
Here you have to register the module in the systemJS configuration and define the mapping location and the entry point.
```typescript
/** Map relative paths to URLs. */
const map:any = {
  ...
  'angular2-sails': 'vendor/angular2-sails/dist'
};
```

```typescript
/** User packages configuration. */
const packages:any = {
    ...,
    'angular2-sails': {
        defaultExtension: 'js',
        main: 'index.js'
      },
}
```

[back to top](#index)

### 3. Using it

[back to top](#index)

#### the import statement looks like this:

```import { SailsService } form 'angular2-sails';```

[back to top](#index)

#### You can provide the SailsService in a Component by the provider array or (not recommended) by providing it in the bootstrap of your application.

Example in Component:
```typescript
import { Component, OnInit } from '@angular/core';
import { SailsService } from 'angular2-sails';

@Component({
    moduleId: module.id,
    selector: 'my',
    templateUrl: 'my.component.html',
    providers: [SailsService]
})
export class MyComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}

// and in a subcomponent of the provider component

import { Component, OnInit } from '@angular/core';
import { SailsService } from 'angular2-sails';

@Component({
    moduleId: module.id,
    selector: 'my-sub',
    templateUrl: 'my-sub.component.html',
})
export class MySubComponent implements OnInit {
    constructor(private _sailsService:SailsService) { }

    ngOnInit() { }

}

```

Example in bootstrap (not recommended):
```typescript
...
import { SailsService } from 'angular2-sails';

bootstrap(AppComponent, [
  ...,
  SailsService
]);


// and then again in a component

import { Component, OnInit } from '@angular/core';
import { SailsService } from 'angular2-sails';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private _sailsService:SailsService) { }

    ngOnInit() { }

}

```

[back to top](#index)

### working with it

You inject the service by the constructor where you want to use it.

```typescript
constructor(private _sailsService:SailsService) { }
```

first you have to connect your service:

```typescript
ngOnInit() {
    this._sailsService.connect()
}
```

you can pass in an Url or Options, where to connect to
```typescript
ngOnInit() {
    this._sailsService.connect("http://localhost:1337");
    // or
    letl opts = {
        url: "http://localhost:1337",
        transports: ['polling', 'websocket'],
        headers: {...},
        ...
    }
    this._sailsService.connect(opts);
}
```
for more information, please visit [sailsjs.org Documentation for SailsSocket Properties](http://sailsjs.org/documentation/reference/web-sockets/socket-client/sails-socket/properties)

this is handy, when you develop with angular-cli (localhost:4200) and the ng serve command
and your sails app runs separately e.g on localhost:1337




The following methods are implemented in the SailsService and will always return you an Observable<T>:

- get(path,data):Observable
- post(path,data):Observable
- put(path,data):Observable
- delete(path,data):Observable
- request(options):Observable
- on(eventEntity):Observable

for more information, please visit [sailsjs.org Documentation for SailsSocket Methods](http://sailsjs.org/documentation/reference/web-sockets/socket-client/sails-socket/methods)

You then have to subscribe to that Observable, to get the data.

[back to top](#index)

# EXAMPLE:

```html

<ul>
    <li *ngFor="let user of users">{{user.firstname}} {{user.lastname}}</li>
</ul>

```

```typescript

import { Component, OnInit } from '@angular/core';
import { SailsService } from 'angular2-sails';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {

    // declare the variable for the template
    public users:any[];

    constructor(private _sailsService:SailsService) { }

    ngOnInit() {

    this._sailsService
         .get('/users')
         .subscribe(
            (resData) => { this.users = resData},
            (error) => { console.log("oooops, error occured") }
            () => { console.log("we are finished") }
        )

    }

}


```

[back to top](#index)

# EXAMPLE with Async Pipe
or even better, you use the *async* pipe of angular, and just pass the Observable to it

```html

<ul>
    <li *ngFor="let user of users$ | async">{{user.firstname}} {{user.lastname}}</li>
</ul>

```

```typescript
import { Component, OnInit } from '@angular/core';
import { SailsService } from 'angular2-sails';
import { Observable } from "rxjs/Rx";

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {

    // declare the variable for the template
    public users$:Observable<any[]>;

    constructor(private _sailsService:SailsService) { }

    ngOnInit() {

    // now we are passing the Observable to the template variable
    this.users$ = this._sailsService.get('/users');

    }

}


```

[back to top](#index)
