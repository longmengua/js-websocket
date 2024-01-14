import { createSlice } from '@reduxjs/toolkit'
import { LoginType } from './types'
import { Util } from '../../../utils/util'

const initState :LoginType = {
  authToken: Util.getCookie("authToken"),
  managerInfo: {
    id: 0,
    name: "manager",
    email: "",
    imageUrl: ""
  },
  branchCampusInfos: [],
  managerRoleInfos: [],
  features: []
}

const slice = createSlice({
  name: 'login',
  initialState: {...initState},
  reducers: {
    login: (state, action) => {
      return Util.copyValueWithNewObject({...action.payload}, state)
    },
    logout: (state) => {
      state = {...initState}
    }
  }
})

export const LoginStore = {
  slice,
  initState
}