<template>
  <a-modal>
    <div v-for="(value, key) in props.modalData" :key="key">
      <strong>{{ key }}:</strong>
      <template v-if="typeof value === 'object'">
        <div v-for="(subValue, subKey) in value" :key="subKey">
          <strong>{{ subKey }}:</strong>
          <template v-if="typeof subValue === 'object'">
            <div v-for="(subSubValue, subSubKey) in subValue" :key="subSubKey">
              <strong>{{ subSubKey }}:</strong> {{ subSubValue }}
            </div>
          </template>
          <template v-else>
            &nbsp;{{ subValue }}
          </template>
        </div>
      </template>
      <template v-else>
        &nbsp;{{ value }}
      </template>
    </div>
    <template #footer></template>
  </a-modal>
</template>

<script lang="ts" setup>
const props = defineProps({ modalData: Object });
</script>