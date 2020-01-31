import * as firebase from 'firebase/app';
import 'firebase/database';

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
            commit('setUpload', true);
            try {
                await firebase.database().ref(`${this.state.user.user.id}/diary/${this.state.settings.years}/${this.state.diary.weeks}`).update(payload);
                commit('setUpload', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setUpload', false);
                throw error
            }
        },
        async pastWeeks ({ commit }, payload) {
            commit('clearError');
            commit('setDownload', true);
            try {
                await firebase.database().ref(`${this.state.user.user.id}/diary/${this.state.settings.years}/${payload}`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const lessonWeek = snapshot.val();
                            commit('setLessonWeek', lessonWeek)
                        }
                    });

                commit('setDownload', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setDownload', false);
                throw error
            }
        },
        async writeLessons ({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`${this.state.user.user.id}/settings/lessons`)
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
    }
}
