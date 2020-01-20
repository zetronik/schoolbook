<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field dense v-model="name" label="Name"></v-text-field>
                    <v-text-field dense v-model="surname" label="Surname"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select dense
                              v-model="select"
                              :items="items"
                              item-text="school"
                              item-value="id"
                              label="School change"
                              return-object
                    ></v-select>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-select dense
                                      v-model="levelSelect"
                                      :items="level"
                                      item-text="school"
                                      item-value="id"
                                      label="Class change"
                                      return-object
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select dense
                                      v-model="groupSelect"
                                      :items="group"
                                      item-text="school"
                                      item-value="id"
                                      label="Group change"
                                      return-object
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-btn @click="saveUser" color="secondary">Save</v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-select
                            v-model="years"
                            :items="selectYears"
                            label="Выбрать начало учебного года"
                    ></v-select>
                    <v-btn @click="createDiary" color="secondary">Create Diary</v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
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
    </v-form>
</template>

<script>

    export default {
        data: () => ({
            name: '',
            surname: '',
            groupSelect: null,
            group: ['А','Б','В','Г','Д'],
            levelSelect: null,
            level: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            select: {school: '', id: ''},
            items: [],
            years: new Date().getFullYear(),
            book: {},
            btnSave: false,
            diary: null,
            base: [
                {dayWeeks: 'Понедельник', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Втоник', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Среда', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Четверг', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Пятница', dayLesson: [{lesson: '', homework: ''}]},
                {dayWeeks: 'Суббота', dayLesson: [{lesson: '', homework: ''}]}
            ]
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
            async writeIn () {
                await this.$store.dispatch('writeLessons');
                this.diary = this.$store.state.diary.lessons;
            },
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
            },
            async saveUser () {
                this.$store.state.settings.select = this.select.id;
                sessionStorage.select = this.select.id;
                this.$store.state.settings.name = this.name;
                sessionStorage.name = this.name;
                this.$store.state.settings.surname = this.surname;
                sessionStorage.surname = this.surname;
                this.$store.state.settings.level = this.levelSelect;
                sessionStorage.level = this.levelSelect;
                this.$store.state.settings.group = this.groupSelect;
                sessionStorage.group = this.groupSelect;
                const setUser = {
                    level: this.levelSelect,
                    group: this.groupSelect,
                    school: this.select.id,
                    name: this.name,
                    surname: this.surname
                };
                await this.$store.dispatch('saveSetting', setUser);
            },
            saveDiary () {
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
                this.$store.dispatch('saveDiary', this.diary);
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
            await this.$store.dispatch('schoolItem');
            if (!this.diary) {
                this.writeIn();
                this.btnSave = true
            }
            if (sessionStorage.years === undefined) {
                this.years = new Date().getFullYear();
            } else if (sessionStorage.years === 'undefined') {
                this.years = new Date().getFullYear();
            } else {
                this.years = sessionStorage.years;
            }
            if (sessionStorage.length !== 0) {
                this.select = this.$store.state.settings.items.find(i => i.id === sessionStorage.select);
                this.name = sessionStorage.name;
                this.surname = sessionStorage.surname;
                this.levelSelect = sessionStorage.level;
                this.groupSelect = sessionStorage.group;
            }
            this.items = this.$store.state.settings.items;
        },
        beforeDestroy: function () {
            this.saveDiary();
            this.items = []
        }
    }
</script>

<style scoped>

</style>
