import * as firebase from 'firebase'

export default {
    state: {
        weeks: null,
        lessonWeek: [],
        lessons: []
    },
    mutations: {
        setLessonWeek (state, payload) {
            state.lessonWeek = payload;
        },
        setLessons (state, payload) {
            state.lessons = payload;
        }
    },
    actions: {
        async syncDiary ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`${sessionStorage.id}/diary/${sessionStorage.years}/${this.state.diary.weeks}`).update(payload);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async pastWeeks ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`${sessionStorage.id}/diary/${sessionStorage.years}/${payload}`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const lessonWeek = snapshot.val();
                            commit('setLessonWeek', lessonWeek)
                        }
                    });

                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async writeLessons ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`${sessionStorage.id}/settings/lessons`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const lessons = snapshot.val();
                            commit('setLessons', lessons)
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
    modules: {
    }
}
