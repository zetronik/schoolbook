<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn to="/global" color="accent"><v-icon>mdi-arrow-left-circle</v-icon></v-btn>
            </v-col>
            <v-col cols="12">
                <v-select outlined
                          :loading="loadItem"
                          v-model="select"
                          :items="items"
                          item-text="school"
                          item-value="id"
                          :label="$vuetify.lang.t(`$vuetify.settings.schoolChanhe`)"
                          return-object
                ></v-select>
            </v-col>
            <v-col>
                <v-btn :disabled="getBtn" @click="getSchool" color="primary">{{$vuetify.lang.t(`$vuetify.admin.newDiary`)}}</v-btn>
                <v-btn class="ml-2" :disabled="joinBtn" @click="joinDiary(join)" color="primary">{{$vuetify.lang.t(`$vuetify.admin.joinDiary`)}} {{join.join('')}}</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card v-if="typeof bruteTrue == 'object'">
                    <v-list
                            class="mx-auto"
                            tile
                    >
                        <v-list-item-group>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-school</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{bruteTrue.school}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-icon>mdi-city</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{bruteTrue.locality}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-crosshairs-gps</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{bruteTrue.region}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-for="i in gGroup">
                                <v-list-item-icon>
                                    <v-icon>mdi-note-text</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-btn :disabled="i.user === 'admin' || i.user === 'student'" @click="setDiary(i.cl)" color="info">{{i.cl}} {{i.user}}</v-btn>
                                        <v-subheader class="float-left">{{i.admin}}</v-subheader>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="!addClass">
                                <v-list-item-icon>
                                    <v-icon>mdi-domain-plus</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-select dense
                                              v-model="levelSelect"
                                              :items="level"
                                              label="Class change"
                                              return-object
                                    ></v-select>
                                    <v-select dense
                                              class="ml-2"
                                              v-model="groupSelect"
                                              :items="group"
                                              label="Group change"
                                              return-object
                                    ></v-select>
                                    <v-btn @click="newDiary" color="primary">Join New Diary</v-btn>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
                <v-card v-else-if="typeof bruteTrue == 'string'">
                    <v-list
                            class="mx-auto"
                            tile
                    >
                        <v-subheader>{{bruteTrue}}</v-subheader>
                        <v-list-item-group>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-school</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{select.school}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-icon>mdi-city</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-text-field label="Населенный пункт" v-model="locality"></v-text-field>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-crosshairs-gps</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-text-field label="Область" v-model="region"></v-text-field>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-domain-plus</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-select dense
                                              v-model="levelSelect"
                                              :items="level"
                                              label="Class change"
                                              return-object
                                    ></v-select>
                                    <v-select dense
                                              class="ml-2"
                                              v-model="groupSelect"
                                              :items="group"
                                              label="Group change"
                                              return-object
                                    ></v-select>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="addClass">
            <student-access></student-access>
        </v-row>
    </v-container>
</template>

