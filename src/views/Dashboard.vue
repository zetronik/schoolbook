<template>
    <v-container>
        <v-row class="ma-0">
           <v-col cols="12" class="d-flex justify-space-between align-center ma-0">
                <v-btn color="accent" class="mr-1" @click="lessWeek" min-width="150px" width="50%">{{$vuetify.lang.t(`$vuetify.dashboard.myDiary`)}}</v-btn>
                <v-btn color="accent" class="ml-1" :disabled="!access" @click="globWeek" min-width="150px" width="50%">{{$vuetify.lang.t(`$vuetify.dashboard.globalDiary`)}}</v-btn>
            </v-col>
            <v-col class="d-flex justify-space-between align-center ma-0">
                <v-btn class="mx-2" fab color="info" @click="pastWeeks">
                    <v-icon class="display-2" dark>mdi-arrow-left-drop-circle-outline</v-icon>
                </v-btn>
                <p class="text-center title">{{dashWeeks}}</p>
                <v-btn class="mx-2" fab dark color="info" @click="nextWeeks">
                    <v-icon class="display-2" dark>mdi-arrow-right-drop-circle-outline</v-icon>
                </v-btn>
            </v-col>
            <v-col v-if="my" sm="12" lg="12">
                <lesson-week :diaryWeek="diaryWeek" :start="start"></lesson-week>
            </v-col>
            <v-col v-if="global" sm="12" lg="12">
                <global-week :globalWeek="globalWeek" :start="start"></global-week>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    import Diary from "../components/Diary";
    import GlobalDiary from "../components/GlobalDiary";

    const date = new Date();
    const week = date.getDay();
    const startDay = new Date((date - (86400000*(week - 1))));
    const year = new Date(startDay.valueOf()).getFullYear();
    const month = new Date(startDay.valueOf()).getMonth();
    let hour = 0;
    if (new Date(year, 6,1,0,0,0,0).getTimezoneOffset() - date.getTimezoneOffset() === 60) {hour = 1}
    const start = new Date(year, month, startDay.getDate(), hour,0,0,0).valueOf();

    export default {
        data: () => ({
            start: start,
            date: null,
            dashWeeks: null,
            data: '',
            diaryWeek: [],
            globalWeek: [],
            my: true,
            global: false,
            access: false,
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            },
        },
        methods: {
            lessWeek () {
                this.my = true;
                this.global = false;
            },
            globWeek () {
                this.my = false;
                this.global = true;
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
                this.dashWeeks = `${startDay}.${startMonth}.${startYear}-${endDay}.${endMonth}.${endYear}`;
                this.$store.state.diary.weeks = this.start;
                this.$store.state.global.weeks = this.start;
                await this.$store.dispatch('pastWeeks', this.start);
                await this.$store.dispatch('pastGlobalWeeks', this.start);
                this.diaryWeek = this.$store.state.diary.lessonWeek;
                this.globalWeek = this.$store.state.global.lessonWeek;
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
                this.dashWeeks = `${startDay}.${startMonth}.${startYear}-${endDay}.${endMonth}.${endYear}`;
                this.$store.state.diary.weeks = this.start;
                this.$store.state.global.weeks = this.start;
                await this.$store.dispatch('pastWeeks', this.start);
                await this.$store.dispatch('pastGlobalWeeks', this.start);
                this.diaryWeek = this.$store.state.diary.lessonWeek;
                this.globalWeek = this.$store.state.global.lessonWeek;
            }
        },
        components: {
            lessonWeek: Diary,
            globalWeek: GlobalDiary
        },
        async created () {
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
            this.dashWeeks = `${startDay}.${startMonth}.${startYear}-${endDay}.${endMonth}.${endYear}`;
            this.$store.state.diary.weeks = this.start;
            this.$store.state.global.weeks = this.start;
            this.access = this.$store.state.settings.access;

        },
        beforeDestroy() {
            this.diaryWeek = [];
            this.globalWeek = [];
        }
    }
</script>

<style scoped>

</style>
