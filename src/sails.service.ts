import {Injectable, NgZone} from "@angular/core";
import {Subject, Observable} from "rxjs/Rx";


declare let io:any;

if (io && io.sails) {


  if (io && io.socket && io.socket.isConnected()) {
    io.socket.disconnect();
  }

}

interface IJWRes {
  body:any;
  error?:any;
  headers:any;
  statusCode:number
}

@Injectable()
export class SailsService {

  private _io:any;
  private _connected:boolean = false;
  private _opts:any
  private _restPrefix:string = "";
  private _serverUrl:string;
  private _pubsubSubscriptions:any;


  constructor(private zone:NgZone) {

    this._pubsubSubscriptions = {};

    this._opts = {
      url: null
    };


  }

  get restPrefix():string {
    return this._restPrefix;
  }

  set restPrefix(value:string) {
    if (value.length > 0) {
      if (value.charAt((value.length - 1)) == "/") {
        value = value.substr(0, value.length - 1);
      }
      this._restPrefix = value;
    }
  }


  get serverUrl():string {
    return this._serverUrl;
  }

  set serverUrl(value:string) {
    if (value.length > 0) {
      if (value.charAt((value.length - 1)) == "/") {
        value = value.substr(0, value.length - 1);
      }
      this._serverUrl = value;
    }
  }

  public connect(url, opts?):void {

    if (this._connected) {
      this._io.disconnect();
    }

    // Make URL optional
    if ('object' === typeof url) {
      opts = url;
      url = null;
    }

    // this._url = url || null;
    // this._opts = opts || {}

    if (url) {
      this.serverUrl = url;
    } else if (this._opts.url) {
      this.serverUrl = this._opts.url;
    } else if (!(this._serverUrl.length > 0)) {
      this._serverUrl = undefined;
    }
    this._opts.url = this._serverUrl;

    // // If explicit connection url is specified, save it to options
    // this._opts.url = url || this._opts.url || this._serverUrl;

    this._io = io.sails.connect(this._opts);
    this._connected = true;
  }


  /**
   * @title request
   *
   * @description Send a virtual request to a Sails server using Socket.io.
   * This function is very similar to .get(), .post(), etc.
   * except that it provides lower-level access to the request headers, parameters,
   * method, and URL of the request.
   *
   * example:
   * @Component()
   * export class MyClass implements OnInit {
   *  constructor(private _sailsService:SailsService){}
   *
   *  ngOnInit{
   *
   *    let options = {
   *      method: 'get',
   *      url: 'http://localhost:1337/users'
   *      data: {},
   *      headers: {
   *        'x-csrf-token': 'ji4brixbiub3'
   *      }
   *    }
   *
   *    this._sailsService.request().subscribe(data => {
   *      // do something with the data
   *    })
   *
   *  }
   * }
   *
   * @param options
   * @return {Observable<T>}
     */
  request(options:any):Observable<any> {
    let subject = new Subject();

    this.zone.runOutsideAngular(()=> {

      this._io.request(options, (resData, jwres:IJWRes) => {

        if (io.sails.environment != "production") {
          console.log("request::data", resData)
          console.log("request:jwr", jwres)
        }

        if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
          subject.error(jwres.error)
        } else {
          this.zone.run(() => subject.next(resData));
        }

        subject.complete();


      })

    })

    return subject.asObservable();
  }

  /**
   *
   * @param url
   * @param data
   * @return {Observable<T>}
     */
  get(url, data?:any):Observable<any> {

    let subject = new Subject();
    this.zone.runOutsideAngular(()=> {

      this._io.get(`${this._restPrefix}${url}`, data, (resData, jwres:IJWRes)=> {

        if (io.sails.environment != "production") {
          console.log("get::data", resData)
          console.log("get:jwr", jwres)
        }
        if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
          subject.error(jwres.error)
        } else {
          this.zone.run(() => subject.next(resData));
        }

        subject.complete();
      })
    });
    return subject.asObservable();

  }

  /**
   *
   * @param url
   * @param data
   * @return {Observable<T>}
     */
  post(url, data?:any):Observable<any> {

    let subject = new Subject();

    this.zone.runOutsideAngular(()=> {

      this._io.post(url, data, (resData, jwres:IJWRes)=> {
        if (io.sails.environment != "production") {
          console.log("post::data", resData);
          console.log("post:jwr", jwres);
        }

        if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
          subject.error(jwres.error)
        } else {
          this.zone.run(() => subject.next(resData));

        }

        subject.complete();
      })

    });
    return subject.asObservable();
  }

  /**
   *
   * @param url
   * @param data
   * @return {Observable<T>}
     */
  put(url, data?:any):Observable<any> {

    let subject = new Subject();

    this.zone.runOutsideAngular(()=> {
      this._io.put(url, data, (resData, jwres:IJWRes)=> {
        if (io.sails.environment != "production") {
          console.log("put::data", resData);
          console.log("put:jwr", jwres);
        }

        if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
          subject.error(jwres.error)
        } else {
          //subject.next(resData);
          this.zone.run(() => subject.next(resData));
        }

        subject.complete();
      })

    });
    return subject.asObservable();
  }

  /**
   *
   * @param url
   * @param data
   * @return {Observable<T>}
     */
  delete(url, data?:any):Observable<any> {

    let subject = new Subject();

    this.zone.runOutsideAngular(()=> {


      this._io.delete(url, data, (resData, jwres:IJWRes)=> {

        if (io.sails.environment != "production") {
          console.log("delete::data", resData);
          console.log("delete:jwr", jwres);
        }

        if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
          subject.error(jwres.error)
        } else {
          //subject.next(resData);
          this.zone.run(() => subject.next(resData));
        }

        subject.complete();
      })

    });
    return subject.asObservable();
  }

  /**
   *
   * @param eventIdentity
   * @return {Observable<T>}
     */
  on(eventIdentity:string):Observable<any> {

    if (!this._pubsubSubscriptions[eventIdentity] || this._pubsubSubscriptions[eventIdentity].isComplete) {
      this._pubsubSubscriptions[eventIdentity] = new Subject();

      this.zone.runOutsideAngular(()=> {

        this._io.on(eventIdentity, msg => {

          if (io.sails.environment != "production") {
            console.log(`on::${eventIdentity}`, msg);
          }

          this.zone.run(()=> {
            this._pubsubSubscriptions[eventIdentity].next(msg);
          })

        })

      })
    }

    return this._pubsubSubscriptions[eventIdentity].asObservable();
  }

  // public off(eventIdentity:string) {
  //
  //   if(<Subject>this._pubsubSubscriptions[eventIdentity]) {
  //
  //   }
  //
  //   if (!<Subject>this._pubsubSubscriptions[eventIdentity].isComplete) {
  //     <Subject>this._pubsubSubscriptions[eventIdentity].complete();
  //   }
  //
  //
  // }

}
