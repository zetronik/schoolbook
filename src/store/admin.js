import * as firebase from 'firebase/app';
import 'firebase/database';

export default {
    state: {
        school: [],
        schoolId: null,
        globalSchool: null,
        lessonWeek: [],
        lessons: []
    },
    mutations: {
        setSchoolId (state, payload) {
            state.schoolId = payload
        },
        setGlobal (state, payload) {
            state.globalSchool = payload
        },
        setAdminLessons (state, payload) {
            state.lessons = payload;
        }
    },
    actions: {
        async createGlobal ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${localStorage.schoolId}/globalDiary/${localStorage.level}/${localStorage.group}`).child(`/diary`).set(payload[1]);
                await firebase.database().ref(`globalDiary/${localStorage.schoolId}/globalDiary/${localStorage.level}/${localStorage.group}`).update(payload[0]);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async saveGlobalDiary ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${localStorage.schoolId}/globalDiary/${localStorage.level}/${localStorage.group}`)
                    .child(`lessons`)
                    .update(payload);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async writeAdminLessons ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${localStorage.schoolId}/globalDiary/${localStorage.level}/${localStorage.group}/lessons`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const lessons = snapshot.val();
                            commit('setAdminLessons', lessons)
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
                const schoolId = await firebase.database().ref(`globalDiary/`).push(payload[0]);
                payload[1].adminDiary.idDiary = schoolId.path.pieces_[1];
                localStorage.schoolId = schoolId.path.pieces_[1];
                await firebase.database().ref(`${localStorage.id}/settings`).update(payload[1]);
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
                        id: localStorage.id,
                        user: `${localStorage.name} ${localStorage.surname}`
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
