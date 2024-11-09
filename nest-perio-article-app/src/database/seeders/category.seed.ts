/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category } from 'src/api/category/entity/category.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class CategorySeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.query(`SET FOREIGN_KEY_CHECKS=0;`);
    await connection.query(`TRUNCATE category;`);
    await connection.query(`SET FOREIGN_KEY_CHECKS=1;`);

    await connection
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values([
        {
          id: 1,
          name: 'Anitimicrobials',
          color: '#FDE1F2',
        },
        {
          id: 2,
          name: 'Antibiotic Management of Periodontal Diseases ',
          color: '#C9FDFE',
        },
        {
          id: 3,
          name: 'Gingival Augmentation and vestibular extension  ',
          color: '#C9FDFE',
        },
        {
          id: 4,
          name: 'Longitudinal Studies of Periodonal Therapy ',
          color: '#DAE2FD',
        },
        {
          id: 5,
          name: 'GV, Curettage ',
          color: '#FEF1A1',
        },
        {
          id: 6,
          name: 'Occlusion ',
          color: '#FCC7E6',
        },
        {
          id: 7,
          name: 'Root Amputation and Hemisection',
          color: '#ACEFE8',
        },
        {
          id: 8,
          name: 'Osseous Grafts & Reconstructive Osseous Surgery ',
          color: '#D4EDFE',
        },
        {
          id: 9,
          name: 'Periodontal Dressings; Root Sensitivity ',
          color: '#FED7B5',
        },
        {
          id: 10,
          name: 'Periodontal Flaps ',
          color: '#E9DAFD',
        },
        {
          id: 11,
          name: 'Reattachment and Regeneration',
          color: '#FDE1F2',
        },
      ])
      .execute();
    console.log('seeding complete');
  }
}
