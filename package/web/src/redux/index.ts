import { configureStore } from '@reduxjs/toolkit'
import { LoginStore } from './slice/login'

export const ReduxStore = configureStore({
  reducer: {
    login: LoginStore.slice.reducer
  }
})

// // Can still subscribe to the store
// store.subscribe(() => console.log(store.getState()))

// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented())
// // {value: 1}
// store.dispatch(incremented())
// // {value: 2}
// store.dispatch(decremented())
// // {value: 1}