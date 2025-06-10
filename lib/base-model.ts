// Base model class for the Ghost Automation Dashboard
export interface BaseModelOptions {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export abstract class BaseModel {
  public id: string;
  public created_at: Date;
  public updated_at: Date;

  constructor(options: BaseModelOptions = {}) {
    this.id = options.id || this.generateId();
    this.created_at = options.created_at || new Date();
    this.updated_at = options.updated_at || new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  public touch(): void {
    this.updated_at = new Date();
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export default BaseModel;