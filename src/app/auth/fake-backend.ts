import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
// reference http://jasonwatmore.com/post/2018/09/07/angular-6-basic-http-authentication-tutorial-example

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor(private db: AngularFirestore) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                return this.doQuery(request.body).pipe(mergeMap((data) => {
                    if (data.error) {
                        return throwError(data);
                    } else {
                        const body = data;
                        return of(new HttpResponse({ status: 200, body }));
                    }
                }));
            } else {
                // pass through any requests not handled above
                return next.handle(request);
            }
        }));
    }

    doQuery(request: any): Observable<any> {
        return Observable.create(observer => {
            this.db.collection('users', ref => ref.where('username', '==', request.username)
                .where('password', '==', request.password)).get().subscribe(retval => {
                    const doc = retval.docs[0];
                    if (!retval.empty) {
                        const data = doc.data();
                        const body = {
                            id: data.id,
                            username: data.username,
                            role: data.role
                        };
                        observer.next(body);
                    } else {
                        observer.next({ error: { message: 'Username or password is incorrect' } });
                    }
                    observer.complete();
                });
        });
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
