import { setActivePinia, createPinia } from 'pinia'
import useUserStore from '@/stores/user'
import { beforeEach } from 'vitest'

describe('store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('authenticates user', async () => {
    const store = useUserStore()

    expect(store.useLoggedIn).not.toBe(true)
    await store.authenticate({})
    expect(store.useLoggedIn).toBe(true)
  })
})
