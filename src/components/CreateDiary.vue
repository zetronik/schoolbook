<template>
    <v-form>
        <v-row>
            <v-col cols="12">
                <v-select
                        :disabled="edit"
                        v-model="years"
                        :items="selectYears"
                        label="Выбрать начало учебного года"
                ></v-select>
                <v-btn @click="createDiary" color="secondary">Create Diary</v-btn>
                <v-btn @click="edit = !edit" color="error" class="ml-2">Edit</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
    export default {
        data: () => ({
            years: null,
            book: {},
            base: [
                {dayWeeks: 'Понедельник', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Втоник', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Среда', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Четверг', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Пятница', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Суббота', dayLesson: [{lesson: '', homework: ''}]}
            ],
            edit: true
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            },
            selectYears () {
                const beforeYear = this.years-1;
                const year = this.years;
                const afterYear = this.years+1;
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
                    {year: this.years, lessons: this.base},
                    {[this.years]: this.book}
                ];
                await this.$store.dispatch('createDiary', create);
                this.$store.state.settings.year = this.years;
                sessionStorage.years = this.years;
                this.writeIn()
            }
        },
        created() {
            if (sessionStorage.years === undefined) {
                this.years = new Date().getFullYear();
            } else if (sessionStorage.years === 'undefined') {
                this.years = new Date().getFullYear();
            } else {
                this.years = sessionStorage.years;
            }
        }
    }
</script>

<style scoped>

</style>
