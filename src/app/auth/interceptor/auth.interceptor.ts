import { inject } from '@angular/core';
import {
    HttpRequest,
    HttpEvent,
    HttpErrorResponse, HttpHandlerFn, HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { AuthFacade } from '../store/auth.facade';
import {ToastService} from '../../core/services/toast.service';

export function authInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    const authFacade: AuthFacade = inject(AuthFacade);
    const toastService: ToastService = inject(ToastService);

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
            }
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status == 401) {
                toastService.showToast("error", 'Session expired, please login again');
                document.cookie = `JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                authFacade.redirectToLogin();
            } else {
                toastService.showToast("error", 'Something went wrong, please try again');
            }
            return throwError(() => error);
        })
    );
}
