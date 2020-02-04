<template>
    <v-form>
        <v-container>
            <set-user></set-user>
        </v-container>
        <v-container>
            <create-diary :writeIn="writeIn"></create-diary>
        </v-container>
        <v-container>
            <v-row class="d-flex justify-space-around">
                <v-col cols="12" md="12">
                    <h3 class="text--secondary text-center">Расписание уроков</h3>
                    <v-btn :disabled="btnSave" :loading="loading" @click="saveDiary" color="secondary">Save</v-btn>
                    <v-btn :loading="loading" @click="writeIn" color="accent" class="ml-2">Write in</v-btn>
                </v-col>
                <v-col cols="12" md="4" v-for="(day, dayWeek) in diary">
                    <p class="text--primary text-center display-1">{{$vuetify.lang.t(`$vuetify.dashboard.day[${dayWeek}]`)}}</p>
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
    </v-form>
</template>

<script>
    import SetUser from "../components/SetUser";
    import CreateDiary from "../components/CreateDiary";

    export default {
        components: {SetUser, CreateDiary},
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
                await this.$store.dispatch('writeLessons');
                this.diary = this.$store.state.diary.lessons;
            },
            async saveDiary () {
                this.$store.state.settings.lessonWeek = this.diary;
                await this.$store.dispatch('saveDiary', this.diary);
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
