import * as firebase from 'firebase/app';
import 'firebase/database';

export default {
    state: {
        school: [],
        schoolId: null,
        globalSchool: null
    },
    mutations: {
        setSchoolId (state, payload) {
            state.schoolId = payload
        },
        setGlobal (state, payload) {
            state.globalSchool = payload
        }
    },
    actions: {
        async uploadSchool ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                const schoolId = await firebase.database().ref(`globalDiary/`).push(payload[0]);
                payload[1].adminDiary.idDiary = schoolId.path.pieces_[1];
                sessionStorage.schoolId = schoolId.path.pieces_[1];
                await firebase.database().ref(`${sessionStorage.id}/settings`).update(payload[1]);
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
        async newDiary ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${payload.id}/globalDiary`).update(payload.cl);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async addUserForDiary ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                const addUser = [
                    {
                        id: sessionStorage.id,
                        user: `${sessionStorage.name} ${sessionStorage.surname}`
                    }
                ];
                await firebase.database().ref(`globalDiary/${payload.joinDiary.idDiary}/globalDiary/${payload.joinDiary.lvl}/${payload.joinDiary.grp}`)
                    .child('addUser')
                    .update(addUser);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        }
    },
    getters: {}
}
