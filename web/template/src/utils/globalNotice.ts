import { message } from 'antd';

export interface Notice {
  successNotice(content: string): void;
  errorNotice(content: string): void;
}

class GlobalNotice implements Notice{
  async errorNotice(content: string) {
    message.error(content, 5);
  }

  async successNotice(content: string) {
    message.success(content, 5);
  }
}

const globalNotice = new GlobalNotice();
export default globalNotice;
