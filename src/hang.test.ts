/**
 * Reproduction: process hangs after the test suite completes.
 *
 * Expected: test suite exits immediately after afterAll.
 * Actual:   test suite stalls ~10 s before the process finally exits.
 */
import { MikroORM, defineConfig, defineEntity, p } from "@mikro-orm/pglite";

const UserSchema = defineEntity({
  name: "User",
  properties: {
    id: p.integer().primary().autoincrement(),
    name: p.string(),
  },
});
class User extends UserSchema.class {}
UserSchema.setClass(User);

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init(
    defineConfig({ entities: [User], allowGlobalContext: true }),
  );
  await orm.schema.create();
});

afterAll(async () => {
  await orm.close(true);
});

test("sample", async () => {
  const em = orm.em;
  em.persist(em.create(User, { name: "Alice" }));
  await em.flush();

  const users = await em.findAll(User);
  expect(users).toHaveLength(1);
  expect(users[0].name).toBe("Alice");
});
