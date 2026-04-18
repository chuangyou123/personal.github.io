// 主应用程序 - 调试版本
class PortfolioApp {
    constructor() {
        this.works = [];
        this.gameDescriptions = {};
        this.init();
    }

    async init() {
        console.log('🔧 开始初始化应用...');
        
        // 立即隐藏初始加载动画
        setTimeout(() => {
            const initialLoader = document.getElementById('initial-loader');
            if (initialLoader) {
                console.log('🚀 隐藏初始加载动画');
                initialLoader.style.opacity = '0';
                setTimeout(() => {
                    initialLoader.style.display = 'none';
                }, 300);
            }
            
            // 显示页面内容
            const pageContent = document.querySelector('.page-content');
            if (pageContent) {
                pageContent.classList.add('visible');
            }
        }, 500);
        
        // 先加载游戏数据
        console.log('📁 开始加载游戏描述...');
        await this.loadGameData();
        
        // 然后加载作品
        console.log('🖼️ 开始加载作品图片...');
        await this.loadWorks();
        
        // 初始化事件监听
        this.initEventListeners();
        
        // 隐藏作品加载指示器
        this.hideLoader();
        
        console.log('✅ 应用初始化完成！');
    }

    // 加载游戏描述数据
    async loadGameData() {
        try {
            console.log('📂 尝试加载 text/game.txt ...');
            const response = await fetch('text/game.txt');
            
            if (!response.ok) {
                console.error(`❌ 加载game.txt失败: HTTP ${response.status}`);
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }
            
            const text = await response.text();
            console.log('📄 成功加载game.txt内容:', text);
            this.parseGameDescriptions(text);
            
        } catch (error) {
            console.error('❌ 加载游戏描述失败:', error);
            console.log('⚠️ 使用默认游戏描述...');
            // 使用示例数据作为后备
            this.createExampleGameDescriptions();
        }
    }

    // 解析游戏描述
    parseGameDescriptions(text) {
        console.log('🔍 开始解析游戏描述...');
        
        const lines = text.split('\n');
        console.log(`📊 找到 ${lines.length} 行内容`);
        
        lines.forEach((line, index) => {
            line = line.trim();
            if (line) {
                console.log(`📝 解析第 ${index + 1} 行: "${line}"`);
                
                // 尝试多种分隔符
                let gameName, description;
                
                if (line.includes('：')) {  // 中文冒号
                    const parts = line.split('：');
                    gameName = parts[0].trim();
                    description = parts.slice(1).join('：').trim();
                } else if (line.includes(':')) {  // 英文冒号
                    const parts = line.split(':');
                    gameName = parts[0].trim();
                    description = parts.slice(1).join(':').trim();
                } else {
                    // 如果没有分隔符
                    gameName = line;
                    description = '暂无详细描述';
                }
                
                const id = (index + 1).toString();
                this.gameDescriptions[id] = {
                    name: gameName || `作品 ${id}`,
                    description: description || '暂无详细描述'
                };
                
                console.log(`✅ 解析成功: ID=${id}, 名称="${gameName}", 描述="${description}"`);
            }
        });
        
        console.log('📦 解析完成，结果:', this.gameDescriptions);
        
        // 如果没有解析到任何内容，使用示例数据
        if (Object.keys(this.gameDescriptions).length === 0) {
            console.log('⚠️ 没有解析到任何游戏描述，使用示例数据');
            this.createExampleGameDescriptions();
        }
    }

