<template>
  <ModalDetails v-model:open="modalDetailsState" title="User Details:" :modalData=modalData :closable=true />
  <div class="content">
    <a-space class="filter-input" direction="vertical" :size="12">
      <a-input-search
        class="input-search"
        v-model:value="userParams.q"
        placeholder="Search user by First Name or Last Name"
        enter-button
        @search="onSearch"
        @change="onSearch"
      />
      <a-range-picker
        format="YYYY-MM-DD"
        :placeholder="['Birthdate from', 'Birthdate to']"
        @change="onSelectDateRange"
      />
    </a-space>

    <a-table
      class="ant-table"
      :columns="columns"
      :dataSource='rowsFiltered'
      :row-key="(rows: any) => rows.id"
      :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
      :loading="isLoading"
      bordered
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.title === 'action'"><a @click="viewRow(record)">view</a></template>
      </template>
    </a-table>
  </div>
</template>

<script lang='ts' setup>
import { onBeforeMount, reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import ModalDetails from '../components/ModalDetails.vue'
import { message } from 'ant-design-vue';

const router = useRouter();
const authStore = useAuthStore();

interface ColumnsInterface {
  title: string;
  dataIndex: string;
  filters: FiltersInterface[] | string;
  onFilter: any;
  align: 'center';
  width: number | string;
}

interface FiltersInterface {
  text: string;
  value: string;
}

interface RowsInterface {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
}

const isLoading = ref(true);
let columns = reactive<ColumnsInterface[]>([]);
let rows = reactive<RowsInterface[]>([]);
let rowsFiltered = reactive<RowsInterface[]>([]);
let userParams = reactive({
  q: '',
  key: '',
  value: '',
  limit: 0,
});
let modalData = reactive({ id: 0 });

const modalDetailsState = ref<boolean>(false);

onBeforeMount(async () => {
  setTableData(userParams);
});

const setTableData = async (params: typeof userParams) => {
  isLoading.value = true;
  rows = [];
  rowsFiltered = [];
  columns = [];

  const data = await getUsers(params);
  if (data.length !== 0) {
    rows = data;
    rowsFiltered = data;
    setColumns(data);
  }

  isLoading.value = false;
}

const getUsers = async (params: typeof userParams) => {
  try {
    const { data: { data } } = await axios.get(`${import.meta.env.VITE_API_URL}/dummy`, {
      params,
      headers: {
        Authorization: `Bearer ${authStore.getToken()}`
      }
    });

    return data;
  } catch (e: any) {
    if (e.response.data.message === 'Session Expired') {
      message.error('Session expired. Redirecting...');
      setTimeout( () => router.push({ path: '/'}), 3000);
    }
    return [];
  }
};

const setColumns = (data: RowsInterface[]) => {
  const keys = Object.keys(data[0]).filter(
    // key => key !== 'hair' && key !== 'address' && key !== 'company' && key !== 'crypto' && key !== 'bank'
    key => key === 'id' || key === 'firstName' || key === 'lastName' || key === 'birthDate' || key === 'username'
  );

  const firstNames = data.map((obj: any) => { return { text: obj.firstName, value: obj.firstName }});
  const lastNames = data.map((obj: any) => { return { text: obj.lastName, value: obj.lastName }});
  const birthdays = data.map((obj: any) => { return { text: obj.birthDate, value: obj.birthDate }});

  columns = keys.map(key => {
    let title = key;
    let filters: ColumnsInterface['filters'] = '';
    let onFilter: ColumnsInterface['onFilter'] = '';

    switch (key) {
      case 'id':
        title = 'action';
        break;
      case 'firstName':
        filters = firstNames;
        onFilter = (value: string, record: any) => record.firstName.indexOf(value) === 0;
        break;
      case 'lastName':
        filters = lastNames;
        onFilter = (value: string, record: any) => record.lastName.indexOf(value) === 0;
        break;
      case 'birthDate':
        filters = birthdays;
        onFilter = (value: string, record: any) => record.birthDate.indexOf(value) === 0;
        break;
    }
  
    return {
      title,
      dataIndex: key,
      filters,
      onFilter,
      align: 'center',
      width: 150,
    }
  });
}

const onSearch = () => { setTableData(userParams); }

const onSelectDateRange = async (dates: [string, string], dateStrings: [string, string]) => {
  isLoading.value = true;

  if (dateStrings[0] && dateStrings[1]) { 
    rowsFiltered = rows.filter((row: any) => row.birthDate > dateStrings[0] && row.birthDate < dateStrings[1]);
  } else {
    rowsFiltered = rows;
  }

  isLoading.value = false;
}

const viewRow = async (row: RowsInterface) => {
  modalDetailsState.value = true;
  modalData = row
}
</script>

<style scoped>
.content {
  background: #fff;
  padding: 24px;
}

.filter-input {
  width: 50%;
  margin-bottom: 12px;
}

.table-striped td {
  background-color: rgb(241, 241, 241);
}
</style>
