import mockRequest from '@/utils/mockRequest'

export default {

  state: {
    list: {}
  },
  getters: {

  },
  mutations: {
    GetData(state, value) {
      state.list = value
    }
  },
  actions: {
    async getData({ commit }) {
      let result = await mockRequest.get('/home/list')
      if (result.code == 20000) {
        commit('GetData', result.data)
      }
    }
  },
}