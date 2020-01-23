import * as firebase from 'firebase/app';
import 'firebase/database';

export default {
    state: {
        school: [],
        schoolId: null,
        globalSchool: null
    },
    mutations: {
        setSchool (state, payload) {
            state.school = payload
        },
        setSchoolId (state, payload) {
            state.schoolId = payload
        },
        setGlobal (state, payload) {
            state.globalSchool = payload
        }
    },
    actions: {
        async downloadSchool ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`school/49000`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const items = snapshot.val();
                            commit('setSchool', items)
                        }
                    });
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async uploadSchool ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                const schoolId = await firebase.database().ref(`globalDiary/`).push(payload);
                commit('setSchoolId', schoolId.path.pieces_[1]);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async searchSchool ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const items = snapshot.val();
                            commit('setGlobal', items)
                        }
                    });
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
    },
    getters: {}
}
