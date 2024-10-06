import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	constructor(private messageService: MessageService, private router: Router) {
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error) {
					const life: number = 3000;
					switch (error.status) {
						case 0:
							if (typeof (error.error) === 'object') {
								this.messageService.add({
									severity: 'error',
									summary: error.status + ": " + error.statusText,
									detail: error.error.message ?? error.error.error,
									life: life
								});
							} else {
								this.messageService.add({
									severity: 'error',
									summary: error.status + ": " + error.statusText,
									detail: error.error.message ?? error.error,
									life: life
								});
							}
							break;
						case 400:
							if (error.error.errors) {
								const modalStateErrors = [];
								for (const key in error.error.errors) {
									if (error.error.errors[key]) {
										modalStateErrors.push(error.error.errors[key]);
									}
								}
								throw modalStateErrors;
							} else if (typeof (error.error) === 'object') {
								this.messageService.add({
									severity: 'error',
									summary: error.status + ": " + error.statusText,
									detail: error.error.message ?? error.error.error,
									life: life
								});
							} else {
								this.messageService.add({
									severity: 'error',
									summary: error.status + ": " + error.statusText,
									detail: error.error.message ?? error.error,
									life: life
								});
							}
							break;
						case 401:
							if (this.router.url.includes('scope')) {
								this.router.navigateByUrl('/');
							} else {
								this.messageService.add({
									severity: 'error',
									summary: 'Unauthorized',
									detail: error.error.error || error.error.message,
									life: life
								});
							}
							break;
						default:
							if (!(error.error instanceof Blob)) {
								this.messageService.add({
									severity: 'error',
									summary: error.status + ": " + error.statusText,
									detail: error.error.message ?? error.error,
									life: life
								});
							}
							break;
					}
				}
				return throwError(() => error);
			})
		);
	}
}