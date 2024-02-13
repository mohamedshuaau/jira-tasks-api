import { userSeeder } from './seeders/user.seeder';

async function seed(): Promise<void> {
  await userSeeder();
}

seed().catch((error) => {
  console.error(error);
});
