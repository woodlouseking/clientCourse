module.exports = {
    request: function(obj) {
        var httpRequest = new XMLHttpRequest();
        var time = 5*1000;//超时时间
        var timeout = false;

        var timer = setTimeout(function(){
            timeout = true;
            httpRequest.abort();//请求中止
        }, time);

        var url = obj.url;
        if (typeof obj.data == 'object') {
            // console.info('obj.data=' + JSON.stringify(obj.data));
            var kvs = []
            for (var k in obj.data) {
               kvs.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj.data[k]));
            }
            url += '?';
            url += kvs.join('&');
        }
        httpRequest.open(obj.method?obj.method:'GET', url, true);
        httpRequest.onreadystatechange = function () {
            var response = httpRequest.responseText;
            console.info('http url cb:' +  url + ' readyState:' + httpRequest.readyState + ' status:' + httpRequest.status);
            if (timeout) {
                clearTimeout(timer);
            }

            if (httpRequest.readyState == 4) {
                console.info('http success:' + url + ' resp:' + response);
                var resJson = JSON.parse(response);
                if (typeof obj.success == 'function') {
                    obj.success(resJson);
                }
            } else {
                console.info('http fail:' + url);
                if (typeof obj.fail == 'function') {
                    obj.fail(response);
                }
            }
        };
        httpRequest.send();
    }
}