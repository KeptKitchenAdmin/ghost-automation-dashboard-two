// Mock SQLite implementations for TypeScript compilation

export interface Database {
  run(sql: string, params?: any): Promise<any>;
  get(sql: string, params?: any): Promise<any>;
  all(sql: string, params?: any): Promise<any[]>;
  exec(sql: string): Promise<any>;
  close(): Promise<void>;
}

export const open = (options: any): Promise<Database> => {
  return Promise.resolve({
    run: () => Promise.resolve({}),
    get: () => Promise.resolve({}),
    all: () => Promise.resolve([]),
    exec: () => Promise.resolve({}),
    close: () => Promise.resolve()
  });
};

export default { open };