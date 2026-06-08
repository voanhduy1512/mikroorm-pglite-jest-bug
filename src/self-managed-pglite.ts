/**
 * Reproduction: process hangs after the test suite completes even when PGlite
 * is managed outside MikroORM and closed explicitly by the user.
 *
 * Expected: test suite exits immediately after afterAll.
 * Actual:   test suite stalls ~10 s before the process finally exits.
 */
import { PGlite } from "@electric-sql/pglite";
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

let pglite: PGlite;
let orm: MikroORM;

beforeAll(async () => {
  pglite = await PGlite.create();

  orm = await MikroORM.init(
    defineConfig({
      entities: [User],
      allowGlobalContext: true,
      driverOptions: { pglite },
    }),
  );
  await orm.schema.create();
});

afterAll(async () => {
  await orm.close(true);
  await pglite.close();
});

test("sample", async () => {
  const em = orm.em;
  em.persist(em.create(User, { name: "Alice" }));
  await em.flush();

  const users = await em.findAll(User);
  expect(users).toHaveLength(1);
  expect(users[0].name).toBe("Alice");
});
