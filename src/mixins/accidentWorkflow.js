import Vue from 'vue';

Vue.mixin({
  data () {
    if (this.$options.name !== 'AccidentDetail') return {};
    return {
      approvalDialogVisible: false,
      approvalHandler: '',
      approvalComment: '',
      insuranceHandlers: ['王丽', '刘芳', '赵明']
    };
  },
  computed: {
    workflowActionVisible () {
      return this.$options.name === 'AccidentDetail' && this.accident && this.accident.workflowStatus === '审批中' && ['安全环保部审批', '人力资源部审批', '工伤保险办理人员签收'].includes(this.accident.currentNode);
    },
    approvalDialogTitle () {
      return this.accident ? this.accident.currentNode + '确认' : '审批确认';
    }
  },
  methods: {
    openApprovalDialog () {
      this.approvalHandler = this.accident.insuranceHandler || '';
      this.approvalComment = '';
      this.approvalDialogVisible = true;
    },
    confirmApproval () {
      if (this.accident.currentNode === '人力资源部审批' && !this.approvalHandler) return this.$message.warning('请选择工伤保险办理人员');
      this.$confirm('确认通过“' + this.accident.currentNode + '”吗？', '二次确认', { type: 'warning', confirmButtonText: '确认通过', cancelButtonText: '取消' }).then(() => {
        if (this.accident.currentNode === '安全环保部审批') {
          this.accident.currentNode = '人力资源部审批';
          this.accident.ccStatus = '已抄送';
          this.accident.hrStatus = '审批中';
        } else if (this.accident.currentNode === '人力资源部审批') {
          this.accident.currentNode = '工伤保险办理人员签收';
          this.accident.hrStatus = '已通过';
          this.accident.insuranceHandler = this.approvalHandler;
        } else {
          this.accident.workflowStatus = '已结束';
          this.accident.currentNode = '已结束';
          this.accident.ccStatus = '已抄送';
          this.accident.hrStatus = '已通过';
          this.accident.insuranceHandler = this.accident.insuranceHandler + '（已签收）';
        }
        this.approvalDialogVisible = false;
        this.$message.success('审批已通过');
      }).catch(() => {});
    }
  }
});
