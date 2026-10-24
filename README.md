# Todo List

**繁體中文** | [English](README.en.md)

一頁式的待辦清單，給想花幾秒記下一件雜事、順便看看什麼快到期的人。把一個元件放進你的 Next.js app，就有一份適合手機使用、會倒數每個期限的清單。

![待辦清單：三個未完成事項各自顯示剩餘天數，下方是 Recently Completed 區塊](./public/intro1.png)

- **快速新增**：圓形 **+** 按鈕會打開一個只有事項和期限兩個欄位的表單，期限預設為今天起算 7 天後。
- **期限倒數**：每個事項顯示「剩 N 天」、「今天到期」或「已過期 N 天」，而不是直接顯示日期。
- **可以反悔**：勾選完成的事項會在 Recently Completed 底下保留 24 小時，這段時間內取消勾選就會回到清單。
- **資料留在你的裝置**：事項存在瀏覽器的 `localStorage`，不用帳號、不用資料庫，也不會發出任何網路請求。

<p>
  <img src="./public/intro2.png" alt="手機版的待辦清單" width="24%">
  <img src="./public/intro3.png" alt="手機版的 Add New Task 表單，附日期選擇器" width="24%">
</p>

介面文字是繁體中文（例如「剩 6 天」）；想改的話，編輯 `TodoApp.jsx` 裡的字串。

## 它怎麼運作

```
瀏覽器 (TodoApp.jsx) ──► localStorage
```

沒有伺服器程式碼，也沒有其他服務。每個瀏覽器各自保存一份清單：事項不會在裝置之間同步，清除網站資料就會刪掉它們。

## 安裝

需要：一個使用 App Router、裝了 Tailwind CSS 的 Next.js app。

1. 安裝圖示套件：`npm install lucide-react`
2. 把 `TodoApp.jsx` 複製進你的 app，在某個頁面渲染它，例如在 `app/todo/page.js` 寫 `import TodoApp from './TodoApp'`。

## 隱私與安全

事項內容和日期不會離開瀏覽器：元件不發出任何網路請求，也沒有任何分析追蹤。使用同一個瀏覽器設定檔的人都看得到這份清單。

## 授權

[MIT](LICENSE)
