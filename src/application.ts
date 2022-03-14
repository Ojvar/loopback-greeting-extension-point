import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {GreetingComponent, GREETING_SERVICE} from './services';

export {ApplicationConfig};

export class Lb4GreeterExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({path: '/explorer'});
    this.component(RestExplorerComponent);

    /* Config */
    this.component(GreetingComponent);

    this.onStart(async () => {
      const greetingService = await this.get(GREETING_SERVICE);

      let msg = await greetingService.greet('en', 'Raymond');
      console.log('English:', msg);

      msg = await greetingService.greet('fa', 'Raymond');
      console.log('Persian:', msg);
    });

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
