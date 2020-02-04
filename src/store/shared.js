export default {
  state: {
    download: false,
    upload: false,
    loading: false,
    error: null,
    msg: null
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setDownload (state, payload) {
      state.download = payload
    },
    setUpload (state, payload) {
      state.upload = payload
    },
    setMsg (state, payload) {
      state.msg = payload
    },
    clearMsg (state) {
      state.msg = null
    },
  },
  actions: {
    setLoading ({commit}, payload) {
      commit('setLoading', payload)
    },
    setError ({commit}, payload) {
      commit('setError', payload)
    },
    clearError ({commit}) {
      commit('clearError')
    },
    setDownload ({commit}, payload) {
      commit('setDownload', payload)
    },
    setUpload ({commit}, payload) {
      commit('setUpload', payload)
    },
    setMsg ({commit}, payload) {
      commit('setMsg', payload)
    },
    clearMsg ({commit}) {
      commit('clearMsg')
    },
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    download (state) {
      return state.download
    },
    upload (state) {
      return state.upload
    },
    msg (state) {
      return state.msg
    }
  }
}
