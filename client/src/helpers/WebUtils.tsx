import * as Promise from "bluebird";

   export default class WebUtils {

       public static fetchJSON(url: string, method = 'GET', body?: any): Promise<any> {
           return new Promise((resolve, reject) => {
               var xhr = new XMLHttpRequest();

                     xhr.open(method, url);
               if (body) xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
                xhr.onload = ()=> {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(new Error('Failed'));
                    }
                };
                xhr.onerror = (e)=> {
                    reject(e);
                };
                xhr.send(JSON.stringify(body));
            });
        }
    }
