<template>
  <div class="detail-page unsafe-detail-page">
    <div class="page-header">
      <div class="breadcrumb"><span class="link-text" @click="$router.push('/unsafe-events')">安全生产事故记录</span> <i class="el-icon-arrow-right"></i> <strong>不安全事件详情</strong></div>
      <div class="detail-actions">
        <el-button size="small" icon="el-icon-back" @click="$router.push('/unsafe-events')">返回列表</el-button>
        <el-button v-if="event && event.workflowStatus !== '已完成'" size="small" type="primary" icon="el-icon-check" @click="processWorkflow">{{ workflowActionLabel }}</el-button>
        <el-button size="small" icon="el-icon-s-operation">查看流程</el-button>
        <el-button size="small" type="primary" icon="el-icon-check" @click="saveEvent">保存</el-button>
      </div>
    </div>

    <section v-if="event" class="section-card event-detail-card">
      <div class="section-title"><div><h3>事件概况</h3><span class="sub">不安全事件信息填写</span></div><span class="detail-node">当前节点：{{ event.currentNode }}</span></div>
      <div class="section-body">
        <el-form :model="event" label-position="top" size="small">
          <div class="form-section-title">事件概况</div>
          <el-form-item label="事件概况"><el-input v-model="event.summary" placeholder="请输入事件简短描述" /></el-form-item>
          <el-row :gutter="20">
            <el-col :span="8"><el-form-item label="发生部门/车间" required><el-select v-model="event.department" placeholder="请选择" style="width:100%"><el-option v-for="item in departments" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="发生地点" required><el-input v-model="event.location" placeholder="请输入厂房、工段或设备位号" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="发生时间" required><el-date-picker v-model="event.eventTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="请选择发生时间" style="width:100%" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="上报人"><el-input v-model="event.reportUser" placeholder="请输入填报人姓名" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="上报时间"><el-input v-model="event.reportTime" disabled /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="事件类型" required><el-select v-model="event.eventType" filterable placeholder="请选择事件类型" style="width:100%"><el-option v-for="item in eventTypes" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="事件等级" required><el-select v-model="event.eventLevel" placeholder="请选择事件等级" style="width:100%"><el-option v-for="item in levels" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
          </el-row>
          <div class="form-section-title">事件经过及原因</div>
          <el-form-item label="事件经过"><el-input v-model="event.process" type="textarea" :rows="4" placeholder="请客观描述事件发生全过程" /></el-form-item>
          <el-form-item label="现场应急处置措施"><el-input v-model="event.emergencyMeasure" type="textarea" :rows="4" placeholder="请输入事发后的处置动作" /></el-form-item>
          <el-form-item label="直接经济损失"><el-input v-model="event.economicLoss" placeholder="请输入金额"><template slot="append">元</template></el-input></el-form-item>
          <el-row :gutter="20"><el-col :span="12"><el-form-item label="直接原因"><el-input v-model="event.directCause" type="textarea" :rows="3" placeholder="请输入直接原因" /></el-form-item></el-col><el-col :span="12"><el-form-item label="间接原因"><el-input v-model="event.indirectCause" type="textarea" :rows="3" placeholder="请输入间接原因" /></el-form-item></el-col></el-row>
          <div class="form-section-title">整改防范措施</div>
          <el-form-item label="整改防范措施"><el-input v-model="event.rectification" type="textarea" :rows="4" placeholder="请逐条列明整改防范措施" /></el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import { unsafeEvents, unsafeEventTypes, unsafeEventLevels } from '../mock/unsafeEvents';

export default {
  name: 'UnsafeEventDetail',
  props: { id: { type: String, default: '' } },
  data () {
    return {
      events: unsafeEvents,
      eventTypes: unsafeEventTypes,
      levels: unsafeEventLevels,
      departments: ['电池回收车间', '浸出净化车间', '维修动力车间', '成品车间'],
      event: null,
      isNew: false
    };
  },
  computed: {
    workflowActionLabel () { return { '未提交': '发起审批', '待车间主任审批': '车间主任审批', '待安环部确认': '安环部确认' }[this.event && this.event.workflowStatus] || '流程完成'; }
  },
  created () {
    this.isNew = this.$route.name === 'UnsafeEventCreate' || this.id === 'new';
    if (this.isNew) {
      this.event = { ...this.emptyForm(), id: 'UE-' + Date.now(), reportTime: this.now(), workflowStatus: '未提交', currentNode: '待提交' };
    } else {
      this.event = this.events.find(item => item.id === this.id);
      if (!this.event) this.$router.replace('/unsafe-events');
    }
  },
  methods: {
    emptyForm () { return { summary: '', department: '', location: '', eventTime: '', reportUser: '安环管理员', reportTime: '', eventType: '', eventLevel: '', process: '', emergencyMeasure: '', economicLoss: '', directCause: '', indirectCause: '', rectification: '' }; },
    now () { const date = new Date(); const pad = value => String(value).padStart(2, '0'); return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()); },
    saveEvent () {
      if (!this.event.department || !this.event.location || !this.event.eventTime || !this.event.eventType || !this.event.eventLevel) return this.$message.warning('请先填写事件概况中的必填项');
      if (this.isNew) this.events.unshift(this.event);
      this.$message.success(this.isNew ? '不安全事件已保存' : '不安全事件已更新');
      this.$router.push('/unsafe-events');
    },
    processWorkflow () {
      const messages = { '未提交': '确认提交该不安全事件，进入车间主任审批吗？', '待车间主任审批': '确认车间主任审批通过，进入安全环保部确认吗？', '待安环部确认': '确认安全环保部已确认，结束该流程吗？' };
      const nextStatus = { '未提交': '待车间主任审批', '待车间主任审批': '待安环部确认', '待安环部确认': '已完成' };
      this.$confirm(messages[this.event.workflowStatus], '流程操作确认', { type: 'warning', confirmButtonText: '确认', cancelButtonText: '取消' }).then(() => {
        this.event.workflowStatus = nextStatus[this.event.workflowStatus];
        this.event.currentNode = this.event.workflowStatus === '已完成' ? '已结束' : this.event.workflowStatus;
        this.$message.success('流程已流转至：' + this.event.workflowStatus);
      }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.link-text { color: #0b5a9e; cursor: pointer; }
.detail-actions { display: flex; align-items: center; gap: 10px; }
.detail-node { color: #98a2b3; font-size: 12px; }
.event-detail-card { margin-bottom: 30px; }
.event-detail-card .section-body { padding: 24px 28px 30px; }
.form-section-title { margin: 8px 0 18px; padding-left: 10px; border-left: 3px solid #0b5a9e; color: #273b51; font-size: 14px; font-weight: 600; }
.event-detail-card .el-form-item { margin-bottom: 18px; }
@media (max-width: 1100px) { .detail-actions { gap: 6px; } .detail-node { display: none; } }
</style>
