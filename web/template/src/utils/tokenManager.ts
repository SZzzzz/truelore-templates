import { AxiosInstance } from 'axios';
import * as agentsMap from '../apis/agent';
const jwt = require('jsonwebtoken');

class TokenManager {
  setToken(token: string, name?: string): void {
    this.findAgents(name).forEach(agent => {
      agent.defaults.headers['Authorization'] = `Bearer ${token}`;
    });
  }

  clearToken(name?: string): void {
    this.findAgents(name).forEach(agent => {
      if (agent.defaults.headers['Authorization']) {
        delete agent.defaults.headers['Authorization'];
      }
    });
  }

  findAgents(name?: string): AxiosInstance[] {
    let agentNames = Object.keys(agentsMap);
    if (name) {
      if (agentNames.indexOf(name) < 0) {
        throw new Error(`agent: ${name} 不存在`);
      } else {
        agentNames = [name];
      }
    }
    return agentNames.map(aName => agentsMap[aName]);
  }

  decodeToken<T>(token: string): T {
    return jwt.decode(token) as T;
  }

  storgeToken(key: string, token: string): void {
    localStorage.setItem(key, token);
  }

  clearStorgedToken(key: string): void {
    localStorage.removeItem(key);
  }

  getStoredToken(key: string): string | null {
    return localStorage.getItem(key);
  }
}

const tokenManager = new TokenManager();
export default tokenManager;

