// 修复跨域 & iOS 兼容版 CatVod 内核
const CatVodCore = {
  configList: [],
  currentConfig: null,

  // 加载远程JS配置（用cors代理绕过跨域）
  async loadConfig(url) {
    try {
      // 1. 先用cors代理获取JS内容
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("代理请求失败");
      const jsCode = await res.text();

      // 2. 用沙箱方式执行JS，避免直接eval被拦截
      const script = document.createElement('script');
      script.textContent = jsCode;
      document.body.appendChild(script);
      document.body.removeChild(script);

      // 3. 验证核心函数是否加载成功
      if (typeof window.getSiteClass !== 'function') {
        throw new Error("脚本加载成功，但未找到核心函数");
      }
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
