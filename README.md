# angular2-sails
An angular module for using the sails socket.io api in angular2 (@angular)

## INDEX

* [Usage with angular-cli](#usage-with-angular-cli)
* [Installing](#1-installing)
* [Using it](#2-using-it)
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

### 2. Using it

in app.module.ts import and register the angular2-sails module like that:

```typescript
...
import { AppComponent } from './app.component';
import {SailsModule} from "angular2-sails";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...,
    SailsModule.forRoot()
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

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
            (resData) => { this.users = resData.data},
            (error) => { console.log("oooops, error occured") }
            () => { console.log("we are finished") }
        )

    }
    
    /*
     * explanation of observable response object
     * 
     * resData = {
     *      data: <object>,
     *      statusCode: <number>,
     *      response: <jwres>,
     *      error: <undefined>
     * }
     * 
     * error = {
     *      data: null,
     *      statusCode: <number>,
     *      response: <jwres>,
     *      error: <jwres.error>
     * }
     */

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
