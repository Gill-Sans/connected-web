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
                // You can add any response handling here if needed.
            }
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                document.cookie = `JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                const currentPath = window.location.pathname;
                if (
                    !currentPath.startsWith('/login') &&
                    !currentPath.startsWith('/register') &&
                    !currentPath.startsWith('/guest')
                ) {
                    toastService.showToast("error", 'Session expired, please login again');
                    authFacade.redirectToLogin();
                }
            }else if (error.status === 404) {
                toastService.showToast("error", 'Resource not found');
            } else if (error.status >= 400 && error.status < 500) {
                toastService.showToast("error", error.error.message);
            }
            else {
                toastService.showToast("error", 'Something went wrong, please try again');
            }
            return throwError(() => error);
        })
    );
}
