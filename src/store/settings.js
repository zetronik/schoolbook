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
        theme: false,
        years: null,
        weeks: null,
        lessonWeek: []
    },
    mutations: {
        setSettings (state, payload) {
            state.level = payload.level;
            localStorage.level = payload.level;
            state.group = payload.group;
            localStorage.group = payload.group;
            state.years = payload.year;
            localStorage.years = payload.year;
            state.name = payload.name;
            localStorage.name = payload.name;
            state.surname = payload.surname;
            localStorage.surname = payload.surname;
            state.select = payload.school;
            localStorage.select = payload.school;
            state.lessonWeek = payload.lessons;
            localStorage.admin = payload.admin;
            localStorage.student = payload.student;
            if (payload.admin) {
                localStorage.schoolId = payload.adminDiary.idDiary;
                localStorage.grp = payload.adminDiary.grp;
                localStorage.lvl = payload.adminDiary.lvl;
            } else if (payload.student) {
                localStorage.schoolId = payload.joinDiary.idDiary;
                localStorage.grp = payload.joinDiary.grp;
                localStorage.lvl = payload.joinDiary.lvl;
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
                await firebase.database().ref(`${localStorage.id}/settings`).update(payload);
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
                await firebase.database().ref(`${localStorage.id}`).child(`/diary`).set(payload[1]);
                await firebase.database().ref(`${localStorage.id}/settings`).update(payload[0]);
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
                await firebase.database().ref(`${localStorage.id}/settings/`)
                    .child(`lessons`)
                    .update(payload);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async schoolItem ({ commit }, payload) {
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
