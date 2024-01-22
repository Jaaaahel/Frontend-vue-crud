<template>
  <ModalDetails
    v-model:open="modalDetailsState"
    :modalData=modalData
    title="User Details:"
    :closable=true
  />
  <ModalAccountCreate
    v-model:open="modalAccountCreateState"
    @update:open="modalAccountCreateState = $event"
    @updateData="setTableData(true)"
    title="User Create:"
    :closable=true
  />
  <ModalAccountUpdate
    v-model:open="modalAccountUpdateState"
    @update:open="modalAccountUpdateState = $event"
    @updateData="setTableData(true)"
    :modalData=modalData
    title="User Update:"
    :closable=true
  />
  <ModalConfirmation
    v-model:open="modalConfirmationState"
    @update:open="modalConfirmationState = $event"
    @updateData="setTableData(true)"
    :modalData=modalData
    title="User Delete:"
    modalText='Are you sure you want to delete?'
    :closable=true
  />

  <div class="content">
    <a-space class="filter-input" direction="vertical" :size="12">
      <a-button type="primary" @click="modalAccountCreateState = true">Create account</a-button>
    </a-space>

    <a-table
      class="ant-table"
      :columns="columns"
      :dataSource='rows'
      :row-key="(rows: any) => rows.id"
      :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
      :loading="isLoading"
      bordered
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.title === 'action'">
          <a-space>
            <a-button type="primary" @click="viewRow(record)">View</a-button>
            <a-button type="primary" @click="updateRow(record)">Update</a-button>
            <a-button type="primary" danger @click="deleteRow(record)">Delete</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang='ts' setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { message } from 'ant-design-vue';

import { useAuthStore } from '@/stores/auth';
import ModalDetails from '../components/ModalDetails.vue'
import ModalAccountCreate from '@/components/ModalAccountCreate.vue';
import ModalAccountUpdate from '@/components/ModalAccountUpdate.vue';
import ModalConfirmation from '../components/ModalConfirmation.vue'

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

const isLoading = ref<boolean>(true);
const searchFilter = ref<string>('');
const modalDetailsState = ref<boolean>(false);
const modalAccountCreateState = ref<boolean>(false);
const modalAccountUpdateState = ref<boolean>(false);
const modalConfirmationState = ref<boolean>(false);

let columns = reactive<ColumnsInterface[]>([]);
let rows = reactive<RowsInterface[]>([]);
let modalData = reactive({
  id: 0,
  firstName: '',
  lastName: '',
  username: '',
  password: '',
});

onBeforeMount(async () => {
  await setTableData(false);
})

const setTableData = async (update: boolean, searchFilter?: string) => {
  isLoading.value = true;
  rows = [];
  if (!update) columns = [];

  const data = await getUsers(searchFilter);
  if (data.length !== 0) {
    rows = data;
    if (!update) setColumns(data);
  }

  isLoading.value = false;
};

const getUsers = async (search?: string) => {
  try {
    const { data: { data } } = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
      params: { search },
      headers: { Authorization: `Bearer ${authStore.getToken()}` }
    });

    return data;
  } catch (e: any) {
    if (e.response.data.message === 'Session Expired') {
      message.error('Session expired. Redirecting...');
      setTimeout( () => router.push({ path: '/'}), 3000);
    }
  }
}

const setColumns = (data: RowsInterface[]) => {
  const keys = Object.keys(data[0]).filter(
    key => key === 'id' || key === 'firstName' || key === 'lastName'|| key === 'username'
  );

  const firstNames = data.map((obj: any) => { return { text: obj.firstName, value: obj.firstName }});
  const lastNames = data.map((obj: any) => { return { text: obj.lastName, value: obj.lastName }});

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

const onSearch = async () => {
  setTableData(true, searchFilter.value);
}

const viewRow = async (row: typeof modalData) => {
  modalDetailsState.value = true;
  modalData = row;
}

const updateRow = async (row: typeof modalData) => {
  modalAccountUpdateState.value = true;
  modalData = row;
}

const deleteRow = async (row: typeof modalData) => {
  modalConfirmationState.value = true;
  modalData = row;
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
