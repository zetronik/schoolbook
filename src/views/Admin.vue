<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-select dense
                          v-model="select"
                          :items="items"
                          item-text="school"
                          item-value="id"
                          label="Group change"
                          return-object
                ></v-select>
            </v-col>
            <v-col>
                <v-btn @click="setSchool" color="primary">download</v-btn>
                <v-btn @click="getSchool" color="primary">created</v-btn>
                <v-btn @click="global" color="primary">global</v-btn>
                <v-btn @click="bruteForce" color="primary">Brute Force</v-btn>
            </v-col>
        </v-row>
        <pre>{{select}}</pre>
        <pre>{{bruteTrue}}</pre>
    </v-container>
</template>

<script>
    export default {
        data () {
            return {
                loading: false,
                items: [],
                search: null,
                select: null,
                globalSchool: null,
                bruteTrue: null
            }
        },
        methods: {
            async setSchool (v) {
                await this.$store.dispatch('downloadSchool');
                this.items = this.$store.state.admin.school
            },
            async getSchool () {
                const school = {
                    region: 'Дніпропетровська обл.',
                    locality: 'м.Дніпро',
                    ...this.select
                };
                await this.$store.dispatch('uploadSchool', school);
                console.log(this.$store.state.admin.schoolId)
            },
            async global () {
                await this.$store.dispatch('searchSchool');
                this.globalSchool = this.$store.state.admin.globalSchool
                console.log(this.globalSchool)
            },
            bruteForce () {
                console.log(this.select.id)
                for (let [key, val] of Object.entries(this.globalSchool)) {
                    if (val.id === this.select.id) {
                        return this.bruteTrue = this.globalSchool[key]
                    } else {
                        this.bruteTrue = 'Scholl is not a define'
                    }
                }
                
            }
        },
        beforeDestroy() {
            this.items = []
        }
    }
</script>

<style scoped>

</style>
