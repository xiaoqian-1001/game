// CatVod 通用解析内核 - 适配JSTV/TVbox标准源
const CatVodCore = {
  configList: [],
  currentConfig: null,

  // 加载远程JS配置
  async loadConfig(url) {
    try {
      const res = await fetch(url);
      const jsCode = await res.text();
      window.eval(jsCode);
      return true;
    } catch (e) {
      console.error("配置加载失败", e);
      return false;
    }
  },

  // 执行分类
  async getCategory() {
    if (!window.getSiteClass) return [];
    return await window.getSiteClass();
  },

  // 执行列表
  async getList(ids, pg = 1) {
    if (!window.getSiteVideo) return [];
    return await window.getSiteVideo(ids, pg);
  },

  // 搜索
  async search(key) {
    if (!window.getSiteSearch) return [];
    return await window.getSiteSearch(key);
  },

  // 播放解析
  async getPlayUrl(id) {
    if (!window.getSitePlay) return null;
    return await window.getSitePlay(id);
  }
};

// 本地配置管理
const SourceDB = {
  get() {
    return JSON.parse(localStorage.getItem("jstv_source") || "[]");
  },
  save(list) {
    localStorage.setItem("jstv_source", JSON.stringify(list));
  },
  add(url) {
    const list = this.get();
    if (!list.includes(url)) list.push(url);
    this.save(list);
  },
  del(index) {
    const list = this.get();
    list.splice(index, 1);
    this.save(list);
  }
};
