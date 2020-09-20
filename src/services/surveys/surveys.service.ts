// Initializes the `surveys` service on path `/surveys`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Surveys } from './surveys.class';
import createModel from '../../models/surveys.model';
import hooks from './surveys.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'surveys': Surveys & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/surveys', new Surveys(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('surveys');

  service.hooks(hooks);
}
