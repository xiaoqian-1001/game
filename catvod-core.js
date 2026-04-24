// 三重加固版：解决跨域 + 代理失效 + iOS Safari 兼容
const CatVodCore = {
  configList: [],
  currentConfig: null,

  // 备用跨域代理列表（防止单个代理失效）
  proxyList: [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://api.codetabs.com/v1/proxy?quest="
  ],

  // 尝试所有代理，找到可用的一个
  async fetchWithFallback(url) {
    for (const proxy of this.proxyList) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url);
        const res = await fetch(proxyUrl, { timeout: 10000 });
        if (res.ok) {
          const text = await res.text();
          if (text && text.length > 100) {
            return text;
          }
        }
      } catch (e) {
        console.warn(`代理 ${proxy} 失败，尝试下一个`);
      }
    }
    throw new Error("所有代理均无法加载资源");
  },

  // 加载远程JS｜原生支持.md5后缀
  async loadConfig(rawUrl) {
    try {
      // 1. 用备用代理列表获取JS内容
      const jsCode = await this.fetchWithFallback(rawUrl);

      // 2. 用iframe沙箱方式执行JS（绕过Safari的安全限制）
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const script = doc.createElement('script');
      script.textContent = jsCode;
      doc.body.appendChild(script);

      // 3. 把脚本里的函数挂载到当前window
      const win = iframe.contentWindow;
      window.getSiteClass = win.getSiteClass;
      window.getSiteVideo = win.getSiteVideo;
      window.getSiteSearch = win.getSiteSearch;
      window.getSitePlay = win.getSitePlay;

      document.body.removeChild(iframe);

      // 4. 校验核心函数是否存在
      if (typeof window.getSiteClass !== 'function') {
        throw new Error("脚本加载成功，但未找到核心函数，可能不是标准CatVod源");
      }
      return true;
    } catch (e) {
      console.error("源加载失败：", e);
      return false;
    }
  },

  async getCategory() {
    if (!window.getSiteClass) return [];
    return await window.getSiteClass();
  },

  async getList(ids, pg = 1) {
    if (!window.getSiteVideo) return [];
    return await window.getSiteVideo(ids, pg);
  },

  async search(key) {
    if (!window.getSiteSearch) return [];
    return await window.getSiteSearch(key);
  },

  async getPlayUrl(id) {
    if (!window.getSitePlay) return null;
    return await window.getSitePlay(id);
  }
};

// 本地源存储
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
