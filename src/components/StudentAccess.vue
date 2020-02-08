<template>
    <v-container>
        <v-col cols="12">
            <v-btn width="100%" @click="uploadStudent">{{$vuetify.lang.t(`$vuetify.admin.uploadStudent`)}}</v-btn>
        </v-col>
        <v-col cols="12" v-if="table">
            <v-data-table
                :headers="headers"
                :items="student"
                sort-by="user"
                class="elevation-1"
            >
                <template v-slot:item.action="{ item }">
                    <v-switch
                            :disabled="access"
                            v-model="item.access"
                            @change="accessStudent(item.access, item.id, item.sId)"
                    ></v-switch>
                </template>

            </v-data-table>
        </v-col>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            student: [],
            table: false,
            access: true,
            headers: [
                {
                    text: 'Student',
                    align: 'left',
                    sortable: true,
                    value: 'user',
                },
                { text: 'Access', value: 'action', sortable: false, align: 'left' },
            ],
            studentList: {}
        }),
        watch: {
            studentList () {
                for (let [key, val] of Object.entries(this.studentList)) {
                    const student = {...val, sId: key};
                    this.student.push(student)
                }
            }
        },
        methods: {
            async uploadStudent () {
                this.access = this.$store.state.settings.student;
                this.student = [];
                this.studentList = {};
                await this.$store.dispatch('uploadStudent');
                this.studentList = this.$store.state.accessStudent.student;
                this.table = true
            },
            async accessStudent (access, id, sId) {
                const setAccess = [id, {access}, sId];
                await this.$store.dispatch('setAccess', setAccess);
            }
        },
        created() {
            console.log(this.$vuetify.lang.t('$vuetify.admin.student'))
        }
    }
</script>

<style scoped>

</style>
