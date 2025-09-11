import fs from 'fs';
import path from 'path';

// --- 設定 ---
// 來源：包含舊 HTML 檔案的資料夾
const tempDir = 'temp_plant_pages';
// 目標：存放新 Astro 頁面的資料夾
const pagesDir = path.join('src', 'pages', 'plants');

/**
 * 根據舊的 HTML 內容和標題，建立新的 Astro 頁面內容。
 * @param {string} title - 頁面的標題。
 * @param {string} oldContent - 舊的 HTML 檔案內容。
 * @param {string} sourcePath - 來源檔案路徑，用於日誌記錄。
 * @returns {string | null} - 格式化後的 Astro 內容，如果無法提取 body，則返回 null。
 */
const createPageContent = (title, oldContent, sourcePath) => {
    // 使用正則表達式提取 <body> 標籤內的內容
    const bodyContentMatch = oldContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);

    if (!bodyContentMatch || !bodyContentMatch[1]) {
        console.warn(`⚠️  警告：在檔案 ${sourcePath} 中找不到 <body> 內容，已跳過此檔案。`);
        return null; // 如果找不到 body，返回 null
    }

    const extractedContent = bodyContentMatch[1].trim();

    // 返回 Astro 頁面的完整內容模板
    return `---
import BaseLayout from '../../../../layouts/BaseLayout.astro';
---
<BaseLayout title="${title}">
${extractedContent}
</BaseLayout>
`;
};

/**
 * 主執行函式
 */
const main = () => {
    console.log('🚀 開始執行 Astro 頁面轉換腳本...');

    // 檢查來源資料夾是否存在
    if (!fs.existsSync(tempDir)) {
        console.error(`❌ 錯誤：來源資料夾 '${tempDir}' 不存在。`);
        return; // 終止執行
    }
    
    // 確保目標資料夾存在，如果不存在則建立
    fs.mkdirSync(pagesDir, { recursive: true });
    
    // 讀取來源資料夾中的所有子資料夾
    const plantFolders = fs.readdirSync(tempDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    if (plantFolders.length === 0) {
        console.log('📂 在來源資料夾中沒有找到任何植物資料夾。');
        return;
    }

    console.log(`🔍 找到 ${plantFolders.length} 個植物資料夾，開始建立 Astro 頁面...`);

    let successCount = 0;
    let failCount = 0;

    for (const folder of plantFolders) {
        try {
            const oldHtmlPath = path.join(tempDir, folder, 'index.html');
            const newAstroDir = path.join(pagesDir, folder);
            const newAstroPath = path.join(newAstroDir, 'index.astro');

            if (fs.existsSync(oldHtmlPath)) {
                // 讀取舊 HTML 檔案
                const oldContent = fs.readFileSync(oldHtmlPath, 'utf-8');
                
                // 建立頁面標題
                const title = `${folder} 養護紀錄 - 植物養護紀錄`;
                
                // 產生新的 Astro 頁面內容
                const newContent = createPageContent(title, oldContent, oldHtmlPath);

                if (newContent) {
                    // 確保每個植物的目標資料夾都存在
                    fs.mkdirSync(newAstroDir, { recursive: true });
                    // 寫入新的 Astro 檔案
                    fs.writeFileSync(newAstroPath, newContent, 'utf-8');
                    console.log(`✅ 已成功建立: ${newAstroPath}`);
                    successCount++;
                } else {
                    failCount++;
                }

            } else {
                console.warn(`-  跳過：在資料夾 ${folder} 中找不到 index.html。`);
            }
        } catch (error) {
            console.error(`❌ 處理資料夾 ${folder} 時發生錯誤:`, error.message);
            failCount++;
        }
    }

    console.log('\n✨ 處理完成！');
    console.log(`- 成功建立 ${successCount} 個頁面。`);
    if (failCount > 0) {
        console.log(`- 失敗或跳過 ${failCount} 個檔案。`);
    }
};

// --- 執行腳本 ---
// 在終端機中，執行 `node create_plant_pages.mjs`。
main();

