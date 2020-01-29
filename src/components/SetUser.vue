<template>
    <v-form>
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field :disabled="edit" dense v-model="name" label="Name"></v-text-field>
                <v-text-field :disabled="edit" dense v-model="surname" label="Surname"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-select dense
                          :disabled="edit"
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
                                  :disabled="edit"
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
                                  :disabled="edit"
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
            <v-col cols="12">
                <v-btn :disabled="edit" :loading="loading" @click="saveUser" color="secondary">Save</v-btn>
                <v-btn @click="edit = !edit" color="error" class="ml-2">Edit</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
    export default {
        data: () => ({
            group: ['А','Б','В','Г','Д'],
            level: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            name: null,
            surname: null,
            groupSelect: null,
            levelSelect: null,
            select: {school: '', id: ''},
            items: [],
            edit: true
        }),
        computed: {
            loading () {
                return this.$store.getters.loading
            }
        },
        methods: {
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
                    admin: false,
                    student: false,
                    level: this.levelSelect,
                    group: this.groupSelect,
                    school: this.select.id,
                    name: this.name,
                    surname: this.surname
                };
                await this.$store.dispatch('saveSetting', setUser);
                this.edit = true
            }
        },
        async created() {
            await this.$store.dispatch('schoolItem');
            if (sessionStorage.length !== 0) {
                this.select = this.$store.state.settings.items.find(i => i.id === sessionStorage.select);
                this.name = sessionStorage.name;
                this.surname = sessionStorage.surname;
                this.levelSelect = sessionStorage.level;
                this.groupSelect = sessionStorage.group;
            }
            this.items = this.$store.state.settings.items;
        },
        beforeDestroy () {
            this.items = []
        }
    }
</script>

<style scoped>

</style>
