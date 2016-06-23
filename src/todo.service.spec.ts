/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { SailsService } from './sails.service';

describe('SailsService', () => {
  beforeEachProviders(() => [SailsService]);

  it('should ...',
      inject([SailsService], (service: SailsService) => {
    expect(service).toBeTruthy();
  }));
});
