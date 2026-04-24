// 原生支持 .js.md5 后缀源｜不修改原链接、直接加载
const CatVodCore = {
  configList: [],
  currentConfig: null,

  // 直接加载完整原始链接，不剔除、不改地址
  async loadConfig(rawUrl) {
    try {
      // 直接使用用户输入完整链接，0修改
      const targetUrl = rawUrl;
      // 跨域代理
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("资源请求失败");
      // 强制读取纯文本，无视后缀&响应类型
      const jsCode = await res.text();

      // 注入执行JS代码
      const script = document.createElement('script');
      script.textContent = jsCode;
      document.body.appendChild(script);
      document.body.removeChild(script);

      // 校验CatVod标准函数
      if (typeof window.getSiteClass !== 'function') {
        throw new Error("脚本非标准CatVod格式");
      }
      return true;
    } catch (e) {
      console.error("源加载错误：", e);
      return false;
    }
  },

  // 分类
  async getCategory() {
    if (!window.getSiteClass) return [];
    return await window.getSiteClass();
  },

  // 影片列表
  async getList(ids, pg = 1) {
    if (!window.getSiteVideo) return [];
    return await window.getSiteVideo(ids, pg);
  },

  // 搜索
  async search(key) {
    if (!window.get???SiteSearch) return [];
    return await window.getSiteSearch(key);
  },

  // 播放解析
  async getPlayUrl(id) {
    if (!window.getSitePlay) return null;
    return await window.getSitePlay(id);
  }
};

// 本地源数据库
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
