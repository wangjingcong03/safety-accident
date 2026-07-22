<template>
  <div>
    <div class="page-header"><div class="breadcrumb">安全生产管理 <i class="el-icon-arrow-right"></i> <strong>安全生产事故记录</strong></div><el-button type="primary" icon="el-icon-plus" @click="openCreate">新建</el-button></div>
    <div class="section-card list-card">
      <div class="filter-row">
        <div class="filter-item"><span>所属车间：</span><el-select v-model="filters.workshop" clearable placeholder="请选择" size="small"><el-option v-for="item in workshops" :key="item" :label="item" :value="item" /></el-select></div>
        <div class="filter-item"><span>记录时间：</span><el-date-picker v-model="filters.range" type="daterange" size="small" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /></div>
        <div class="filter-item"><span>工伤申请：</span><el-select v-model="filters.status" clearable placeholder="全部" size="small"><el-option label="已填写" value="已填写"/><el-option label="未填写" value="未填写"/></el-select></div>
        <el-button type="primary" size="small" icon="el-icon-search" @click="filterApplied = true">查询</el-button><el-button size="small" icon="el-icon-refresh" @click="resetFilters">重置</el-button>
      </div>
      <el-table :data="filteredAccidents" stripe class="accident-table" @row-click="goDetail">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="workshop" label="所属车间" min-width="150" />
        <el-table-column prop="name" label="安全生产事故名称" min-width="300" show-overflow-tooltip />
        <el-table-column prop="level" label="事故等级" width="100" align="center"><template slot-scope="scope"><el-tag size="mini" type="warning">{{ scope.row.level }}</el-tag></template></el-table-column>
        <el-table-column prop="happenedAt" label="事故发生时间" width="170" />
        <el-table-column prop="responsible" label="责任人" width="110" />
        <el-table-column label="伤者/申请表" width="150" align="center"><template slot-scope="scope"><span v-if="scope.row.injuredCount">{{ scope.row.injuredCount }} 人 / {{ scope.row.applicationCount }} 份</span><span v-else class="muted-text">无伤者</span></template></el-table-column>
        <el-table-column label="工伤申请" width="120" align="center"><template slot-scope="scope"><el-tag size="mini" :type="scope.row.status === '已填写' ? 'success' : 'info'">{{ scope.row.status }}</el-tag></template></el-table-column>
        <el-table-column label="操作" fixed="right" width="100" align="center"><template slot-scope="scope"><el-button type="text" @click.stop="goDetail(scope.row)">查看详情</el-button></template></el-table-column>
      </el-table>
      <div class="pagination-row"><span>共 {{ filteredAccidents.length }} 条</span><el-pagination background layout="prev, pager, next" :total="filteredAccidents.length" :page-size="10" /></div>
    </div>
    <el-dialog title="新增安全生产事故" :visible.sync="createVisible" width="680px"><el-form :model="createForm" label-width="116px" size="small"><el-row :gutter="24"><el-col :span="12"><el-form-item label="所属车间"><el-select v-model="createForm.workshop" placeholder="请选择" style="width:100%"><el-option v-for="item in workshops" :key="item" :label="item" :value="item"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="事故名称"><el-input v-model="createForm.name" placeholder="请输入事故名称"/></el-form-item></el-col><el-col :span="12"><el-form-item label="事故等级"><el-select v-model="createForm.level" style="width:100%"><el-option label="一般" value="一般"/><el-option label="较大" value="较大"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="发生时间"><el-date-picker v-model="createForm.happenedAt" type="datetime" value-format="yyyy-MM-dd HH:mm" style="width:100%"/></el-form-item></el-col><el-col :span="12"><el-form-item label="是否造成人员受伤"><el-radio-group v-model="createForm.hasInjury"><el-radio :label="true">是</el-radio><el-radio :label="false">否</el-radio></el-radio-group></el-form-item></el-col><el-col :span="12"><el-form-item label="责任人"><el-input v-model="createForm.responsible" placeholder="请输入责任人"/></el-form-item></el-col><el-col :span="24"><el-form-item label="备注"><el-input type="textarea" :rows="3" v-model="createForm.note" placeholder="请输入备注"/></el-form-item></el-col></el-row></el-form><span slot="footer"><el-button @click="createVisible = false">取消</el-button><el-button type="primary" @click="createAccident">保存</el-button></span></el-dialog>
  </div>
</template>

<script>
import { accidents } from '../mock/accidents';
export default { name: 'AccidentList', data () { return { accidents, filters: { workshop: '', range: [], status: '' }, filterApplied: false, createVisible: false, workshops: ['电池回收车间', '浸出净化车间', '维修动力车间', '成品车间'], createForm: { workshop: '', name: '', level: '一般', happenedAt: '', hasInjury: false, responsible: '', note: '' } }; }, computed: { filteredAccidents () { return this.accidents.filter(item => (!this.filters.workshop || item.workshop === this.filters.workshop) && (!this.filters.status || item.status === this.filters.status)); } }, methods: { goDetail (row) { this.$router.push({ name: 'AccidentDetail', params: { id: row.id } }); }, resetFilters () { this.filters = { workshop: '', range: [], status: '' }; this.filterApplied = false; }, openCreate () { this.createForm = { workshop: '', name: '', level: '一般', happenedAt: '', hasInjury: false, responsible: '', note: '' }; this.createVisible = true; }, createAccident () { if (!this.createForm.workshop || !this.createForm.name) return this.$message.warning('请先填写车间和事故名称'); const item = { id: 'ACC-' + Date.now(), workshop: this.createForm.workshop, name: this.createForm.name, level: this.createForm.level, type: '其他伤害', happenedAt: this.createForm.happenedAt || '2026-07-22 10:00', location: '', responsible: this.createForm.responsible || '待确认', injuredCount: 0, applicationCount: 0, status: '未填写', incident: '', note: this.createForm.note, injuries: [] }; this.accidents.unshift(item); this.createVisible = false; this.$message.success('事故记录已保存'); this.goDetail(item); } } };
</script>

<style scoped>
.list-card { overflow: hidden; }.filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 14px 20px; padding: 18px 22px; border-bottom: 1px solid #ebeef5; }.filter-item { display: flex; align-items: center; gap: 7px; color: #606266; }.filter-item > span { white-space: nowrap; }.filter-item .el-select { width: 145px; }.filter-item .el-date-editor { width: 250px; }.accident-table { width: 100%; }.pagination-row { height: 64px; display: flex; justify-content: flex-end; align-items: center; gap: 18px; padding: 0 22px; color: #909399; font-size: 12px; }.muted-text { color: #a8abb2; }
</style>
