<template>
    <v-row>
        <v-col cols="12">
            <h4 class="text-center">Global Diary</h4>
        </v-col>
        <v-col cols="12" v-if="loading">
            <v-progress-linear
                    indeterminate
                    color="green"
            ></v-progress-linear>
        </v-col>
        <v-col

                sm="12"
                lg="12"

        >
            <v-expansion-panels>
                <v-expansion-panel
                        v-for="(item, i) in globalWeek"
                        :key="i"
                >
                    <v-expansion-panel-header>{{ item.dayWeeks }}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th class="text-left title">Lesson</th>
                                    <th class="text-left title">Homework</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(day, index) in item.dayLesson" :key="index">
                                    <td>
                                        <v-icon @click="editHomework(day.lesson, item.dayLesson, index, i, day.homework)">mdi-pencil</v-icon>
                                        {{day.lesson}}</td>
                                    <td>
                                        {{day.homework}}
                                    </td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
        <v-col cols="12" md="12" class="d-flex justify-space-between align-center wrap">
            <v-btn @click="syncDiary" color="secondary">Save</v-btn>
            <v-btn :loading="loading" @click="download" color="warning">Download</v-btn>
            <v-btn @click="writeIn" color="info">Write in</v-btn>
        </v-col>
        <v-col
                sm="12"
                lg="12"
        >
            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Settings</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark text @click="saveDialog">Save</v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-input class="ma-2">
                        Lesson: <v-text-field class="ml-1" dense v-model="less"></v-text-field>
                    </v-input>
                    <v-divider></v-divider>
                    <v-textarea
                            class="ma-2"
                            outlined
                            width="100%"
                            name="input-7-4"
                            label="Home work"
                            v-model="work"
                            :value="work"
                    ></v-textarea>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script>
    const date = new Date();
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const week = date.getDay();
    const startDay = new Date((date - (86400000*(week - 1))));
    let hour = 0;
    if (new Date(year, 6,1,0,0,0,0).getTimezoneOffset() - date.getTimezoneOffset() === 60) {
        hour = 1
    }
    const start = new Date(year, month, startDay.getDate(), hour,0,0,0).valueOf();
    export default {
        props: ['globalWeek', 'start'],
        data: () => ({
            dialog: false,
            tab: null,
            weeks: null,
            day: null,
            index: null,
            less: '',
            work: ''
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            }
        },
        methods: {
            editHomework (less, deyLesson, index, day, work) {
                this.dialog = true;
                this.less = less;
                this.day = day;
                this.index = index;
                this.work = work;
            },
            saveDialog () {
                this.dialog = false;
                this.$parent.globalWeek[this.day].dayLesson[this.index].homework = this.work;
                this.$parent.globalWeek[this.day].dayLesson[this.index].lesson = this.less;
                this.syncDiary()
            },
            async download () {
                if (this.$store.state.settings.schoolId !== null) {
                    await this.$store.dispatch('pastGlobalWeeks', this.start);
                    this.$parent.globalWeek = this.$store.state.global.lessonWeek;
                }
            },
            async writeIn () {
                if (this.$store.state.settings.schoolId !== null) {
                    if (this.$store.state.settings.admin) {
                        await this.$store.dispatch('writeGlobalLessons');
                        this.$parent.globalWeek = this.$store.state.global.lessons;
                        this.syncDiary()
                    }
                }
            },
            async syncDiary () {
                if (this.$store.state.settings.schoolId !== null) {
                    this.$store.state.global.lessonWeek = this.globalWeek;
                    this.$store.state.global.weeks = this.start;
                    await this.$store.dispatch('syncGlobalDiary', this.globalWeek)
                }
            }
        },
        created () {
        },
        beforeDestroy() {
        }
    }
</script>

<style scoped>

</style>
