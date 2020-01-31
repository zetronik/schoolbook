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
            commit('setUpload', true);
            try {
                await firebase.database().ref(`globalDiary/${this.state.settings.schoolId}/globalDiary/${this.state.settings.lvl}/${this.state.settings.grp}/diary/${this.state.settings.years}/${this.state.global.weeks}`).update(payload);
                commit('setUpload', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setUpload', false);
                throw error
            }
        },
        async pastGlobalWeeks ({ commit }, payload) {
            commit('clearError');
            commit('setDownload', true);
            try {
                await firebase.database().ref(`globalDiary/${this.state.settings.schoolId}/globalDiary/${this.state.settings.lvl}/${this.state.settings.grp}/diary/${this.state.settings.years}/${payload}`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const lessonWeek = snapshot.val();
                            commit('setGlobalLessonWeek', lessonWeek)
                        }
                    });

                commit('setDownload', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setDownload', false);
                throw error
            }
        },
        async writeGlobalLessons ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${this.state.settings.schoolId}/globalDiary/${this.state.settings.lvl}/${this.state.settings.grp}/lessons`)
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
