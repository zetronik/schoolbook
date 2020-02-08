<template>
    <v-row>
        <v-col cols="12">
            <v-select
                    :disabled="edit"
                    v-model="years"
                    :items="selectYears"
                    :label="$vuetify.lang.t(`$vuetify.settings.academicYear`)"
            >
                <template v-slot:selection="{ item, index }">
                    <span>{{item}}-{{item+1}}</span>
                </template>
            </v-select>
            <v-btn :disabled="edit" @click="createDiary" color="secondary" large>
                <v-icon>mdi-credit-card-plus</v-icon>
            </v-btn>
            <v-btn @click="edit = !edit" color="error" class="ml-2" large>
                <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        props: ['writeIn'],
        data: () => ({
            years: null,
            book: {},
            base: [
                {dayLesson: [{lesson: '', homework: ''}]},
                {dayLesson: [{lesson: '', homework: ''}]},
                {dayLesson: [{lesson: '', homework: ''}]},
                {dayLesson: [{lesson: '', homework: ''}]},
                {dayLesson: [{lesson: '', homework: ''}]},
                {dayLesson: [{lesson: '', homework: ''}]}
            ],
            edit: true
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            },
            selectYears () {
                const year = this.years;
                const beforeYear = year-1;
                const afterYear = year+1;
                return [beforeYear, year, afterYear]
            }
        },
        methods: {
            async createDiary () {
                const date = new Date(this.years, 8, 1, 1,0,0,0);
                let september = date.valueOf();
                if (date.getDay() === 6) {
                    september += 86400000 + 86400000
                } else if (date.getDay() === 0) {
                    september += 86400000
                }

                for (let i = 0; i < 43; i++) {
                    this.book[september] = this.base;
                    september += 604800000;
                }
                const create = [
                    {lessons: this.base},
                    {[this.years]: this.book}
                ];
                await this.$store.dispatch('createGlobal', create);
                this.$store.state.settings.years = this.years;
                this.writeIn();
                this.edit = true
            }
        },
        created() {
            if (this.$store.state.settings.years === null) {
                this.years = +new Date().getFullYear();
            } else {
                this.years = +this.$store.state.settings.years;
            }
        }
    }
</script>

<style scoped>

</style>
