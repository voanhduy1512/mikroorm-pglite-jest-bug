# MikroORM + PGlite: process hangs after `orm.close()`

Reproduction for a bug where Jest does not exit cleanly after the test suite finishes.

## Observed behaviour

The test in `src/hang.test.ts` passes, but Jest hangs for ~10 seconds before the process exits:

```bash
$ time pnpm test
$ NODE_OPTIONS='--experimental-vm-modules' jest
(node:54269) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 PASS  src/hang.test.ts
  ✓ sample (22 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.857 s, estimated 5 s
Ran all test suites.
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
pnpm test  4.58s user 1.72s system 45% cpu 13.755 total
```

## Reproduce

```sh
pnpm install
pnpm test
```
