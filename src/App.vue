<template>
    <v-app id="inspire">
        <v-navigation-drawer
                v-model="drawer"
                app
                clipped
        >
            <v-list dense>
                <v-list-item link v-for="link in links" :key="link.title" :to="link.url">
                    <v-list-item-action>
                        <v-icon>{{link.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{link.title}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link  v-if="isUserLoggedIn" @click="onLogout">
                    <v-list-item-action>
                        <v-icon>mdi-logout-variant</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Exit</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
                dense
                app
                clipped-left
                color="primary"
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>Application</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-switch class="mt-6" v-model="$vuetify.theme.dark"></v-switch>
        </v-app-bar>

        <v-content>
            <router-view></router-view>
        </v-content>
        <template v-if="error">
            <v-snackbar
                    :left="true"
                    :timeout="5000"
                    :multi-line="true"
                    color="error"
                    @input="closeError"
                    :value="true"
            >
                {{error}}
                <v-btn dark @click.native="closeError">close</v-btn>
            </v-snackbar>
        </template>
        <v-footer app color="primary">
            <span>&copy; {{copyDate.getFullYear()}}</span>
        </v-footer>
    </v-app>
</template>

<script>
    export default {
        data: () => ({
            drawer: null,
            copyDate: new Date(),
            dark: false
        }),
        methods: {
            closeError () {
                this.$store.dispatch('clearError')
            },
            onLogout () {
                this.$store.dispatch('logoutUser');
                this.$router.push('/')
            }
        },
        computed: {
            error () {
                return this.$store.getters.error
            },
            isUserLoggedIn () {
                return this.$store.getters.isUserLoggedIn
            },
            links() {
                if (this.isUserLoggedIn) {
                    return [
                        {title: 'Home', url: '/', icon: 'mdi-home'},
                        {title: 'Dashboard', url: '/dashboard', icon: 'mdi-view-dashboard'},
                        {title: 'Global diary', url: '/admin', icon: 'mdi-settings'},
                        {title: 'Settings', url: '/settings', icon: 'mdi-settings'},
                    ]
                }
                return [
                    {title: 'Home', url: '/', icon: 'mdi-home'},
                    {title: 'Login', url: '/login', icon: 'mdi-account'},
                    {title: 'Registration', url: '/registration', icon: 'mdi-account-plus'}
                ]
            }
        }
    }
</script>
<style scoped>

</style>

