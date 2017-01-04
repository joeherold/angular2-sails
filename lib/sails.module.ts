import {NgModule, ModuleWithProviders} from "@angular/core";
import {SailsService} from "./sails.service";

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [],
    entryComponents: []
})
export class SailsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SailsModule,
            providers: [SailsService]
        };
    }
}

