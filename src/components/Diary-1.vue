<template>
    <v-row>
        <v-col
                v-if="!loading"
                sm="12"
                lg="12"
                class="pl-4"
        >
            <v-card>
                <v-tabs v-model="tab" center-active show-arrows centered grow>
                    <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                    <v-tab
                            v-for="(item, i) in diaryWeek"
                            :key="i"
                    >
                        {{ item.dayWeeks }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item
                            v-for="(item, dayWeek) in diaryWeek"
                            :key="dayWeek"
                    >
                        <v-simple-table dense>
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th class="text-left title">Lesson</th>
                                    <th class="text-left title">Homework</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(day, index) in item.dayLesson" :key="index">
                                    <td>{{day.lesson}}</td>
                                    <td>
                                        <v-text-field
                                                v-model="day.homework"
                                                :value="day.homework"
                                                @change="diarySave(dayWeek, $event, index)"
                                        ></v-text-field>
                                    </td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </v-col>
        <v-col v-else>
            <v-progress-linear
                    indeterminate
                    color="green"
            ></v-progress-linear>
        </v-col>
        <v-col cols="12" md="12">
            <v-btn @click="syncDiary" color="secondary">Save</v-btn>
            <v-btn :loading="loading" @click="download" color="secondary">Download</v-btn>
            <v-btn @click="writeIn" color="secondary">Write in</v-btn>
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
        props: ['diaryWeek', 'start'],
        data: () => ({
            tab: null,
            weeks: null
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            }
        },
        methods: {
            async download () {
                await this.$store.dispatch('pastWeeks', this.start);
                this.diaryWeek = this.$store.state.diary.lessonWeek;
            },
            async writeIn () {
                await this.$store.dispatch('writeLessons');
                this.diaryWeek = this.$store.state.diary.lessons;
                this.syncDiary()
            },
            diarySave (dayWeek, event, diary) {
                this.diaryWeek[dayWeek].dayLesson[diary].homework = event;
            },
            async syncDiary () {
                this.$store.state.diary.lessonWeek = this.diaryWeek;
                this.$store.state.diary.weeks = this.start;
                await this.$store.dispatch('syncDiary', this.diaryWeek)
            }
        }
    }
</script>

<style scoped>

</style>
