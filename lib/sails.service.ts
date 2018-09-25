import {Injectable, NgZone} from "@angular/core";
import {Subject, Observable} from "rxjs";

declare let io: any;


export declare interface ISailsConnection {
    connected: boolean,
    url: string,
    opts: any
}

export declare interface IJWRes {
    body: any;
    error?: any;
    headers: any;
    statusCode: number
}


if (io && io.sails) {

    // pullrequest #2: "Update sails.service.ts" by mryarbles
    // io.socket.isConnected -> io.socket.isConnected()
    if (io && io.socket && io.socket.isConnected()) {
        io.socket.disconnect();
    }

}



@Injectable()
export class SailsService {
    private _io: any;
    private _connected: boolean = false;
    private _opts: any
    private _restPrefix: string = "";
    private _serverUrl: string;
    private _pubsubSubscriptions: any;
    public silent:boolean = false;

    //public observable: Observable<boolean>;
    public subject = new Subject();


    /**
     *
     * @param zone
     */
    constructor(private zone: NgZone) {

        this._pubsubSubscriptions = {};

        this._opts = {
            url: null
        };


    }

    /**
     *
     * @returns {string}
     */
    get restPrefix(): string {
        return this._restPrefix;
    }

    /**
     *
     * @param value
     */
    set restPrefix(value: string) {
        if (value.length > 0) {
            if (value.charAt((value.length - 1)) == "/") {
                value = value.substr(0, value.length - 1);
            }
            this._restPrefix = value;
        }
    }

    /**
     *
     * @returns {string}
     */
    get serverUrl(): string {
        return this._serverUrl;
    }

    /**
     *
     * @param value
     */
    set serverUrl(value: string) {
        if (value.length > 0) {
            if (value.charAt((value.length - 1)) == "/") {
                value = value.substr(0, value.length - 1);
            }
            this._serverUrl = value;
        }
    }

    /**
     *
     */
    public disconnect(): void {
        if (this._io && this._io.sails) {
            if (this._io && this._io.socket && this._io.socket.isConnected) {
                this._io.disconnect();
            }

        }
    }

    /**
     *
     * @param url
     * @param opts
     * @returns {Observable<T>}
     */
    public connect(url, opts?): Observable<ISailsConnection> {

        var self = this;
        let subject = new Subject<ISailsConnection>();

        this.zone.runOutsideAngular(() => {
            if (this._io && this._io.sails) {
                if (this._io && this._io.socket && this._io.socket.isConnected) {
                    this._io.disconnect();
                }

            }

            // Make URL optional
            if ('object' === typeof url) {
                this._opts = Object.assign({}, url);
                url = null;
            }

            // this._url = url || null;
            // this._opts = opts || {}

            if (url) {
                this.serverUrl = url;
            } else if (this._opts.url) {
                this.serverUrl = this._opts.url;
            } else if (!(this._serverUrl && this._serverUrl.length > 0)) {
                this._serverUrl = undefined;
            }
            this._opts.url = this._serverUrl;

            // // If explicit connection url is specified, save it to options
            // this._opts.url = url || this._opts.url || this._serverUrl;

            this._io = io.sails.connect(this._opts);

            if (this._io && this._io.sails) {
                if (this._io && this._io.socket && this._io.socket.isConnected) {
                    this._connected = true;
                } else {
                    this._connected = false;
                    this.zone.run(() => subject.next({
                        connected: false,
                        url: self.serverUrl,
                        opts: self._opts
                    }));
                }

            } else {
                this._connected = false;
                this.zone.run(() => subject.next({
                    connected: false,
                    url: self.serverUrl,
                    opts: self._opts
                }));
            }

            this._io.on('connect_error', () => {

                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log('Connection failed');
                }
                this.zone.run(() => subject.next({
                    connected: false,
                    url: self.serverUrl,
                    opts: self._opts
                }));
            });
            this._io.on('reconnect_failed', () => {

                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log('Client has not reconnected to the server!');
                }
                this.zone.run(() => subject.next({
                    connected: false,
                    url: self.serverUrl,
                    opts: self._opts
                }));
            });

            this._io.on('reconnected', () => {

                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log('Client has reconnected to the server!');
                }
                this.zone.run(() => subject.next({
                    connected: true,
                    url: self.serverUrl,
                    opts: self._opts
                }));
            });


