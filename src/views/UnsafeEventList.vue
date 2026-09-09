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
      <div class="statistics-panel">
        <div class="stats-grid"><div class="stat-card"><span>事件总数</span><strong>{{ filteredEvents.length }}</strong><small>当前筛选范围</small></div><div class="stat-card"><span>未遂事件</span><strong>{{ levelCounts.未遂事件 }}</strong><small>按事件等级统计</small></div><div class="stat-card"><span>险肇事件</span><strong>{{ levelCounts.险肇事件 }}</strong><small>按事件等级统计</small></div><div class="stat-card"><span>不安全事件</span><strong>{{ levelCounts.不安全事件 }}</strong><small>按事件等级统计</small></div><div class="stat-card"><span>直接经济损失</span><strong>{{ totalLoss }}</strong><small>元</small></div></div>
        <div class="trend-card"><div class="trend-header"><div><h3>月度变化趋势</h3><span>默认展示近12个月，当前筛选条件同步更新</span></div><i class="el-icon-data-line"></i></div><div class="chart-wrap"><svg viewBox="0 0 760 230" preserveAspectRatio="none" class="trend-chart"><defs><linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f08a4b" stop-opacity=".25"/><stop offset="100%" stop-color="#f08a4b" stop-opacity=".02"/></linearGradient></defs><line x1="42" y1="180" x2="735" y2="180" class="axis-line"/><line x1="42" y1="115" x2="735" y2="115" class="grid-line"/><line x1="42" y1="50" x2="735" y2="50" class="grid-line"/><polygon :points="trendAreaPoints" class="trend-area"/><polyline :points="trendPoints" class="trend-line"/><circle v-for="point in trendPointItems" :key="point.key" :cx="point.x" :cy="point.y" r="4" class="trend-point"/><text v-for="point in trendPointItems" :key="point.key + '-label'" :x="point.x" y="207" text-anchor="middle" class="axis-label">{{ point.label }}</text><text x="24" y="184" class="axis-label">0</text><text x="24" y="119" class="axis-label">{{ trendMax > 1 ? Math.ceil(trendMax / 2) : 1 }}</text><text x="24" y="54" class="axis-label">{{ trendMax }}</text></svg></div></div>
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
        <el-table-column label="审批状态" width="145" align="center"><template slot-scope="scope"><el-tag size="mini" :type="workflowTagType(scope.row)">{{ scope.row.workflowStatus }}</el-tag></template></el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center"><template slot-scope="scope"><el-button type="text" @click="editEvent(scope.row)">编辑</el-button><el-button type="text" class="danger-text" @click="removeEvent(scope.row)">删除</el-button></template></el-table-column>
      </el-table>
      <div class="pagination-row"><span>共 {{ filteredEvents.length }} 条</span><el-pagination background layout="prev, pager, next" :total="filteredEvents.length" :page-size="10" /></div>
    </div>

  </div>
</template>

<script>
import RecordTabs from '../components/RecordTabs';
import { unsafeEvents, unsafeEventLevels } from '../mock/unsafeEvents';

