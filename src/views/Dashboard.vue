<template>
    <v-row class="ma-0">
        <v-col cols="12" class="d-flex justify-space-between align-center ma-0">
            <v-btn @click="lessWeek" min-width="150px" width="50%">My Diary</v-btn>
            <v-btn @click="globWeek" min-width="150px" width="50%">Global Diary</v-btn>
        </v-col>
        <v-col class="d-flex justify-space-between align-center ma-0">
            <v-btn class="mx-2" fab color="info" @click="pastWeeks">
                <v-icon class="display-2" dark>mdi-arrow-left-drop-circle-outline</v-icon>
            </v-btn>
            <p class="text-center title">{{weeks}}</p>
            <v-btn class="mx-2" fab dark color="info" @click="nextWeeks">
                <v-icon class="display-2" dark>mdi-arrow-right-drop-circle-outline</v-icon>
            </v-btn>
        </v-col>
        <v-col v-if="my" sm="12" lg="12">
            <lesson-week :diaryWeek="diaryWeek" :start="start"></lesson-week>
        </v-col>
        <v-col v-if="global" sm="12" lg="12">
            <global-week :diaryWeek="globalWeek" :start="start"></global-week>
        </v-col>
    </v-row>
</template>

<script>

    import Diary from "../components/Diary";
    import GlobalDiary from "../components/GlobalDiary";

    const date = new Date();
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const week = date.getDay();
    const startDay = new Date((date - (86400000*(week - 1))));
    let hour = 0;
    if (new Date(year, 6,1,0,0,0,0).getTimezoneOffset() - date.getTimezoneOffset() === 60) {hour = 1}
    const start = new Date(year, month, startDay.getDate(), hour,0,0,0).valueOf();

    export default {
        data: () => ({
            start: start,
            date: null,
            weeks: null,
            data: '',
            diaryWeek: [],
            globalWeek: [],
            my: true,
            global: false
        }),
        methods: {
            lessWeek () {
                this.my = true;
                this.global = false;
            },
            globWeek () {
                this.my = false;
                this.global = true;
            },
            async download () {
                await this.$store.dispatch('pastWeeks', this.start);
                this.diaryWeek = this.$store.state.diary.lessonWeek;
            },
            async pastWeeks () {
                const date = this.date.valueOf() - 604800000;
                this.date = new Date(date);
                const week = this.date.getDay();

                const startYear = new Date((date - (86400000*(week - 1)))).getFullYear();
                const endYear = new Date(date + (86400000*(7 - week))).getFullYear();

                let startMonth = new Date((date - (86400000*(week - 1)))).getMonth() + 1;
                if (startMonth < 10) {startMonth = '0' + startMonth}
                let endMonth = new Date(date + (86400000*(7 - week))).getMonth() + 1;
                if (endMonth < 10) {endMonth = '0' + endMonth}

                const startDay = new Date((date - (86400000*(week - 1)))).getDate();
                const endDay = new Date(date + (86400000*(7 - week))).getDate();

                this.start = this.start - 86400000*7;
                this.weeks = `${startDay}.${startMonth}.${startYear}-${endDay}.${endMonth}.${endYear}`;
                this.$store.state.diary.weeks = this.start;
                await this.$store.dispatch('pastWeeks', this.start);
                this.diaryWeek = this.$store.state.diary.lessonWeek;
                if (localStorage.schoolId !== undefined) {
                    this.globalWeek = this.$store.state.global.lessonWeek;
                }
            },
            async nextWeeks () {
                const date = this.date.valueOf() + 604800000;
                this.date = new Date(date);
                const week = this.date.getDay();

                const startYear = new Date((date - (86400000*(week - 1)))).getFullYear();
                const endYear = new Date(date + (86400000*(7 - week))).getFullYear();

                let startMonth = new Date((date - (86400000*(week - 1)))).getMonth()+1;
                if (startMonth < 10) {startMonth = '0' + startMonth}
                let endMonth = new Date(date + (86400000*(7 - week))).getMonth()+1;
                if (endMonth < 10) {endMonth = '0' + endMonth}

                const startDay = new Date((date - (86400000*(week - 1)))).getDate();
                const endDay = new Date(date + (86400000*(7 - week))).getDate();
                this.start = this.start + 86400000*7;
                this.weeks = `${startDay}.${startMonth}.${startYear}-${endDay}.${endMonth}.${endYear}`;
                this.$store.state.diary.weeks = this.start;
                await this.$store.dispatch('pastWeeks', this.start);
                this.diaryWeek = this.$store.state.diary.lessonWeek;
            }
        },
        components: {
            lessonWeek: Diary,
            globalWeek: GlobalDiary
        },
        created () {
            const date = Date.now();
            this.date = new Date(date);
            const week = this.date.getDay();

            const startYear = new Date((date - (86400000*(week - 1)))).getFullYear();
            const endYear = new Date(date + (86400000*(7 - week))).getFullYear();

            let startMonth = new Date((date - (86400000*(week - 1)))).getMonth() + 1;
            if (startMonth < 10) {startMonth = '0' + startMonth}
            let endMonth = new Date(date + (86400000*(7 - week))).getMonth() + 1;
            if (endMonth < 10) {endMonth = '0' + endMonth}

            const startDay = new Date((date - (86400000*(week - 1)))).getDate();
            const endDay = new Date(date + (86400000*(7 - week))).getDate();
            this.weeks = `${startDay}.${startMonth}.${startYear}-${endDay}.${endMonth}.${endYear}`;
            this.$store.state.diary.weeks = this.weeks
        }
    }
</script>

<style scoped>

</style>