    // 创建示例游戏描述（用于测试）
    createExampleGameDescriptions() {
        console.log('🎮 创建示例游戏描述...');
        
        const exampleGames = [
            {id: "1", name: "白洞增量", description: "我的第一个增量"},
            {id: "2", name: "作业增量", description: "我的第二个增量，比较火"},
            {id: "3", name: "修仙增量", description: "我的第一个使用大数库的游戏，也是创游一个使用大数库的游戏，灵感来源于Roblox上"},
            {id: "4", name: "植物增量", description: "比较完整的游戏"},
            {id: "5", name: "基本增量", description: "最肝的增量，至今无一人通关"},
            {id: "6", name: "多维体积增量", description: "数值膨胀差的短流程增量游戏"},
            {id: "7", name: "齿轮增量", description: "设计新颖，第二个爆火的游戏"},
            {id: "8", name: "分数增量", description: "我第一个爆火的游戏"}
        ];
        
        exampleGames.forEach(game => {
            this.gameDescriptions[game.id] = {
                name: game.name,
                description: game.description
            };
        });
        
        console.log('📦 示例游戏描述创建完成:', this.gameDescriptions);
    }

    // 加载作品图片
    async loadWorks() {
        const worksContainer = document.getElementById('works-container');
        
        if (!worksContainer) {
            console.error('❌ 找不到作品容器元素!');
            return;
        }

        // 清空容器
        worksContainer.innerHTML = '';
        
        console.log('🖼️ 开始搜索作品图片...');
        
        try {
            // 尝试加载最多20个作品
            const maxWorks = 20;
            let foundCount = 0;
            
            for (let i = 1; i <= maxWorks; i++) {
                const id = i.toString();
                const gameInfo = this.gameDescriptions[id] || {
                    name: `作品 ${id}`,
                    description: '暂无详细描述'
                };
                
                console.log(`🔍 搜索作品 ${id}: ${gameInfo.name}`);
                
                // 检查各种图片格式
                const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
                let imagePath = null;
                
                for (const format of imageFormats) {
                    const testPath = `picture/game/${i}.${format}`;
                    console.log(`  🔎 尝试加载: ${testPath}`);
                    
                    const exists = await this.checkImageExists(testPath);
                    if (exists) {
                        imagePath = testPath;
                        console.log(`  ✅ 找到图片: ${imagePath}`);
                        break;
                    }
                }
                
                if (imagePath) {
                    const work = {
                        id: id,
                        image: imagePath,
                        name: gameInfo.name,
                        description: gameInfo.description
                    };
                    
                    this.works.push(work);
                    this.createWorkElement(work);
                    foundCount++;
                    
                    console.log(`✅ 成功添加作品 ${id}: ${work.name}`);
                } else {
                    console.log(`❌ 作品 ${id} 没有找到图片文件`);
                }
                
                // 如果没有找到图片，尝试使用占位图
                if (!imagePath && gameInfo.name !== `作品 ${id}`) {
                    console.log(`⚠️ 为 ${gameInfo.name} 使用占位图`);
                    const work = {
                        id: id,
                        image: this.getPlaceholderImage(id),
                        name: gameInfo.name,
                        description: gameInfo.description
                    };
                    
                    this.works.push(work);
                    this.createWorkElement(work, true); // 使用占位图
                    foundCount++;
                }
            }
            
            console.log(`📊 总共找到 ${foundCount} 个作品`);
            
            if (this.works.length === 0) {
                console.log('⚠️ 没有找到任何作品，显示无作品信息');
                this.showNoWorksMessage();
            } else {
                console.log(`🎉 成功显示 ${this.works.length} 个作品`);
            }
            
        } catch (error) {
            console.error('❌ 加载作品时出错:', error);
            this.showError(`加载作品时出错: ${error.message}`);
        }
    }

