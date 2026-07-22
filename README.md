# 安全生产事故记录 · Vue2 高保真原型

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:8080/#/accidents`，点击列表中的“查看详情”进入事故详情页。

## 构建部署

```bash
npm run build
```

将 `dist` 目录部署到 Cloudflare Pages，构建命令可填写 `npm run build`，输出目录填写 `dist`。

## 原型范围

- Vue 2.7 + Element UI + Vue Router 3
- 无后台接口，数据位于 `src/mock/accidents.js`
- 事故概况与伤者工伤认定申请表在同一详情页
- 一名伤者对应一张申请表，多名伤者可分别新增、编辑、展开、折叠和导出
- 上传、分页、搜索、弹窗和导出均为本地 Mock 交互
