import {
  Binding,
  BindingKey,
  BindingScope,
  BindingTemplate,
  Component,
  ContextTags,
  createBindingFromClass,
  extensionFor,
  extensionPoint,
  extensions,
  Getter,
  injectable,
} from '@loopback/core';

export const GREETER_EXTENSION_POINT_NAME = 'greeters';
export const asGreeter: BindingTemplate = binding => {
  extensionFor(GREETER_EXTENSION_POINT_NAME)(binding);
  binding.tag({[ContextTags.NAMESPACE]: GREETER_EXTENSION_POINT_NAME});
};
export const GREETING_SERVICE = BindingKey.create<GreetingService>(
  'services.GreetingService',
);

export interface Greeter {
  language: string;
  greet(name: string): string;
}

@extensionPoint(GREETER_EXTENSION_POINT_NAME)
@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {
    [ContextTags.NAME]: 'GreetingService',
    [ContextTags.NAMESPACE]: 'services',
  },
})
export class GreetingService {
  constructor(
    @extensions()
    private getGreeters: Getter<Greeter[]>,
  ) {}

  async greet(lang: string, name: string): Promise<string> {
    const greeters = await this.getGreeters();
    const greeter = greeters.find(x => x.language === lang);
    return greeter?.greet(name) ?? `Hello ${name}`;
  }
}

@injectable(asGreeter)
export class GreeterEnglish implements Greeter {
  constructor() {
    console.log('bbbbbbbbbbbba');
  }
  language = 'en';
  greet(name: string): string {
    return `Hello ${name}`;
  }
}

@injectable(asGreeter)
export class GreeterPersian implements Greeter {
  constructor() {
    console.log('faaaaaaaa');
  }
  language = 'fa';
  greet(name: string): string {
    return `سلام ${name}`;
  }
}

export class GreetingComponent implements Component {
  bindings: Binding[] = [
    createBindingFromClass(GreetingService, {key: GREETING_SERVICE}),
    createBindingFromClass(GreeterEnglish),
    createBindingFromClass(GreeterPersian),
  ];
}
