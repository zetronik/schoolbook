import * as firebase from 'firebase/app';
import 'firebase/database';

export default {
    state: {
        items: [],
        level: null,
        group: null,
        select: null,
        name: '',
        surname: '',
        years: null,
        lessonWeek: [],
        admin: false,
        student: false,
        schoolId: null,
        grp: null,
        lvl: null,
        access: false
    },
    mutations: {
        setSettings (state, payload) {
            state.level = payload.level;
            state.group = payload.group;
            state.years = payload.year;
            state.name = payload.name;
            state.surname = payload.surname;
            state.select = payload.school;
            state.lessonWeek = payload.lessons;
            state.select = payload.school;
            state.surname = payload.surname;
            state.name = payload.name;
            state.years = payload.year;
            state.group = payload.group;
            state.level = payload.level;
            state.admin = payload.admin;
            state.student = payload.student;
            if (payload.admin) {
                state.schoolId = payload.adminDiary.idDiary;
                state.grp = payload.adminDiary.grp;
                state.lvl = payload.adminDiary.lvl;
                state.access = true
            } else if (payload.student) {
                state.schoolId = payload.joinDiary.idDiary;
                state.grp = payload.joinDiary.grp;
                state.lvl = payload.joinDiary.lvl;
                state.access = payload.joinDiary.access
            }
        },
        setItems (state, payload) {
            state.items = payload
        }
    },
    actions: {
        async saveSetting ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`${this.state.user.user.id}/settings`).update(payload);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async createDiary ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`${this.state.user.user.id}`).child(`/diary`).set(payload[1]);
                await firebase.database().ref(`${this.state.user.user.id}/settings`).update(payload[0]);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async saveDiary ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`${this.state.user.user.id}/settings/`)
                    .child(`lessons`)
                    .update(payload);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async schoolItem ({ commit }) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`school/49000`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const items = snapshot.val();
                            commit('setItems', items)
                        }
                    });

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
