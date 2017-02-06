# EXAMPLES:

## Common EXAMPLE


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



## EXAMPLE with Async Pipe
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


