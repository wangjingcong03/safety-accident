<template>
  <el-tabs :value="active" class="record-tabs" @tab-click="handleTabClick">
    <el-tab-pane label="安全事故" name="accident" />
    <el-tab-pane label="不安全事件" name="unsafe-event" />
  </el-tabs>
</template>

<script>
export default {
  name: 'RecordTabs',
  props: { active: { type: String, default: 'accident' } },
  methods: {
    handleTabClick (tab) {
      if (tab.name === this.active) return;
      this.$router.push(tab.name === 'unsafe-event' ? '/unsafe-events' : '/accidents');
    }
  }
};
</script>

<style scoped>
.record-tabs { margin: -4px 0 18px; }
.record-tabs /deep/ .el-tabs__header { margin-bottom: 0; }
</style>
