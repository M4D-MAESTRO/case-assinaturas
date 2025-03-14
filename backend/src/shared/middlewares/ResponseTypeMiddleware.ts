import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { js2xml, json2xml, Options } from 'xml-js';

@Injectable()
export class XmlResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map((data) => {
                if (request.headers.accept === 'application/xml') {
                    if (typeof data === 'object') {
                        response.type('application/xml');
                        response.setHeader('Content-Type', 'application/xml');

                        const options: Options.JS2XML = {
                            compact: true,
                            ignoreComment: true,
                            spaces: 4,
                        };
                        const xml = json2xml(data, options);
                        return xml;
                    }
                }

                return data;
            }),
        );
    }
}