<script>
    import StudentAccess from "../components/StudentAccess";
    export default {
        components: {studentAccess: StudentAccess},
        data () {
            return {
                getBtn: true,
                loading: false,
                loadItem: false,
                items: [],
                search: null,
                select: null,
                globalSchool: null,
                schoolId: null,
                bruteTrue: undefined,
                region: '',
                locality: '',
                levelSelect: null,
                groupSelect: null,
                group: ['А','Б','В','Г','Д'],
                level: ['1','2','3','4','5','6','7','8','9','10','11','12'],
                gGroup: [],
                joinBtn: true,
                join: [],
                addClass: false
            }
        },
        component: {
            StudentAccess
        },
        watch: {
            select () {
                this.bruteForce()
            }
        },
        methods: {
            //загрузка наименования школ
            async setSchool () {
                this.loadItem = true;
                await this.$store.dispatch('schoolItem');
                this.items = this.$store.state.settings.items;
                setTimeout(() => {
                    this.select = this.$store.state.settings.items.find(i => i.id === this.$store.state.settings.select);
                    this.loadItem = false;
                }, 2000);
            },
            //создание класса, группы и дневника в выбранной школе (еще не создан ни один дневник)
            async getSchool () {
                const school = [{
                    globalDiary: {
                            [this.levelSelect]: {
                                [this.groupSelect]: {
                                    admin: `${this.$store.state.settings.name} ${this.$store.state.settings.surname}`,
                                    diary: ''
                                }
                            }
                        },
                    region: this.region,
                    locality: this.locality,
                    ...this.select
                    },
                    {adminDiary: {
                            //idDiary: this.schoolId,
                            lvl: this.levelSelect,
                            grp: this.groupSelect
                        },
                        admin: true,
                        student: false
                    }
                ];
                await this.$store.dispatch('uploadSchool', school);
                await this.$router.push('/global')
            },
            //загрузка скиска школ с глобальными дневниками
            async global () {
                await this.$store.dispatch('searchSchool');
                this.globalSchool = this.$store.state.admin.globalSchool
            },
            //проверка на существование по выбранной школе созданы дневников
            bruteForce () {
                for (let [key, val] of Object.entries(this.globalSchool)) {
                    if (val.id === this.select.id) {
                        this.getBtn = true;
                        this.schoolId = key;
                        this.bruteTrue = this.globalSchool[key];
                        this.gGroup = [];
                        for (let [l] of Object.entries(this.globalSchool[key].globalDiary)) {
                            for (let [g, gVal] of Object.entries(this.globalSchool[key].globalDiary[l])) {
                                let user = '';
                                if (this.$store.state.settings.schoolId === this.schoolId) {
                                    if (this.$store.state.settings.lvl === l) {
                                        if (this.$store.state.settings.grp === g) {
                                            if (this.$store.state.settings.admin) {
                                                this.addClass = true;
                                                user = 'admin'
                                            } else if (this.$store.state.settings.student) {
                                                this.addClass = true;
                                                user = 'student'
                                            }
                                        }
                                    }
                                }

                                this.gGroup.push({cl: `${l}${g}`, admin: gVal.admin, user});
                            }
                        }
                        return
                    } else {
                        this.getBtn = false;
                        this.bruteTrue = 'School not found in this diary'
                    }
                }
            },
            //создание класса, группы и нового глобального дневника в выбранной школе (уже созады дневники по классам)
            async newDiary () {
                const newD = {
                    id: this.schoolId,
                    cl: {[this.levelSelect]: {
                        [this.groupSelect]: {
                            admin: `${this.$store.state.settings.name} ${this.$store.state.settings.surname}`,
                            diary: ''
                        }
                        }}
                };
                const setUser = {
                    adminDiary: {
                        idDiary: this.schoolId,
                        lvl: this.levelSelect,
                        grp: this.groupSelect
                    },
                    admin: true,
                    student: false
                };
                await this.$store.dispatch('saveSetting', setUser);
                await this.$store.dispatch('newDiary', newD);
            },
            //выбор существующего глобально дневника для дальнейшего подключения
            async setDiary (val) {
                this.join = Array.from(val);
                this.joinBtn = false
            },
            //присоеденится к выбранному глобальному дневнику
            async joinDiary (val) {
                const setUser = {
                    joinDiary: {
                        idDiary: this.schoolId,
                        lvl: val[0],
                        grp: val[1],
                        access: true
                    },
                    admin: false,
                    student: true
                };
                await this.$store.dispatch('saveSetting', setUser);
                await this.$store.dispatch('addUserForDiary', setUser);
                await this.$router.push('/global')
            }
        },
        created () {
            this.setSchool();
            this.global();
        },
        beforeCreate () {

        },
        beforeDestroy() {
            this.items = [];
            this.globalSchool = null
        }
    }
</script>

<style scoped>

</style>
