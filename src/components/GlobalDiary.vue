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
                                        <v-btn icon @click="editDialog(day.lesson, item.dayLesson, index, i, day.homework)">
                                            <v-icon >mdi-pencil</v-icon>
                                        </v-btn>
                                        {{day.lesson}}</td>
                                    <td v-if="day.homework">
                                        <v-icon v-for="n in day.homework.length">mdi-book-open-page-variant</v-icon>
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
            <v-btn :loading="upload" @click="syncDiary" color="secondary">Save</v-btn>
            <v-btn :loading="download" @click="downloadDiary" color="warning">Download</v-btn>
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
                        Lesson: <v-text-field
                            :disabled="!$store.state.settings.admin"
                            class="ml-1"
                            dense
                            v-model="less"></v-text-field>
                    </v-input>
                    <v-divider></v-divider>
                    <v-card>
                        <v-list-item-group color="primary">
                            <v-list-item
                                    v-for="(item, i) in work"
                                    :key="i"
                            >
                                <v-list-item-content>
                                    <v-list-item-title v-text="item.homework"></v-list-item-title>
                                    <v-list-item-action-text v-text="item.name"></v-list-item-action-text>
                                </v-list-item-content>
                                <v-list-item-action v-if="item.id === $store.state.user.user.id">
                                    <v-btn icon @click="editHomework(i)">
                                        <v-icon>mdi-pencil-outline</v-icon>
                                    </v-btn>
                                    <v-btn icon @click="delHomework(i)">
                                        <v-icon>mdi-delete-forever-outline</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-item-group>
                    </v-card>
                    <v-textarea
                            class="ma-2"
                            outlined
                            width="100%"
                            name="input-7-4"
                            label="Home work"
                            v-model="homework"
                            :value="homework"
                    ></v-textarea>
                    <v-btn @click="saveHomework(homework)" color="secondary">Save</v-btn>
                    <v-btn @click="clearHomework" color="warning">Clear</v-btn>
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
            work: [],
            homework: ''
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            },
            download () {
                return this.$store.getters.download
            },
            upload () {
                return this.$store.getters.upload
            }
        },
        methods: {
            delHomework (val) {
                this.work.splice(val, 1)
            },
            editHomework (val) {
                this.homework = this.work[val].homework;
                this.delHomework(val)
            },
            saveHomework (val) {
                this.work.push({
                    name: `${this.$store.state.settings.name} ${this.$store.state.settings.surname}`,
                    homework: val,
                    id: this.$store.state.user.user.id
                });
                this.clearHomework()
            },
            clearHomework () {
                this.homework = ''
            },
            editDialog (less, deyLesson, index, day, work) {
                this.work = [];
                this.dialog = true;
                this.less = less;
                this.day = day;
                this.index = index;
                if (typeof work === 'object') {
                    this.work = work;
                }
            },
            saveDialog () {
                this.dialog = false;
                this.$parent.globalWeek[this.day].dayLesson[this.index].homework = this.work;
                this.$parent.globalWeek[this.day].dayLesson[this.index].lesson = this.less;
                this.syncDiary();
                this.clearHomework()
            },
            async downloadDiary () {
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
