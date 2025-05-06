import { setSeederFactory } from 'typeorm-extension';
import { Organization } from '../entities/Organization';
import { faker } from '@faker-js/faker';

export default setSeederFactory(Organization, () => {
  const org = new Organization();
  org.name = faker.company.name();
  org.description = faker.company.catchPhrase();
  return org;
});
