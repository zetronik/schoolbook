<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn to="/global/admin"><v-icon>mdi-arrow-right-circle</v-icon>create or connect to the global diary</v-btn>
            </v-col>
        </v-row>
            <creat-global-diary v-if="boolComponent" :writeIn="writeIn"></creat-global-diary>
        <v-row class="d-flex justify-space-around">
            <v-col cols="12" md="12">
                <h3 class="text--secondary text-center">Расписание уроков</h3>
                <v-btn v-if="boolComponent" :disabled="btnSave" :loading="loading" @click="saveDiary" color="secondary">Save</v-btn>
                <v-btn :loading="loading" @click="writeIn" color="accent" class="ml-2">Write in</v-btn>
            </v-col>
            <v-col cols="12" md="4" v-for="(day, dayWeek) in diary">
                <p class="text--primary text-center display-1">{{day.dayWeeks}}</p>
                <v-text-field
                        dense
                        :disabled="!boolComponent"
                        v-for="(less, index) in day.dayLesson"
                        :v-model="day.dayLesson[index]"
                        :key="index"
                        :value="less.lesson"
                        @change="diarySave(dayWeek, $event, index)"
                ></v-text-field>
                <v-btn v-if="boolComponent" @click="minusLesson(dayWeek)" class="mx-1 float-left" fab dark small color="primary">
                    <v-icon dark>mdi-minus</v-icon>
                </v-btn>
                <v-btn v-if="boolComponent" @click="plusLesson(dayWeek)" class="mx-1 float-right" fab dark small color="primary">
                    <v-icon dark>mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import CreatGlobalDiary from "../components/CreatGlobalDiary";

    export default {
        components: {CreatGlobalDiary},
        data: () => ({
            btnSave: false,
            diary: null,
            boolComponent: false
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            }
        },
        methods: {
            async writeIn () {
                await this.$store.dispatch('writeAdminLessons');
                this.diary = this.$store.state.admin.lessons;
            },
            async saveDiary () {
                this.$store.state.admin.lessonWeek = this.diary;
                await this.$store.dispatch('saveGlobalDiary', this.diary);
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
            this.boolComponent = this.$store.state.settings.admin;
        },
        beforeDestroy: function () {
            this.saveDiary();
            this.diary = null
        }
    }
</script>

<style scoped>

</style>
