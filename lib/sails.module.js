import { NgModule } from "@angular/core";
import { SailsService } from "./sails.service";
export var SailsModule = (function () {
    function SailsModule() {
    }
    SailsModule.forRoot = function () {
        return {
            ngModule: SailsModule,
            providers: [SailsService]
        };
    };
    SailsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [],
                    exports: [],
                    declarations: [],
                    providers: [],
                    entryComponents: []
                },] },
    ];
    /** @nocollapse */
    SailsModule.ctorParameters = function () { return []; };
    return SailsModule;
}());
//# sourceMappingURL=sails.module.js.map