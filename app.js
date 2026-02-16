const { PDFDocument, degrees } = PDFLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// 狀態管理
let pages = []; // { id, data, pageNum, rotation, originalPdfIndex }
let originalPdfs = []; // 存儲原始 PDF 的 ArrayBuffer

// DOM 元素
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const pagesGrid = document.getElementById('pages-grid');
const editorSection = document.getElementById('editor-section');
const mergeBtns = document.querySelectorAll('.btn-merge-top, .btn-merge-bottom');
const loadingOverlay = document.getElementById('loading');

// 初始化 Lucide 圖標
lucide.createIcons();

// 初始化 SortableJS
const sortable = new Sortable(pagesGrid, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: () => {
        // 更新 pages 數組順序
        const newOrder = Array.from(pagesGrid.children).map(el => el.dataset.id);
        pages = newOrder.map(id => pages.find(p => p.id === id));
    }
});

// 事件監聽
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

['dragleave', 'drop'].forEach(event => {
    dropZone.addEventListener(event, () => dropZone.classList.remove('drag-over'));
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (files.length > 0) processFiles(files);
});

mergeBtns.forEach(btn => btn.addEventListener('click', mergePDFs));

async function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) await processFiles(files);
    fileInput.value = ''; // 清空以允許重複上傳
}

async function processFiles(files) {
    showLoading(true);

    for (const file of files) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            // 使用 Uint8Array 以確保在不同函式庫間傳遞的相容性
            const uint8Array = new Uint8Array(arrayBuffer);
            const pdfIndex = originalPdfs.length;
            originalPdfs.push(uint8Array);

            // 重要：傳遞 slice(0) 複製品給 pdf.js，防止其 Worker 轉移 (Detach) 原始緩衝區
            const pdf = await pdfjsLib.getDocument({ data: uint8Array.slice(0) }).promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                // 提高預覽圖品質與比例
                const viewport = page.getViewport({ scale: 0.8 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                const id = Math.random().toString(36).substr(2, 9);
                const pageData = {
                    id: id,
                    preview: canvas.toDataURL('image/jpeg', 0.8), // 使用 JPEG 減少記憶體佔用
                    pageNum: i,
                    rotation: 0,
                    originalPdfIndex: pdfIndex
                };

                pages.push(pageData);
                renderPageCard(pageData);
            }
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert(`處理檔案 ${file.name} 時發生錯誤：${error.message}`);
        }
    }

    if (pages.length > 0) {
        editorSection.classList.remove('hidden');
        updateMergeButtons(true);
    }

    showLoading(false);
}

function renderPageCard(pageData) {
    const card = document.createElement('div');
    card.className = 'page-card';
    card.dataset.id = pageData.id;
    card.innerHTML = `
        <div class="preview-container">
            <img src="${pageData.preview}" class="preview-img" style="transform: rotate(0deg)">
        </div>
        <div class="page-info">
            <span class="page-number">頁面</span>
            <button class="rotate-btn" title="順時針旋轉 90 度">
                <i data-lucide="rotate-cw"></i>
            </button>
        </div>
    `;

    const rotateBtn = card.querySelector('.rotate-btn');
    rotateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        rotatePage(pageData.id, card);
    });

    pagesGrid.appendChild(card);
    lucide.createIcons();
    updatePageNumbers();
}

function rotatePage(id, card) {
    const page = pages.find(p => p.id === id);
    page.rotation = (page.rotation + 90) % 360;

    const img = card.querySelector('.preview-img');
    img.style.transform = `rotate(${page.rotation}deg)`;
}

function updatePageNumbers() {
    const cards = pagesGrid.querySelectorAll('.page-card');
    cards.forEach((card, index) => {
        card.querySelector('.page-number').textContent = `頁面 ${index + 1}`;
    });
}

function updateMergeButtons(enabled) {
    mergeBtns.forEach(btn => btn.disabled = !enabled);
}

function showLoading(show) {
    loadingOverlay.classList.toggle('hidden', !show);
}

async function mergePDFs() {
    if (pages.length === 0) return;

    showLoading(true);
    console.log('開始合併 PDF，當前頁面數:', pages.length);

    try {
        const mergedPdf = await PDFDocument.create();
        const pdfDocCache = new Map(); // 緩存已加載的 PDFDocument 物件

        for (const item of pages) {
            let originalPdfDoc = pdfDocCache.get(item.originalPdfIndex);

            if (!originalPdfDoc) {
                const buffer = originalPdfs[item.originalPdfIndex];
                console.log(`正在加載原始 PDF 索引: ${item.originalPdfIndex}, 緩衝區長度: ${buffer ? buffer.length : 'undefined'}`);

                if (!buffer || buffer.length === 0) {
                    throw new Error(`檔案索引 ${item.originalPdfIndex} 的資料已損壞或長度為 0 (可能被系統回收)`);
                }

                // 加入 ignoreEncryption 增加相容性
                originalPdfDoc = await PDFDocument.load(buffer, {
                    ignoreEncryption: true
                });
                pdfDocCache.set(item.originalPdfIndex, originalPdfDoc);
            }

            console.log(`複製頁面: 來源 PDF ${item.originalPdfIndex}, 頁碼 ${item.pageNum}`);
            const [copiedPage] = await mergedPdf.copyPages(originalPdfDoc, [item.pageNum - 1]);

            if (item.rotation !== 0) {
                // 注意：pdf-lib 的旋轉是根據原有旋轉疊加
                // 這裡我們直接設定絕對角度
                copiedPage.setRotation(degrees(item.rotation));
            }

            mergedPdf.addPage(copiedPage);
        }

        console.log('正在產生 PDF 位元組...');
        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `merged_${new Date().getTime()}.pdf`;
        link.click();

        console.log('合併成功');
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
        console.error('合併過程中發生錯誤:', error);
        alert(`合併失敗：${error.message}\n請檢查 Console 取得詳細資訊。`);
    }
    showLoading(false);
}
