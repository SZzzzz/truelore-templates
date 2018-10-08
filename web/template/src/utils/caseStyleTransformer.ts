class CaseStyleTransformer {
  transformPropertyName<T = any>(data: T, transformer: (key: string) => string): T {
    if (!this.isObject(data)) {
      return data;
    } else {
      const newObj = Array.isArray(data) ? [] : {};
      Object.keys(data).forEach(key => {
        const newKey = transformer(key);
        newObj[newKey] = this.transformPropertyName(data[key], transformer);
      });
      return newObj as T;
    }
  }
  
  snakeToCamel<T = any>(data: T): T {
    return this.transformPropertyName<T>(data, key => key.replace(/\_./g, str => str[1].toUpperCase()));
  }
  
  camelToSnake<T = any>(data: T): T {
    return this.transformPropertyName<T>(data, key => key.replace(/[A-Z]/g, str => '_' + str.toLowerCase()));
  }

  private isObject(data: any): boolean {
    return data !== null && typeof data === 'object';
  }
}

const caseStyleTransformer = new CaseStyleTransformer();
export default caseStyleTransformer;