    // 获取占位图片
    getPlaceholderImage(id) {
        const colors = ['#6a11cb', '#2575fc', '#00b4db', '#f46b45', '#eea849', '#0575E6', '#00F260'];
        const color = colors[(parseInt(id) - 1) % colors.length];
        
        // 创建一个SVG占位图
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${color}"/>
                <rect x="20" y="20" width="360" height="260" fill="rgba(255,255,255,0.1)" rx="10"/>
                <text x="200" y="120" font-family="Arial, sans-serif" font-size="24" 
                      font-weight="bold" fill="white" text-anchor="middle">作品 ${id}</text>
                <text x="200" y="160" font-family="Arial, sans-serif" font-size="16" 
                      fill="rgba(255,255,255,0.8)" text-anchor="middle">${this.gameDescriptions[id]?.name || '游戏图片'}</text>
                <rect x="150" y="180" width="100" height="100" fill="rgba(255,255,255,0.2)" rx="10"/>
                <path d="M180,210 L220,210 M180,230 L220,230 M180,250 L220,250" 
                      stroke="white" stroke-width="2" stroke-linecap="round"/>
                <text x="200" y="280" font-family="Arial, sans-serif" font-size="12" 
                      fill="rgba(255,255,255,0.6)" text-anchor="middle">点击查看详情</text>
            </svg>
        `)}`;
    }

