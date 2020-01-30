import * as firebase from 'firebase/app';
import 'firebase/database';

export default {
    state: {
        weeks: null,
        lessonWeek: [],
        lessons: []
    },
    mutations: {
        setGlobalLessonWeek (state, payload) {
            state.lessonWeek = payload;
        },
        setGlobalLessons (state, payload) {
            state.lessons = payload;
        }
    },
    actions: {
        async syncGlobalDiary ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${localStorage.schoolId}/globalDiary/${localStorage.lvl}/${localStorage.grp}/diary/${localStorage.years}/${this.state.diary.weeks}`).update(payload);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async pastGlobalWeeks ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${localStorage.schoolId}/globalDiary/${localStorage.lvl}/${localStorage.grp}/diary/${localStorage.years}/${payload}`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const lessonWeek = snapshot.val();
                            commit('setGlobalLessonWeek', lessonWeek)
                        }
                    });

                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async writeGlobalLessons ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${localStorage.schoolId}/globalDiary/${localStorage.lvl}/${localStorage.grp}/lessons`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const lessons = snapshot.val();
                            commit('setGlobalLessons', lessons)
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
