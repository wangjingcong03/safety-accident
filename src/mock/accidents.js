export const accidents = [
  {
    id: 'ACC-20260512-001',
    workshop: '电池回收车间',
    name: '电池回收车间“5·12”机械伤害事故',
    level: '一般',
    type: '机械伤害',
    happenedAt: '2026-05-12 11:40',
    location: '电池回收车间维修区',
    responsible: '张鹏',
    recordUser: '安环管理员',
    recordTime: '2026-05-12 11:52:18',
    injuredCount: 1,
    applicationCount: 1,
    status: '已填写',
    workflowStatus: '未发起',
    currentNode: '待发起',
    ccStatus: '待抄送',
    hrStatus: '待审批',
    insuranceHandler: '',
    incident: '2026年5月12日上午，周永鹏在电池回收车间维修电动地牛前轮。维修过程中设备意外滑落，导致其右手中指被挤压受伤。事故发生后，车间立即组织现场核实并安排送医。',
    note: '已完成初步事故记录，申请表可继续补充医疗信息。',
    injuries: [
      {
        id: 'INJ-001', expanded: true, formStatus: '已填写',
        name: '周永鹏', idCard: '13022419930831851X', phone: '18532662202',
        entryDate: '2018-05-09', address: '河北省唐山市曹妃甸区玉带景园小区4-2-2402',
        team: '常白', position: '设备维修', leader: '张鹏', leaderPhone: '15911127110',
        injuredAt: '2026-05-12 11:40', diagnosis: '右手开放伤', hospital: '唐山市第二医院',
        injuryPart: '右手中指', currentCondition: '伤员初步诊断为右手开放伤，目前在唐山市第二医院住院治疗。',
        brief: '2026年5月12日上午周永鹏维修电动地牛前轮。11点23分周永鹏打电话叫丁瑞宏帮忙，为方便操作，电动地牛的前端支撑在另一个手动地牛上，前轮抬高离地约10cm。丁瑞宏按要求将电动地牛辅助固定，周永鹏在被抬起的电动地牛下方进行安装车轮。11点40分左右，电动地牛意外发生滑落，导致周永鹏的右手中指被挤压受伤。',
        prevention: '一是严格执行支撑规范，抬升设备必须使用专业液压千斤顶并配合安全支架；二是规范维修流程，严禁在未可靠固定时将身体伸入设备下方；三是强化检维修安全培训和现场监护。',
        witness: [{ name: '冯立志', phone: '18532662723', position: '车间安全员' }, { name: '丁瑞宏', phone: '18532662808', position: '乙班班组长' }],
        attachments: [{ name: '诊断证明-周永鹏.pdf', size: '1.8 MB', status: 'success' }, { name: '事故现场照片.zip', size: '6.2 MB', status: 'success' }]
      }
    ]
  },
  {
    id: 'ACC-20240717-002', workshop: '浸出净化车间', name: '设备检修过程中人员受伤事故', level: '一般', type: '物体打击',
    happenedAt: '2024-07-17 16:58', location: '101原料车间', responsible: '无', recordUser: '安环管理员', recordTime: '2024-07-17 17:06:42', injuredCount: 0, applicationCount: 0, status: '未填写',
    workflowStatus: '未发起', currentNode: '待发起', ccStatus: '待抄送', hrStatus: '待审批', insuranceHandler: '',
    incident: '事故记录待补充。', note: '请安环管理员完善事故经过。', injuries: []
  },
  {
    id: 'ACC-20240628-003', workshop: '维修动力车间', name: '维修作业轻微擦伤事件', level: '一般', type: '其他伤害',
    happenedAt: '2024-06-28 09:20', location: '维修动力车间机修间', responsible: '李建国', recordUser: '安环管理员', recordTime: '2024-06-28 09:31:07', injuredCount: 1, applicationCount: 0, status: '未填写',
    workflowStatus: '未发起', currentNode: '待发起', ccStatus: '待抄送', hrStatus: '待审批', insuranceHandler: '',
    incident: '作业人员在设备维护过程中手部擦伤，已进行现场处置。', note: '', injuries: [{ id: 'INJ-002', expanded: true, formStatus: '未填写', name: '李建国', idCard: '', phone: '', entryDate: '', address: '', team: '', position: '机修工', leader: '李建国', leaderPhone: '', injuredAt: '2024-06-28 09:20', diagnosis: '', hospital: '', injuryPart: '', currentCondition: '', brief: '', prevention: '', witness: [{ name: '', phone: '', position: '' }], attachments: [] }]
  }
];

export const employeeOptions = [
  { name: '周永鹏', idCard: '13022419930831851X', phone: '18532662202', entryDate: '2018-05-09', address: '河北省唐山市曹妃甸区玉带景园小区4-2-2402', team: '常白', position: '设备维修', leader: '张鹏', leaderPhone: '15911127110' },
  { name: '李建国', idCard: '130224198506211234', phone: '18600001234', entryDate: '2016-03-17', address: '唐山市曹妃甸区', team: '甲班', position: '机修工', leader: '李建国', leaderPhone: '18600001234' },
  { name: '王海涛', idCard: '130224199112052345', phone: '13700005678', entryDate: '2020-08-21', address: '唐山市曹妃甸区', team: '乙班', position: '岗位操作工', leader: '王鹏', leaderPhone: '13900004567' }
];
