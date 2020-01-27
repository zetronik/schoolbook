<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn to="/global/admin"><v-icon>mdi-arrow-right-circle</v-icon>create or connect to the global diary</v-btn>
            </v-col>
        </v-row>
            <create-diary :writeIn="writeIn"></create-diary>
        <v-row class="d-flex justify-space-around">
            <v-col cols="12" md="12">
                <h3 class="text--secondary text-center">Расписание уроков</h3>
                <v-btn :disabled="btnSave" :loading="loading" @click="saveDiary" color="secondary">Save</v-btn>
                <v-btn :loading="loading" @click="writeIn" color="accent" class="ml-2">Write in</v-btn>
            </v-col>
            <v-col cols="12" md="4" v-for="(day, dayWeek) in diary">
                <p class="text--primary text-center display-1">{{day.dayWeeks}}</p>
                <v-text-field
                        dense
                        v-for="(less, index) in day.dayLesson"
                        :v-model="day.dayLesson[index]"
                        :key="index"
                        :value="less.lesson"
                        @change="diarySave(dayWeek, $event, index)"
                ></v-text-field>
                <v-btn @click="minusLesson(dayWeek)" class="mx-1 float-left" fab dark small color="primary">
                    <v-icon dark>mdi-minus</v-icon>
                </v-btn>
                <v-btn @click="plusLesson(dayWeek)" class="mx-1 float-right" fab dark small color="primary">
                    <v-icon dark>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import CreateDiary from "../components/CreateDiary";

    export default {
        components: {CreateDiary},
        data: () => ({
            btnSave: false,
            diary: null,
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            }
        },
        methods: {
            async writeIn () {
                //await this.$store.dispatch('writeLessons');
                this.diary = this.$store.state.diary.lessons;
            },
            async saveDiary () {
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
                this.$store.state.settings.lessonWeek = this.diary;
                //await this.$store.dispatch('saveDiary', this.diary);
            },
            diarySave (dayWeek, event, diary) {
                this.diary[dayWeek].dayLesson[diary].lesson = event;
                this.bool(dayWeek)
            },
            minusLesson (dayWeek) {
                if (this.diary[dayWeek].dayLesson.length === 1) {
                    this.diary[dayWeek].dayLesson[0] = {lesson: '', homework: ''}
                } else {
                    this.diary[dayWeek].dayLesson.pop()
                }
            },
            plusLesson (dayWeek) {
                this.diary[dayWeek].dayLesson.push({lesson: '', homework: ''})
            },
            bool (val) {
                this.diary[val].dayLesson.length > 1 ? this.btnSave = false : this.btnSave = true
            }
        },
        async created () {
            if (!this.diary) {
                this.writeIn();
                this.btnSave = true
            }
        },
        beforeDestroy: function () {
            this.saveDiary();
        }
    }
</script>

<style scoped>

</style>