    // 检查图片是否存在
    async checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                console.log(`  ✅ 图片存在: ${url}`);
                resolve(true);
            };
            img.onerror = () => {
                console.log(`  ❌ 图片不存在: ${url}`);
                resolve(false);
            };
            img.src = url;
            
            // 设置超时
            setTimeout(() => {
                if (!img.complete) {
                    console.log(`  ⏰ 图片加载超时: ${url}`);
                    resolve(false);
                }
            }, 1000);
        });
    }

    // 创建作品元素
    createWorkElement(work, isPlaceholder = false) {
        const worksContainer = document.getElementById('works-container');
        
        if (!worksContainer) {
            console.error('❌ 找不到作品容器!');
            return;
        }
        
        const workElement = document.createElement('div');
        workElement.className = 'work-item';
        workElement.dataset.id = work.id;
        
        console.log(`🎨 创建作品元素 ${work.id}: ${work.name}`);
        
        workElement.innerHTML = `
            <div class="work-image-container">
                <img src="${work.image}" 
                     alt="${work.name}" 
                     class="work-image ${isPlaceholder ? 'placeholder-image' : ''}"
                     onload="console.log('✅ 图片加载完成: ${work.name}')"
                     onerror="console.error('❌ 图片加载失败: ${work.name}'); this.src='${this.getPlaceholderImage(work.id)}'">
            </div>
            <div class="work-info">
                <h3 class="work-title">
                    <span class="work-number">#${work.id}</span>
                    ${work.name}
                </h3>
                <p class="work-description">${work.description}</p>
            </div>
        `;
        
        // 添加点击事件打开模态框
        workElement.addEventListener('click', () => this.openModal(work));
        
        // 添加鼠标悬停效果
        const description = workElement.querySelector('.work-description');
        if (description) {
            description.addEventListener('mouseenter', () => {
                this.animateTextSplit(description);
            });
        }
        
        worksContainer.appendChild(workElement);
        console.log(`✅ 作品元素 ${work.id} 已添加到页面`);
    }

    // 文字分开动画
    animateTextSplit(element) {
        const originalText = element.textContent;
        element.style.overflow = 'hidden';
        element.style.position = 'relative';
        
        // 使用CSS动画
        element.classList.add('text-animating');
        
        setTimeout(() => {
            element.classList.remove('text-animating');
        }, 600);
    }

    // 打开图片模态框
    openModal(work) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        
        console.log(`🖼️ 打开模态框: ${work.name}`);
        
        modalImage.src = work.image;
        modalImage.alt = work.name;
        modalTitle.textContent = work.name;
        modalDescription.textContent = work.description;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // 添加淡入效果
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    // 关闭模态框
    closeModal() {
        const modal = document.getElementById('imageModal');
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // 初始化事件监听
    initEventListeners() {
        console.log('🔌 初始化事件监听...');
        
        // 模态框关闭按钮
        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
            console.log('✅ 模态框关闭按钮事件已绑定');
        }
        
        // 点击模态框背景关闭
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
            console.log('✅ 模态框背景点击事件已绑定');
        }
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        console.log('✅ ESC键事件已绑定');
        
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        console.log('✅ 平滑滚动事件已绑定');
        
        console.log('✅ 所有事件监听已初始化');
    }

    // 隐藏加载指示器
    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
            console.log('👋 隐藏加载指示器');
        }
    }

    // 显示错误信息
    showError(message) {
        const worksContainer = document.getElementById('works-container');
        if (!worksContainer) {
            console.error('❌ 无法显示错误信息: 找不到作品容器');
            return;
        }
        
        worksContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>加载失败</h3>
                <p>${message}</p>
                <div class="debug-info">
                    <h4>调试信息：</h4>
                    <p>当前URL: ${window.location.href}</p>
                    <p>文件结构:</p>
                    <ul>
                        <li><code>${window.location.href}text/game.txt</code></li>
                        <li><code>${window.location.href}picture/game/1.png</code></li>
                    </ul>
                    <button onclick="window.location.reload()" class="retry-button">
                        <i class="fas fa-redo"></i> 重新加载
                    </button>
                </div>
            </div>
        `;
        
        this.hideLoader();
    }

    // 显示无作品信息
    showNoWorksMessage() {
        const worksContainer = document.getElementById('works-container');
        if (!worksContainer) return;
        
        worksContainer.innerHTML = `
            <div class="no-works-message">
                <i class="fas fa-gamepad"></i>
                <h3>暂无作品展示</h3>
                <p>已解析的游戏描述：</p>
                <div class="parsed-games">
                    ${Object.entries(this.gameDescriptions).map(([id, game]) => `
                        <div class="parsed-game">
                            <strong>#${id} ${game.name}</strong>: ${game.description}
                        </div>
                    `).join('')}
                </div>
                <p>请按以下步骤操作：</p>
                <ol>
                    <li>在 <code>picture/game/</code> 文件夹中添加您的作品图片</li>
                    <li>图片文件应命名为: 1.png, 2.png, 3.png 等</li>
                    <li>在 <code>text/game.txt</code> 中添加作品描述</li>
                    <li>描述格式: 游戏名称：简介 (每行一个作品)</li>
                </ol>
                <button onclick="window.location.reload()" class="retry-button">
                    <i class="fas fa-sync"></i> 重新检测作品
                </button>
            </div>
        `;
        
        this.hideLoader();
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM已加载完成，开始初始化应用...');
    console.log('🔧 网站版本: 调试版 1.0');
    console.log('🔍 按F12打开控制台查看详细信息');
    
    // 立即初始化应用
    const app = new PortfolioApp();
    
    // 暴露全局变量以便调试
    window.portfolioApp = app;
    
    // 添加控制台欢迎信息
    console.log('%c🎮 Winster 的个人主页已加载！', 'color: #6a11cb; font-size: 16px; font-weight: bold;');
    console.log('%c✨ 用代码创造无限可能', 'color: #2575fc; font-size: 14px;');
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .text-animating {
            animation: textSplit 0.6s ease;
        }
        
        @keyframes textSplit {
            0% { letter-spacing: normal; }
            50% { letter-spacing: 3px; opacity: 0.8; }
            100% { letter-spacing: 2px; opacity: 1; }
        }
        
        .retry-button {
            margin-top: 20px;
            padding: 10px 20px;
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(106, 17, 203, 0.3);
        }
        
        .debug-info {
            margin-top: 20px;
            padding: 15px;
            background: rgba(106, 17, 203, 0.05);
            border-radius: 10px;
            text-align: left;
        }
        
        .debug-info ul {
            margin: 10px 0 0 20px;
        }
        
        .parsed-games {
            text-align: left;
            max-width: 600px;
            margin: 20px auto;
            padding: 15px;
            background: rgba(106, 17, 203, 0.05);
            border-radius: 10px;
        }
        
        .parsed-game {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #6a11cb;
        }
        
        code {
            background: rgba(106, 17, 203, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        .placeholder-image {
            filter: brightness(1.2);
        }
        
        .no-works-message ol {
            text-align: left;
            display: inline-block;
            margin: 20px 0;
        }
        
        .no-works-message li {
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ 所有初始化完成！');
});