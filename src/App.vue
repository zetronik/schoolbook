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
                        <v-list-item-title>{{$vuetify.lang.t(`$vuetify.app.menu.exit`)}}</v-list-item-title>
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
            <v-toolbar-title>{{$vuetify.lang.t(`$vuetify.app.title`)}}</v-toolbar-title>
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
                <v-btn dark @click.native="closeError">{{$vuetify.lang.t(`$vuetify.close`)}}</v-btn>
            </v-snackbar>
        </template>
        <template v-if="msg">
            <v-snackbar
                    :left="true"
                    :timeout="3000"
                    :multi-line="true"
                    color="info"
                    @input="closeMsg"
                    :value="true"
            >
                {{msg}}
            </v-snackbar>
        </template>
    </v-app>
</template>

<script>
    export default {
        data: () => ({
            drawer: null,
            dark: false,
            message: null
        }),
        methods: {
            closeError () {
                this.$store.dispatch('clearError')
            },
            onLogout () {
                this.$store.dispatch('logoutUser');
                this.$router.push('/')
            },
            closeMsg () {
                this.$store.dispatch('clearMsg')
            },
        },
        computed: {
            msg () {
                return  this.$store.getters.msg
            },
            error () {
                return this.$store.getters.error
            },
            isUserLoggedIn () {
                return this.$store.getters.isUserLoggedIn
            },
            links() {
                if (this.isUserLoggedIn) {
                    return [
                        {title: this.$vuetify.lang.t('$vuetify.app.menu.home'), url: '/', icon: 'mdi-home'},
                        {title: this.$vuetify.lang.t('$vuetify.app.menu.dashboard'), url: '/dashboard', icon: 'mdi-view-dashboard'},
                        {title: this.$vuetify.lang.t('$vuetify.app.menu.globalDiary'), url: '/global', icon: 'mdi-settings'},
                        {title: this.$vuetify.lang.t('$vuetify.app.menu.settings'), url: '/settings', icon: 'mdi-settings'},
                    ]
                }
                return [
                    {title: this.$vuetify.lang.t('$vuetify.app.menu.home'), url: '/', icon: 'mdi-home'},
                    {title: this.$vuetify.lang.t('$vuetify.app.menu.login'), url: '/login', icon: 'mdi-account'},
                    {title: this.$vuetify.lang.t('$vuetify.app.menu.registration'), url: '/registration', icon: 'mdi-account-plus'}
                ]
            }
        }
    }
</script>
<style scoped>

</style>