export default {
  name: 'UnsafeEventList',
  components: { RecordTabs },
  data () {
    return { events: unsafeEvents, levels: unsafeEventLevels, departments: ['电池回收车间', '浸出净化车间', '维修动力车间', '成品车间'], filters: { department: '', range: [], level: '' }, filterApplied: false, selectedEvents: [] };
  },
  computed: {
    filteredEvents () { return this.events.filter(item => (!this.filters.department || item.department === this.filters.department) && (!this.filters.level || item.eventLevel === this.filters.level) && this.inSelectedRange(item)); },
    levelCounts () { return this.levels.reduce((result, level) => { result[level] = this.filteredEvents.filter(item => item.eventLevel === level).length; return result; }, {}); },
    totalLoss () { return this.filteredEvents.reduce((total, item) => total + (Number(item.economicLoss) || 0), 0); },
    trendMonths () { const end = this.filters.range && this.filters.range.length === 2 ? new Date(this.filters.range[1] + ' 00:00:00') : new Date(); const start = this.filters.range && this.filters.range.length === 2 ? new Date(this.filters.range[0] + ' 00:00:00') : new Date(end.getFullYear(), end.getMonth() - 11, 1); const months = []; const cursor = new Date(start.getFullYear(), start.getMonth(), 1); const last = new Date(end.getFullYear(), end.getMonth(), 1); while (cursor <= last && months.length < 12) { const month = cursor.getMonth() + 1; months.push({ key: cursor.getFullYear() + '-' + String(month).padStart(2, '0'), label: month + '月' }); cursor.setMonth(cursor.getMonth() + 1); } return months; },
    trendMax () { return Math.max(1, ...this.trendMonths.map(month => this.filteredEvents.filter(item => item.eventTime.slice(0, 7) === month.key).length)); },
    trendPointItems () { const width = this.trendMonths.length > 1 ? 693 / (this.trendMonths.length - 1) : 0; return this.trendMonths.map((month, index) => { const value = this.filteredEvents.filter(item => item.eventTime.slice(0, 7) === month.key).length; return { ...month, value, x: 42 + index * width, y: 180 - (value / this.trendMax) * 130 }; }); },
    trendPoints () { return this.trendPointItems.map(point => point.x + ',' + point.y).join(' '); },
    trendAreaPoints () { const points = this.trendPointItems; if (!points.length) return '42,180 735,180'; return '42,180 ' + points.map(point => point.x + ',' + point.y).join(' ') + ' ' + points[points.length - 1].x + ',180'; }
  },
  methods: {
    now () { const date = new Date(); const pad = value => String(value).padStart(2, '0'); return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()); },
    inSelectedRange (item) { if (!this.filters.range || this.filters.range.length !== 2) return true; const date = item.eventTime.slice(0, 10); return date >= this.filters.range[0] && date <= this.filters.range[1]; },
    resetFilters () { this.filters = { department: '', range: [], level: '' }; this.filterApplied = false; },
    handleSelectionChange (selection) { this.selectedEvents = selection; },
    exportSelected () { if (!this.selectedEvents.length) return this.$message.warning('请先选择要导出的事件'); const header = ['事件概况', '发生部门/车间', '发生地点', '发生时间', '上报人', '上报时间', '事件类型', '事件等级', '事件经过', '现场应急处置措施', '直接经济损失', '直接原因', '间接原因', '整改防范措施']; const rows = this.selectedEvents.map(item => [item.summary, item.department, item.location, item.eventTime, item.reportUser, item.reportTime, item.eventType, item.eventLevel, item.process, item.emergencyMeasure, item.economicLoss, item.directCause, item.indirectCause, item.rectification]); const csv = [header, ...rows].map(row => row.map(value => '"' + String(value || '').replace(/"/g, '""') + '"').join(',')).join('\n'); const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = '不安全事件记录-' + this.now().replace(/[-: ]/g, '') + '.csv'; anchor.click(); URL.revokeObjectURL(url); this.$message.success('已导出 ' + this.selectedEvents.length + ' 条不安全事件'); },
    openCreate () { this.$router.push('/unsafe-events/new'); },
    editEvent (row) { this.$router.push('/unsafe-events/' + row.id); },
    workflowTagType (row) { return { '未提交': 'info', '待车间主任审批': 'warning', '待安环部确认': 'warning', '已完成': 'success' }[row.workflowStatus] || 'info'; },
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
.statistics-panel { padding: 18px 22px 20px; border-bottom: 1px solid #ebeef5; background: #fbfcfe; }
.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.stat-card { min-height: 88px; padding: 14px 16px; border: 1px solid #e5ebf2; border-radius: 4px; background: #fff; }
.stat-card span, .stat-card small { display: block; color: #98a2b3; font-size: 12px; }
.stat-card strong { display: block; margin: 7px 0 3px; color: #273b51; font-size: 24px; font-weight: 600; }
.trend-card { margin-top: 16px; padding: 16px 18px 8px; border: 1px solid #e5ebf2; border-radius: 4px; background: #fff; }
.trend-header { display: flex; align-items: center; justify-content: space-between; }
.trend-header h3 { display: inline-block; margin: 0 10px 4px 0; color: #273b51; font-size: 15px; }
.trend-header span { color: #a2abb7; font-size: 12px; }
.trend-header i { color: #0b5a9e; font-size: 20px; }
.chart-wrap { height: 230px; margin-top: 4px; }
.trend-chart { width: 100%; height: 230px; overflow: visible; }
.axis-line { stroke: #dfe6ee; stroke-width: 1; }
.grid-line { stroke: #edf1f5; stroke-width: 1; stroke-dasharray: 4 4; }
.trend-area { fill: url(#trendAreaGradient); }
.trend-line { fill: none; stroke: #ed7b36; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.trend-point { fill: #fff; stroke: #ed7b36; stroke-width: 2; }
.axis-label { fill: #98a2b3; font-size: 11px; }
.form-section-title { margin: 8px 0 18px; padding-left: 10px; border-left: 3px solid #0b5a9e; color: #273b51; font-size: 14px; font-weight: 600; }
.danger-text { color: #f56c6c; }
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
</style>
