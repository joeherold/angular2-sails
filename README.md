# angular2-sails
An angular module for using the sails socket.io api in angular2 (@angular)

Read the full documentation at: [Documentation @ gitbook.com](https://joeherold.gitbooks.io/angular2-sails/content/ "Documentation @ gitbook.com")

## INDEX

* [Usage with angular-cli](#usage-with-angular-cli)
* [Installing](#1-installing)
* [Using it](#2-using-it)
* [Working with it](#working-with-it)
* [Example](#example)
* [Example with async pipe](#example-with-async-pipe)
* [Important notes to io.js (sails.io.js)](#important-notes)

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



# IMPORTANT NOTES
## io (sails.io.js)
I was asked couple of times, why one gets an error like (io is not defined).
So to clear things up a bit. The io library (sails.io.js) is not part of this module. So that's why you have to add io (sail.io.js) yourself to your project. Otherwise io will not be defined as a global varable and will not be accessible.

There are several ways to do so:

### by script tag
One is to link the sail.io.js in your index.html or layout.ejs as a simple script tag.

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sailsapp</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root>Loading...</app-root>

  <!-- add the io library -->
  <script src="/assets/sails.io/sails.io.js"></script>
</body>
</html>
```


### angular-cli (webpack version)
When you are using angular-cli (what is my recommendation), then you can add the file to the scripts array of your angular-cli.json.

```javascript
// ANGULAR_CLI_ROOT/angular-cli.json
{
  "project": {
    ...
  },
  "apps": [
    {
      ...
      "styles": [
        "styles.less"
      ],
      "scripts": [
      	"../path/to/sails.io.js" //this is where you may add the io library
      ],
      ...
    }
  ],
  ...
}
```

### plain webpack
When you are using webpack, you also could add the sails.io.js file to your project by installing the library and requireing it.

[back to top](#index)
