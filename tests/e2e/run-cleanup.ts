import globalTeardown from './global-teardown'

void globalTeardown().catch((error: unknown) => {
  console.error('E2E cleanup failed:', error)
  process.exit(1)
})
