####使用方法

- fetch('https://mywebsite.com/endpoint/')
- 第二个参数对象是可选的，它可以自定义HTTP请求中的一些部分。

>
    fetch('https://mywebsite.com/endpoint/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      })
    })


- 译注：如果你的服务器无法识别上面POST的数据格式，那么可以尝试传统的form格式，代码如下：

>   
    fetch('https://mywebsite.com/endpoint/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'key1=value1&key2=value2'
    })

- 异步

>   
    fetch('https://mywebsite.com/endpoint.php')
      .then((response) => response.text())
      .then((responseText) => {
        console.log(responseText);
      })
      .catch((error) => {
        console.warn(error);
      });