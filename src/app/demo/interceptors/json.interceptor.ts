import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class JsonInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Clone the request to add the new headers
		const jsonReq = req.clone({
			setHeaders: {
				'Content-Type': 'application/json',
			}
		});

		// Send the newly created request
		return next.handle(jsonReq);
	}
}