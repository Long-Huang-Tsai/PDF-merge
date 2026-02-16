# PDF Mergery - 現代化 PDF 合併工具

PDF Mergery 是一款基於網頁的純前端工具，讓您可以輕鬆地合併、重新排序、旋轉及篩選 PDF 頁面。所有的處理都在您的瀏覽器中完成，無需上傳到任何伺服器，確保您的隱私安全。

---

## 🇹🇼 繁體中文說明

### 功能介紹
- **拖放上傳**：直接將 PDF 檔案拖入瀏覽器即可開始。
- **頁面排序**：直觀的卡片介面，可自由拖拽調整頁面順序。
- **頁面旋轉**：支援單一頁面 90 度順時針旋轉。
- **頁面篩選**：
    - 點擊頁面下方的 **減號 (-)** 可將該頁排除在輸出之外，排除後顯示為灰色。
    - 點擊 **加號 (+)** 可重新包含該頁。
- **批量操作**：提供「全部不選取」按鈕，一鍵排除所有頁面；排除後可切換為「全部選取」。
- **隱私安全**：使用 `pdf-lib` 與 `pdf.js` 技術，所有操作均在本地端完成。
- **現代化設計**：高品質的毛玻璃質感 (Glassmorphism) UI，支援響應式佈局。

### 下載與安裝
由於本專案為純靜態網頁，您不需要安裝任何環境（如 Node.js 或伺服器）：
1. **直接下載**：點擊 [GitHub 頁面](https://github.com/Long-Huang-Tsai/PDF-merge)（或您的原始碼目錄）中的「Download ZIP」。
2. **解壓縮**：將壓縮檔解壓至您的電腦。
3. **Git Clone**（開發者）：
   ```bash
   git clone https://github.com/Long-Huang-Tsai/PDF-merge.git
   ```

### 使用方式
1. 進入專案資料夾，點兩下 **`index.html`** 即可在瀏覽器中開啟。
2. 將一或多個 PDF 檔案拖入上傳區，或點擊上傳。
3. 在頁面編輯區：
    - **拖拽卡片** 以調整順序。
    - 點擊 **旋轉圖示** 旋轉頁面。
    - 點擊 **(-) 按鈕** 排除不需要的頁面。
    - 使用 **「全部不選取」** 快速清空，再手動勾選需要的頁面。
4. 點擊右上角或下方的 **「合併並下載」** 按鈕，即可獲得處理後的 PDF。

---

## 🇺🇸 English Description

### Features
- **Drag & Drop**: Simply drop your PDF files into the browser to start.
- **Page Reordering**: Intuitive card interface for drag-and-drop page sorting.
- **Page Rotation**: Support for 90-degree clockwise rotation per page.
- **Page Filtering**:
    - Click the **Minus (-)** button to exclude a page (it will turn gray).
    - Click the **Plus (+)** button to re-include it.
- **Bulk Actions**: Includes a "Deselect All" button to exclude all pages at once, which toggles to "Select All".
- **Privacy & Security**: Powered by `pdf-lib` and `pdf.js`. All processing happens locally in your browser.
- **Modern Design**: High-quality Glassmorphism UI with responsive layout support.

### Download & Installation
As this is a static web application, no backend environment (like Node.js or a server) is required:
1. **Download Directly**: Click "Download ZIP" from the [GitHub Repository](https://github.com/Long-Huang-Tsai/PDF-merge).
2. **Extract**: Unzip the files to your computer.
3. **Git Clone** (For Developers):
   ```bash
   git clone https://github.com/Long-Huang-Tsai/PDF-merge.git
   ```

### How to Use
1. Open the project folder and double-click **`index.html`** to launch in your browser.
2. Drag and drop one or more PDF files into the upload area.
3. In the Editor Section:
    - **Drag Cards** to reorder pages.
    - Click the **Rotate Icon** to rotate individual pages.
    - Click the **(-) Button** to exclude unwanted pages.
    - Use the **"Deselect All"** button for quick bulk exclusion.
4. Click the **"Merge and Download"** button to generate the final PDF file.

---

### 技術棧 / Tech Stack
- **HTML5 / Vanilla CSS** (Glassmorphism)
- **Vanilla JavaScript** (ES6+)
- **pdf-lib**: For PDF merging and modification.
- **pdf.js**: For PDF rendering and thumbnail generation.
- **SortableJS**: For drag-and-drop sorting.
- **Lucide Icons**: For modern vector icons.
