<template>
  <div>
    <div class="page-header"><div class="breadcrumb">安全生产管理 <i class="el-icon-arrow-right"></i> <strong>安全生产事故记录</strong></div><div><el-button icon="el-icon-download" :disabled="!selectedEvents.length" @click="exportSelected">导出</el-button><el-button type="primary" icon="el-icon-plus" @click="openCreate">新建</el-button></div></div>
    <record-tabs active="unsafe-event" />
    <div class="section-card list-card">
      <div class="filter-row">
        <div class="filter-item"><span>发生部门/车间：</span><el-select v-model="filters.department" clearable placeholder="请选择" size="small"><el-option v-for="item in departments" :key="item" :label="item" :value="item" /></el-select></div>
        <div class="filter-item"><span>发生时间：</span><el-date-picker v-model="filters.range" type="daterange" size="small" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /></div>
        <div class="filter-item"><span>事件等级：</span><el-select v-model="filters.level" clearable placeholder="全部" size="small"><el-option v-for="item in levels" :key="item" :label="item" :value="item" /></el-select></div>
        <el-button type="primary" size="small" icon="el-icon-search" @click="filterApplied = true">查询</el-button><el-button size="small" icon="el-icon-refresh" @click="resetFilters">重置</el-button>
      </div>
      <el-table :data="filteredEvents" stripe class="event-table" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="department" label="发生部门/车间" width="160" />
        <el-table-column prop="summary" label="事件概况" min-width="220" show-overflow-tooltip />
        <el-table-column prop="location" label="发生地点" min-width="200" show-overflow-tooltip />
        <el-table-column prop="eventTime" label="发生时间" width="160" />
        <el-table-column prop="eventType" label="事件类型" width="150" />
        <el-table-column prop="eventLevel" label="事件等级" width="120" align="center"><template slot-scope="scope"><el-tag size="mini" :type="scope.row.eventLevel === '未遂事件' ? 'info' : 'warning'">{{ scope.row.eventLevel }}</el-tag></template></el-table-column>
        <el-table-column prop="reportUser" label="上报人" width="100" />
        <el-table-column prop="reportTime" label="上报时间" width="175" />
        <el-table-column label="操作" fixed="right" width="150" align="center"><template slot-scope="scope"><el-button type="text" @click="editEvent(scope.row)">编辑</el-button><el-button type="text" class="danger-text" @click="removeEvent(scope.row)">删除</el-button></template></el-table-column>
      </el-table>
      <div class="pagination-row"><span>共 {{ filteredEvents.length }} 条</span><el-pagination background layout="prev, pager, next" :total="filteredEvents.length" :page-size="10" /></div>
    </div>

    <el-dialog :title="editingEvent ? '编辑不安全事件' : '新增不安全事件'" :visible.sync="dialogVisible" width="920px" top="6vh">
      <el-form :model="eventForm" label-position="top" size="small">
        <div class="form-section-title">事件概况</div>
        <el-form-item label="事件概况"><el-input v-model="eventForm.summary" placeholder="请输入事件简短描述" /></el-form-item><el-row :gutter="20"><el-col :span="8"><el-form-item label="发生部门/车间" required><el-select v-model="eventForm.department" placeholder="请选择" style="width:100%"><el-option v-for="item in departments" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col><el-col :span="8"><el-form-item label="发生地点" required><el-input v-model="eventForm.location" placeholder="请输入厂房、工段或设备位号" /></el-form-item></el-col><el-col :span="8"><el-form-item label="发生时间" required><el-date-picker v-model="eventForm.eventTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="请选择发生时间" style="width:100%" /></el-form-item></el-col><el-col :span="8"><el-form-item label="上报人"><el-input v-model="eventForm.reportUser" placeholder="请输入填报人姓名" /></el-form-item></el-col><el-col :span="8"><el-form-item label="上报时间"><el-input v-model="eventForm.reportTime" disabled /></el-form-item></el-col><el-col :span="8"><el-form-item label="事件类型" required><el-select v-model="eventForm.eventType" filterable placeholder="请选择事件类型" style="width:100%"><el-option v-for="item in eventTypes" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col><el-col :span="8"><el-form-item label="事件等级" required><el-select v-model="eventForm.eventLevel" placeholder="请选择事件等级" style="width:100%"><el-option v-for="item in levels" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col></el-row>
        <div class="form-section-title">事件经过及原因</div>
        <el-form-item label="事件经过"><el-input v-model="eventForm.process" type="textarea" :rows="4" placeholder="请客观描述事件发生全过程" /></el-form-item><el-form-item label="现场应急处置措施"><el-input v-model="eventForm.emergencyMeasure" type="textarea" :rows="4" placeholder="请输入事发后的处置动作" /></el-form-item><el-form-item label="直接经济损失"><el-input v-model="eventForm.economicLoss" placeholder="请输入金额"><template slot="append">元</template></el-input></el-form-item><el-row :gutter="20"><el-col :span="12"><el-form-item label="直接原因"><el-input v-model="eventForm.directCause" type="textarea" :rows="3" placeholder="请输入直接原因" /></el-form-item></el-col><el-col :span="12"><el-form-item label="间接原因"><el-input v-model="eventForm.indirectCause" type="textarea" :rows="3" placeholder="请输入间接原因" /></el-form-item></el-col></el-row>
        <div class="form-section-title">整改防范措施</div>
        <el-form-item label="整改防范措施"><el-input v-model="eventForm.rectification" type="textarea" :rows="4" placeholder="请逐条列明整改防范措施" /></el-form-item>
      </el-form>
      <span slot="footer"><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="saveEvent">保存</el-button></span>
    </el-dialog>
  </div>
