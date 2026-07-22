<template>
  <div id="app" class="app-shell">
    <header class="topbar">
      <div class="brand-block">
        <div class="brand-mark"><i class="el-icon-s-home"></i></div>
        <div>
          <div class="brand-title">瑞木博士</div>
          <div class="brand-subtitle">智慧工厂安全管理平台</div>
        </div>
      </div>
      <div class="top-tabs">
        <span class="top-tab muted">作业活动风险评估</span>
        <span class="top-tab active"><i class="el-icon-warning-outline"></i> 安全生产事故记录</span>
        <span class="top-tab muted">车间安全运行天数</span>
      </div>
      <div class="top-actions">
        <i class="el-icon-bell"></i>
        <span class="user-avatar">安</span>
        <span class="user-name">安环管理员</span>
        <i class="el-icon-arrow-down"></i>
      </div>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default { name: 'App' };
</script>
