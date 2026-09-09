export const unsafeEventTypes = [
  '物体打击', '厂（场）内车辆致害', '机械致害', '起重致害', '触电', '淹溺', '灼烫', '火灾',
  '高处坠落', '跌落', '坍塌', '容器爆炸', '管道爆炸', '可燃气体爆炸', '可燃液体蒸气爆炸',
  '其他可燃固体爆炸', '中毒', '窒息', '泄漏', '其他事故'
];

export const unsafeEventLevels = ['未遂事件', '险肇事件', '不安全事件'];

export const unsafeEvents = [
  {
    id: 'UE-20260818-001', summary: '输送线防护罩松动，存在人员卷入风险', department: '电池回收车间', location: '拆解工段2号输送线', eventTime: '2026-08-18 15:20',
    reportUser: '安环管理员', reportTime: '2026-08-18 15:35:12', eventType: '机械致害', eventLevel: '险肇事件',
    process: '巡检时发现输送线防护罩松动，设备运行过程中存在人员卷入风险，现场立即停止设备并组织检查。',
    emergencyMeasure: '立即停机，设置警戒区域，安排维修人员对防护罩进行紧固，确认安全后恢复运行。',
    economicLoss: '0', directCause: '设备防护罩紧固件松动。', indirectCause: '日常点检对防护设施检查不到位。',
    rectification: '1. 完善输送线防护设施点检标准；\n2. 对相关岗位人员开展专项培训；\n3. 增加设备防护设施巡检频次。'
  },
  {
    id: 'UE-20260812-002', summary: '高处作业平台临时护栏缺失', department: '浸出净化车间', location: '净化工段三楼平台', eventTime: '2026-08-12 09:10',
    reportUser: '王海涛', reportTime: '2026-08-12 09:22:46', eventType: '高处坠落', eventLevel: '未遂事件',
    process: '作业人员登高检查管线时发现平台边缘临时护栏缺失，未继续作业并报告现场负责人。',
    emergencyMeasure: '立即停止登高作业，设置警示标识，安排人员恢复临边防护。',
    economicLoss: '0', directCause: '临时护栏未及时恢复。', indirectCause: '检维修作业结束后的现场验收不到位。',
    rectification: '1. 补充临边防护验收要求；\n2. 作业结束后由负责人进行现场复核；\n3. 加强高处作业安全检查。'
  }
];
