import { NgZone } from "@angular/core";
import { Observable } from "rxjs/Rx";
export declare class SailsService {
    private zone;
    private _io;
    private _connected;
    private _opts;
    private _restPrefix;
    private _serverUrl;
    private _pubsubSubscriptions;
    constructor(zone: NgZone);
    restPrefix: string;
    serverUrl: string;
    connect(url: any, opts?: any): void;
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
    request(options: any): Observable<any>;
    /**
     *
     * @param url
     * @param data
     * @return {Observable<T>}
     */
    get(url: any, data?: any): Observable<any>;
    /**
     *
     * @param url
     * @param data
     * @return {Observable<T>}
     */
    post(url: any, data?: any): Observable<any>;
    /**
     *
     * @param url
     * @param data
     * @return {Observable<T>}
     */
    put(url: any, data?: any): Observable<any>;
    /**
     *
     * @param url
     * @param data
     * @return {Observable<T>}
     */
    delete(url: any, data?: any): Observable<any>;
    /**
     *
     * @param eventIdentity
     * @return {Observable<T>}
     */
    on(eventIdentity: string): Observable<any>;
}
