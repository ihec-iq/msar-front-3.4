import { reactive, readonly } from "vue";

// eslint-disable-next-line
export abstract class ReactiveRepository<T extends Record<string, any>> {
  protected state: T;

  constructor() {
    const data = this.data();
    this.setup(data);
    this.state = reactive(data) as T;
  }

  protected abstract data(): T;

  // eslint-disable-next-line
  protected setup(data: T): void {}

  public getState(): T {
    return readonly(this.state) as T;
  }
}
