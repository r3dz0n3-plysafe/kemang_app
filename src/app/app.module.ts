import { LOCALE_ID, NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JsonInterceptor } from "./demo/interceptors/json.interceptor";
import localeId from '@angular/common/locales/id';
import { ErrorInterceptor } from "./demo/interceptors/error.interceptor";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

registerLocaleData(localeId, 'id');

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
	imports: [AppRoutingModule, AppLayoutModule, ToastModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
	    {provide: HTTP_INTERCEPTORS, useClass: JsonInterceptor, multi: true},
	    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
	    {provide: LOCALE_ID, useValue: 'id-ID'},  // Atur locale default menjadi 'id-ID'
        CountryService, CustomerService, EventService, IconService, NodeService,
	    PhotoService, ProductService, MessageService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