</template>

<script>
import RecordTabs from '../components/RecordTabs';
import { unsafeEvents, unsafeEventTypes, unsafeEventLevels } from '../mock/unsafeEvents';

export default {
  name: 'UnsafeEventList',
  components: { RecordTabs },
  data () {
    return { events: unsafeEvents, eventTypes: unsafeEventTypes, levels: unsafeEventLevels, departments: ['电池回收车间', '浸出净化车间', '维修动力车间', '成品车间'], filters: { department: '', range: [], level: '' }, filterApplied: false, selectedEvents: [], dialogVisible: false, editingEvent: null, eventForm: this.emptyForm() };
  },
  computed: { filteredEvents () { return this.events.filter(item => (!this.filters.department || item.department === this.filters.department) && (!this.filters.level || item.eventLevel === this.filters.level)); } },
  methods: {
    emptyForm () { return { summary: '', department: '', location: '', eventTime: '', reportUser: '安环管理员', reportTime: '', eventType: '', eventLevel: '', process: '', emergencyMeasure: '', economicLoss: '', directCause: '', indirectCause: '', rectification: '' }; },
    now () { const date = new Date(); const pad = value => String(value).padStart(2, '0'); return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()); },
    resetFilters () { this.filters = { department: '', range: [], level: '' }; this.filterApplied = false; },
    handleSelectionChange (selection) { this.selectedEvents = selection; },
    exportSelected () { if (!this.selectedEvents.length) return this.$message.warning('请先选择要导出的事件'); const header = ['事件概况', '发生部门/车间', '发生地点', '发生时间', '上报人', '上报时间', '事件类型', '事件等级', '事件经过', '现场应急处置措施', '直接经济损失', '直接原因', '间接原因', '整改防范措施']; const rows = this.selectedEvents.map(item => [item.summary, item.department, item.location, item.eventTime, item.reportUser, item.reportTime, item.eventType, item.eventLevel, item.process, item.emergencyMeasure, item.economicLoss, item.directCause, item.indirectCause, item.rectification]); const csv = [header, ...rows].map(row => row.map(value => '"' + String(value || '').replace(/"/g, '""') + '"').join(',')).join('\n'); const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = '不安全事件记录-' + this.now().replace(/[-: ]/g, '') + '.csv'; anchor.click(); URL.revokeObjectURL(url); this.$message.success('已导出 ' + this.selectedEvents.length + ' 条不安全事件'); },
    openCreate () { this.editingEvent = null; this.eventForm = this.emptyForm(); this.eventForm.reportTime = this.now(); this.dialogVisible = true; },
    editEvent (row) { this.editingEvent = row; this.eventForm = { ...row }; this.dialogVisible = true; },
    saveEvent () { if (!this.eventForm.department || !this.eventForm.location || !this.eventForm.eventTime || !this.eventForm.eventType || !this.eventForm.eventLevel) return this.$message.warning('请先填写事件概况中的必填项'); if (this.editingEvent) { Object.assign(this.editingEvent, this.eventForm); this.$message.success('不安全事件已更新'); } else { this.events.unshift({ ...this.eventForm, id: 'UE-' + Date.now() }); this.$message.success('不安全事件已保存'); } this.dialogVisible = false; },
    removeEvent (row) { this.$confirm('确定删除这条不安全事件记录吗？', '提示', { type: 'warning' }).then(() => { const index = this.events.indexOf(row); if (index > -1) this.events.splice(index, 1); this.$message.success('已删除'); }).catch(() => {}); }
  }
};
</script>

<style scoped>
.list-card { overflow: hidden; }
.filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 14px 20px; padding: 18px 22px; border-bottom: 1px solid #ebeef5; }
.filter-item { display: flex; align-items: center; gap: 7px; color: #606266; }
.filter-item > span { white-space: nowrap; }
.filter-item .el-select { width: 145px; }
.filter-item .el-date-editor { width: 250px; }
.event-table { width: 100%; }
.pagination-row { height: 64px; display: flex; justify-content: flex-end; align-items: center; gap: 18px; padding: 0 22px; color: #909399; font-size: 12px; }
.form-section-title { margin: 8px 0 18px; padding-left: 10px; border-left: 3px solid #0b5a9e; color: #273b51; font-size: 14px; font-weight: 600; }
.danger-text { color: #f56c6c; }
</style>
