import app from '../../src/app';

describe('\'surveys\' service', () => {
  it('registered the service', () => {
    const service = app.service('surveys');
    expect(service).toBeTruthy();
  });
});
