export const CorsRequest = function(options, printResult) {
            var cors_api_url = 'http://localhost:8080/';
            var x = new XMLHttpRequest();
            x.open(options.method, cors_api_url + options.url);
            x.onload = x.onerror = function () {
                printResult(
                    x.responseText
                );
            };
            if (/^POST/i.test(options.method)) {
                x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            x.send(options.data);
        }