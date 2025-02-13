import { Injectable, inject } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class CookieService {
    private cookieService = inject(NgxCookieService);

    /**
     * Set a cookie with a value of type T
     * @param key - The key to set the cookie with
     * @param value - The value to set the cookie with
     * @param expirationDays - The number of days to expire the cookie
     */
    set<T>(key: string, value: T, expirationDays: number = 1): void {
        const stringValue= JSON.stringify(value);
        this.cookieService.set(
            key,
            stringValue,
            expirationDays,
            '/', //path - nu beschikbaar over de hele site
            undefined, //domain 
            false, //secure
            'Strict' //on the same site
        );
    }

    /**
     * Get a cookie value of type T
     * @param key - The key to get the cookie value from
     * @returns The value of the cookie or null if the cookie does not exist
     */
    get<T>(key: string): T | null {
        try {
            const value = this.cookieService.get(key);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    }

    /**
     * Delete a cookie
     * @param key - The key to delete the cookie
     */ 
    delete(key: string): void {
        this.cookieService.delete(key, '/');
    }

    /**
     * Check if a cookie exists
     * @param key - The key to check if the cookie exists
     * @returns True if the cookie exists, false otherwise
     */
    exists(key: string): boolean {
        return this.cookieService.check(key);
    }

}