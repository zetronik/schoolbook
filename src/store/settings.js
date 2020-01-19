import * as firebase from 'firebase'

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
            sessionStorage.level = payload.level;
            state.group = payload.group;
            sessionStorage.group = payload.group;
            state.years = payload.year;
            sessionStorage.years = payload.year;
            state.name = payload.name;
            sessionStorage.name = payload.name;
            state.surname = payload.surname;
            sessionStorage.surname = payload.surname;
            state.select = payload.school;
            sessionStorage.select = payload.school;
            state.lessonWeek = payload.lessons;
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
                await firebase.database().ref(`${sessionStorage.id}/settings`).update(payload);
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
                await firebase.database().ref(`${sessionStorage.id}`).child(`/diary`).set(payload[1]);
                await firebase.database().ref(`${sessionStorage.id}/settings`).update(payload[0]);
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
                await firebase.database().ref(`${sessionStorage.id}/settings/`)
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
