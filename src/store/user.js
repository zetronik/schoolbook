import * as firebase from 'firebase'

class User {
    constructor (id) {
        this.id = id
    }
}

export default {
    state: {
        user: null
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload;
        },

    },
    actions: {
        async registerUser ({commit}, {email, password}) {
            commit('clearError');
            commit('setLoading', true);
            try {
                const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
                sessionStorage.id = user.uid;
                commit('setUser', new User(user.uid));
                commit('setLoading', false)
            } catch (error) {
                commit('setLoading', false);
                commit('setError', error.message);
                throw error
            }
        },
        async loginUser ({commit}, {email, password}) {
            commit('clearError');
            commit('setLoading', true);
            try {
                const user = await firebase.auth().signInWithEmailAndPassword(email, password);
                sessionStorage.id = user.user.uid;
                await firebase.database().ref(`${user.user.uid}/settings/`).once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() && snapshot.val()) {
                            const setting = snapshot.val();
                            commit('setSettings', setting)
                        }
                    });
                sessionStorage.id = user.user.uid;
                commit('setUser', new User(user.user.uid));
                commit('setLoading', false)
            } catch (error) {
                commit('setLoading', false);
                commit('setError', error.message);
                throw error
            }
        },
        async autoLoginUser ({commit}, payload) {
            commit('clearError');
            commit('setLoading', true);
            try {
                await firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        sessionStorage.id = user.uid;
                        commit('setUser', new User(user.uid));
                    } else {
                        commit('setUser', null)
                    }
                });
                commit('setLoading', false)
            } catch (error) {
                commit('setLoading', false);
                commit('setError', error.message);
                throw error
            }


        },
        logoutUser ({commit}) {
            firebase.auth().signOut()
                .catch (error => {
                    commit('setError', error.message);
                });
            commit('setUser', null);
            localStorage.clear();
            sessionStorage.clear()
        }
    },
    getters: {
        user (state) {
            return state.user
        },
        isUserLoggedIn (state) {
            return state.user !== null
        }
    }
}
