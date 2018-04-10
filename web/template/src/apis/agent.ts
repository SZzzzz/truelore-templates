import axios from 'axios';

// 需要自定义的几个地方
// 1. base URL
// 2. timeout 时间
// 3. 拦截器, 用于字段名的转换
// 4. 错误, 触发一些全局的提示
const agent = axios.create({
  baseURL: 'server host',
  timeout: 3000
});

// 拦截器用来将驼峰和下划线两种风格互转，根据 server 端命名风格决定是否使用

// 驼峰转下划线
agent.interceptors.request.use(
  config => {
    config.data = transformPropertyName(config.data, key =>
      key.replace(/[A-Z]/g, str => '_' + str.toLowerCase())
    );
    return config;
  },
  error => Promise.reject(error)
);

// 下划线转驼峰
agent.interceptors.response.use(
  response => {
    response.data = transformPropertyName(response.data, key =>
      key.replace(/\_./g, str => str[1].toUpperCase())
    );
    return response;
  },
  error => Promise.reject(error)
);

function transformPropertyName(data: any, transformer: (key: string) => string): any {
  if (!isObject(data)) {
    return data;
  } else {
    const newObj = Array.isArray(data) ? [] : {};
    Object.keys(data).forEach(key => {
      const newKey = transformer(key);
      newObj[newKey] = transformPropertyName(data[key], transformer);
    });
    return newObj;
  }
}

function isObject(data: any) {
  return data !== null && typeof data === 'object';
}

export default agent;
