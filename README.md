# angular2-sails
An angular module for using the sails socket.io api in angular2 (@angular)

## Usage with angular-cli
Angular-cli is a great angular2 app starter for creating fancy angular stuff.

Here I will describe on how to install and use it:

### 1. Installing
install the package with the node package manager (npm)

```npm install --save angular2-sails```

### 2. Configre angular-cli

#### APP_ROOT/angular-cli-build.js
Here you may add a line of code, to add the package to your vendor files

```javascript
var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function (defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
     ...
      'angular2-sails/**/*.+(js|js.map)',
    ]
  })
    ;
};
```

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

### 3. Using it

1. the import statement looks like this: `

```import { SailsService } form 'angular2-sails';``

2. provide service
You can provide the SailsService in a Component by the provider array or (not recommended) by providing it in the bootstrap of your application.

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

import { SailsService } from 'angular2-sails';

bootstrap(AppComponent, [
  ...,
  SailsService
]);

```