            // Add a connect listener
            this._io.on('connect', () => {
                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log('Client has connected to the server!');
                }
                this.zone.run(() => subject.next({
                    connected: true,
                    url: self.serverUrl,
                    opts: self._opts
                }));
                //subject.complete();

            });

            this._io.on('disconnect', () =>  {
                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log('Client has disconnected to the server!');
                }
                this.zone.run(() => subject.next({
                    connected: false,
                    url: self.serverUrl,
                    opts: self._opts
                }));
                //subject.complete();

            });
        });
        return <Observable<ISailsConnection>>subject.asObservable();
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
    request(options: any): Observable<any> {
        let subject = new Subject();

        this.zone.runOutsideAngular(() => {

            this._io.request(options, (resData, jwres: IJWRes) => {

                if (io.sails.environment != "production") {
                    console.log("request::data", resData)
                    console.log("request:jwr", jwres)
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    this.zone.run(() => subject.error({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres,
                        error: jwres.error
                    })
                    );
                } else {
                    this.zone.run(() => subject.next({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres
                    }));
                }
                this.zone.run(() => subject.complete());
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
    get(url, data?: any): Observable<any> {
        let self = this;
        let subject = new Subject();
        this.zone.runOutsideAngular(() => {
            this._io.get(`${this._restPrefix}${url}`, data, (resData, jwres: IJWRes) => {
                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log("get::data", resData)
                    console.log("get:jwr", jwres)
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    this.zone.run(() => subject.error({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres,
                        error: jwres.error
                    }));
                } else {
                    this.zone.run(() => subject.next({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres
                    }));
                }
                this.zone.run(() => subject.complete());
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
    post(url, data?: any): Observable<any> {
        let self = this;
        let subject = new Subject();

        this.zone.runOutsideAngular(() => {

            this._io.post(url, data, (resData, jwres: IJWRes) => {
                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log("post::data", resData);
                    console.log("post:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    this.zone.run(() => subject.error({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres,
                        error: jwres.error
                    }));
                } else {
                    this.zone.run(() => subject.next({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres
                    }));
                }
                this.zone.run(() => subject.complete());
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
    put(url, data?: any): Observable<any> {
        let self = this;
        let subject = new Subject();

        this.zone.runOutsideAngular(() => {
            this._io.put(url, data, (resData, jwres: IJWRes) => {
                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log("put::data", resData);
                    console.log("put:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    this.zone.run(() => subject.error({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres,
                        error: jwres.error
                    }));
                } else {
                    //subject.next(resData);
                    this.zone.run(() => subject.next({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres
                    }));
                }
                this.zone.run(() => subject.complete());
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
    patch(url, data?: any): Observable<any> {
        let self = this;
        let subject = new Subject();

        this.zone.runOutsideAngular(() => {
            this._io.patch(url, data, (resData, jwres: IJWRes) => {
                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log("patch::data", resData);
                    console.log("patch:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    this.zone.run(() => subject.error({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres,
                        error: jwres.error
                    }));
                } else {
                    //subject.next(resData);
                    this.zone.run(() => subject.next({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres
                    }));
                }
                this.zone.run(() => subject.complete());
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
    delete(url, data?: any): Observable<any> {
        let self = this;
        let subject = new Subject();
        this.zone.runOutsideAngular(() => {
            this._io.delete(url, data, (resData, jwres: IJWRes) => {
                if (io.sails.environment != "production" && self.silent !== true) {
                    console.log("delete::data", resData);
                    console.log("delete:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    this.zone.run(() => subject.error({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres,
                        error: jwres.error
                    }));
                } else {
                    this.zone.run(() => subject.next({
                        data: resData,
                        statusCode: jwres.statusCode,
                        response: jwres
                    }));
                }
                this.zone.run(() => subject.complete());
            })
        });
        return subject.asObservable();
    }

    /**
     *
     * @param eventIdentity
     * @return {Observable<T>}
     */
    on(eventIdentity: string): Observable<any> {
        let self = this;
        if (!this._pubsubSubscriptions[eventIdentity] || this._pubsubSubscriptions[eventIdentity].isComplete) {
            this._pubsubSubscriptions[eventIdentity] = new Subject();
            this.zone.runOutsideAngular(() => {
                this._io.on(eventIdentity, msg => {

                    if (io.sails.environment != "production" && self.silent !== true) {
                        console.log(`on::${eventIdentity}`, msg);
                    }
                    this.zone.run(() => this._pubsubSubscriptions[eventIdentity].next(msg));
                })
            })
        }
        return this._pubsubSubscriptions[eventIdentity].asObservable();
    }
}