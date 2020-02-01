import * as firebase from 'firebase/app';
import 'firebase/database';

export default {
    state: {
        student: []
    },
    mutations: {
        setStudent (state, payload) {
            state.student = payload
        }
    },
    actions: {
        async uploadStudent ({commit}) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`globalDiary/${this.state.settings.schoolId}/globalDiary/${this.state.settings.level}/${this.state.settings.group}/addUser`)
                    .once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const student = snapshot.val();
                            commit('setStudent', student)
                        }
                    });

                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        },
        async setAccess ({commit}, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.database().ref(`${payload[0]}/settings/joinDiary`)
                    .update(payload[1]);
                await firebase.database().ref(`globalDiary/${this.state.settings.schoolId}/globalDiary/${this.state.settings.level}/${this.state.settings.group}/addUser/${payload[2]}`)
                    .update(payload[1]);
                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message);
                commit('setLoading', false);
                throw error
            }
        }
    }
}
