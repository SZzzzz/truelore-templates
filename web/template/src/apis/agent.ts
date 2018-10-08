import axios from 'axios';

export const defaultAgent = axios.create({
  baseURL: 'server host',
  timeout: 3000
});