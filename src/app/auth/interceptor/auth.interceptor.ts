import { inject } from '@angular/core';
import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse, HttpEventType, HttpHandlerFn, HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { AuthFacade } from '../store/auth.facade';

export function authInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    const authFacade: AuthFacade = inject(AuthFacade);
    console.log('intercepting request', req);

    return next(req).pipe(
        tap(event => {
            // Only log the successful response
            if (event instanceof HttpResponse) {
                console.log('intercepted response', event);
            }
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status == 401) {
                console.log('401 error, redirecting to login');
                document.cookie = `JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                authFacade.redirectToLogin();
            }
            // Propagate the error so that any subscribers can handle it
            return throwError(() => error);
        })
    );
}
