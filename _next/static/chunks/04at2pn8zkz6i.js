(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,93819,93582,e=>{"use strict";var t=e.i(56420);let a={name:"file-spreadsheet",size:24,node:[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]};a.node;let r=(0,t.default)(a);e.s(["FileSpreadsheet",0,r],93819);var s=e.i(43476),n=e.i(32098),o=e.i(99847);e.s(["ConfirmDialog",0,function({isOpen:e,onClose:t,onConfirm:a,title:r,description:i,confirmText:l="Onayla",cancelText:d="İptal",isDanger:c=!1}){return(0,s.jsx)(n.Modal,{isOpen:e,onClose:t,title:r,maxWidth:"sm",children:(0,s.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,s.jsxs)("div",{className:"flex items-start gap-3",children:[(0,s.jsx)("div",{className:`p-2.5 rounded-xl shrink-0 ${c?"bg-rose-500/10 text-rose-500":"bg-indigo-500/10 text-indigo-500"}`,children:(0,s.jsx)(o.AlertCircle,{className:"w-6 h-6"})}),(0,s.jsx)("p",{className:"text-sm text-slate-300 leading-relaxed pt-1",children:i})]}),(0,s.jsxs)("div",{className:"flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-800",children:[(0,s.jsx)("button",{type:"button",onClick:t,className:"px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors",children:d}),(0,s.jsx)("button",{type:"button",onClick:()=>{a(),t()},className:`px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all shadow-lg ${c?"bg-rose-600 hover:bg-rose-500 shadow-rose-600/20":"bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"}`,children:l})]})]})})}],93582)},59659,e=>{"use strict";var t=e.i(56420);let a={name:"trash",size:24,node:[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],aliases:["trash-2"]};a.node;let r=(0,t.default)(a);e.s(["Trash2",0,r],59659)},13399,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(56420);let s={name:"download",size:24,node:[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]};s.node;let n=(0,r.default)(s),o={name:"upload",size:24,node:[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]};o.node;let i=(0,r.default)(o);var l=e.i(59659);let d={name:"printer",size:24,node:[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]};d.node;let c=(0,r.default)(d);var m=e.i(93819),h=e.i(26091);let x={name:"globe",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]};x.node;let p=(0,r.default)(x);var u=e.i(69152);async function g(e){try{let t=JSON.parse(e);if(!t||"object"!=typeof t)return{success:!1,importedTransactions:0,importedCategories:0,message:"Geçersiz JSON dosyası."};let a=[],r=[],s={};if(Array.isArray(t.categories)&&Array.isArray(t.transactions))a=t.categories,r=t.transactions,t.categoryColors&&"object"==typeof t.categoryColors&&(s=t.categoryColors);else{if(!(2===t.version&&Array.isArray(t.transactions)))return{success:!1,importedTransactions:0,importedCategories:0,message:"JSON formatı FinanceTracker yedek yapısıyla uyuşmuyor."};r=t.transactions,a=Array.isArray(t.categories)?t.categories:[]}let n=[];if(a.length>0)for(let e of a)"string"==typeof e?n.push({name:e,color:s[e]||"#3b82f6",isDefault:!1}):e&&"object"==typeof e&&e.name&&n.push({name:String(e.name),color:e.color||"#3b82f6",icon:e.icon,isDefault:!!e.isDefault});let o=[];for(let e of r){if(!e||"object"!=typeof e)continue;let t=Number(e.amount);if(isNaN(t)||t<=0)continue;let a=e.date?String(e.date).slice(0,10):new Date().toISOString().slice(0,10),r=a.slice(0,7),s="income"===e.type?"income":"expense",n=e.category?String(e.category):"Diğer",i=e.description?String(e.description):"income"===s?"Gelir":"Gider",l="number"==typeof e.createdAt?e.createdAt:"number"==typeof e.id?e.id:Date.now();o.push({type:s,amount:t,category:n,date:a,yearMonth:r,description:i,createdAt:l})}return await u.db.transaction("rw",u.db.categories,u.db.transactions,async()=>{for(let e of n)await u.db.categories.where("name").equals(e.name).first()||await u.db.categories.add(e);o.length>0&&await u.db.transactions.bulkAdd(o)}),{success:!0,importedTransactions:o.length,importedCategories:n.length,message:`${o.length} işlem ve ${n.length} kategori başarıyla y\xfcklendi.`}}catch(e){return{success:!1,importedTransactions:0,importedCategories:0,message:`Yedek y\xfcklenirken hata oluştu: ${e?.message||"Bilinmeyen hata"}`}}}var f=e.i(75157),y=e.i(93582),b=e.i(88840),v=e.i(83773);function w({onRefresh:e}){let{toast:r}=(0,b.useToast)(),{t:s,language:o,setLanguage:d}=(0,v.useLanguage)(),x=(0,a.useRef)(null),[j,k]=(0,a.useState)(!1),[N,D]=(0,a.useState)(!1),[T,$]=(0,a.useState)(!1),C=async()=>{D(!0);try{let e=await (0,u.exportDatabaseBackup)(),t=new Date().toISOString().slice(0,10);(0,f.downloadFile)(e,`financetracker_backup_${t}.json`,"application/json"),r("tr"===o?"🧰 Tam veritabanı yedeği başarıyla indirildi.":"🧰 Full database backup downloaded.","success")}catch(e){r(`Yedekleme hatası: ${e?.message||"Bilinmiyor"}`,"error")}finally{D(!1)}},F=async t=>{let a=t.target.files?.[0];if(!a)return;$(!0);let s=new FileReader;s.onload=async t=>{let a=t.target?.result,s=await g(a);s.success?(r(`♻️ ${s.message}`,"success"),e()):r(s.message,"error"),$(!1),x.current&&(x.current.value="")},s.onerror=()=>{r("tr"===o?"Dosya okunamadı.":"Could not read file.","error"),$(!1),x.current&&(x.current.value="")},s.readAsText(a)},S=async()=>{try{let e=await u.db.transactions.toArray();if(0===e.length)return void r(s("transactions.noExportData"),"warning");(0,f.exportTransactionsToExcel)(e,"all_transactions_table.xls"),r(s("transactions.excelDownloaded"),"success")}catch(e){r("Excel export error","error")}},E=async()=>{try{let e=await u.db.transactions.toArray();if(0===e.length)return void r(s("transactions.noExportData"),"warning");(0,f.exportTransactionsToCSV)(e,"all_transactions.csv"),r(s("transactions.csvDownloaded"),"success")}catch(e){r("CSV export error","error")}},A=async()=>{try{let e=await u.db.transactions.toArray();if(0===e.length)return void r(s("transactions.noExportData"),"warning");let t=e.filter(e=>"income"===e.type).reduce((e,t)=>e+t.amount,0),a=e.filter(e=>"expense"===e.type).reduce((e,t)=>e+t.amount,0),n=t-a,i=window.open("","_blank");if(!i)return void r("tr"===o?"Açılır pencere engellendi.":"Pop-up blocked.","warning");let l=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>FinanceTracker - Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; color: #1e293b; }
            h1 { color: #4338ca; margin-bottom: 4px; }
            .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
            .summary-box { background: #f1f5f9; border-radius: 12px; padding: 20px; display: flex; gap: 32px; margin-bottom: 28px; }
            .summary-item div:first-child { font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; }
            .summary-item div:last-child { font-size: 22px; font-weight: 800; margin-top: 4px; }
            .income { color: #16a34a; }
            .expense { color: #e11d48; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th { background: #4338ca; color: white; text-align: left; padding: 10px 12px; border: 1px solid #4338ca; }
            td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>FinanceTracker PRO</h1>
          <div class="subtitle">${"tr"===o?"Finansal Döküm Raporu":"Financial Statement Report"} • ${new Date().toLocaleDateString("tr"===o?"tr-TR":"en-US")}</div>
          <div class="summary-box">
            <div class="summary-item">
              <div>${"tr"===o?"Toplam Gelir":"Total Income"}</div>
              <div class="income">${(0,f.formatCurrency)(t)}</div>
            </div>
            <div class="summary-item">
              <div>${"tr"===o?"Toplam Gider":"Total Expenses"}</div>
              <div class="expense">${(0,f.formatCurrency)(a)}</div>
            </div>
            <div class="summary-item">
              <div>${"tr"===o?"Net Bakiye":"Net Balance"}</div>
              <div style="color: ${n>=0?"#16a34a":"#e11d48"}">${(0,f.formatCurrency)(n)}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>${"tr"===o?"Tarih":"Date"}</th>
                <th>${"tr"===o?"Tür":"Type"}</th>
                <th>${"tr"===o?"Kategori":"Category"}</th>
                <th>${"tr"===o?"Açıklama":"Description"}</th>
                <th style="text-align: right;">${"tr"===o?"Tutar":"Amount"}</th>
              </tr>
            </thead>
            <tbody>
              ${e.map(e=>`
                <tr>
                  <td>${e.date}</td>
                  <td>${"income"===e.type?"tr"===o?"Gelir":"Income":"tr"===o?"Gider":"Expense"}</td>
                  <td>${e.category}</td>
                  <td>${e.description}</td>
                  <td style="text-align: right; font-weight: bold; color: ${"income"===e.type?"#16a34a":"#e11d48"}">
                    ${"income"===e.type?"+":"-"}${(0,f.formatCurrency)(e.amount)}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;i.document.write(l),i.document.close(),i.focus(),setTimeout(()=>{i.print()},250)}catch(e){r("Error generating report","error")}},M=async()=>{try{await (0,u.hardResetDatabase)(),r(s("settings.resetSuccess"),"success"),e()}catch(e){r(`Reset error: ${e?.message||"Bilinmiyor"}`,"error")}};return(0,t.jsxs)("div",{className:"flex flex-col gap-6 max-w-4xl mx-auto",children:[(0,t.jsxs)("div",{className:"p-5 sm:p-6 rounded-2xl theme-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-500/20",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center",children:(0,t.jsx)(p,{className:"w-5 h-5"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-base font-bold theme-text",children:"tr"===o?"Uygulama Dili / Language":"Application Language"}),(0,t.jsx)("p",{className:"text-xs theme-muted",children:"tr"===o?"Tüm menüler, grafikler, tablolar ve raporlar için aktif dil.":"Active language for all menus, charts, tables, and reports."})]})]}),(0,t.jsxs)("div",{className:"flex items-center p-1 rounded-xl theme-sub-card border theme-border self-start sm:self-auto",children:[(0,t.jsxs)("button",{onClick:()=>d("tr"),className:`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${"tr"===o?"bg-indigo-600 text-white shadow-md shadow-indigo-600/30":"theme-muted hover:opacity-100"}`,children:[(0,t.jsx)("span",{children:"🇹🇷"}),(0,t.jsx)("span",{children:"Türkçe"})]}),(0,t.jsxs)("button",{onClick:()=>d("en"),className:`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${"en"===o?"bg-indigo-600 text-white shadow-md shadow-indigo-600/30":"theme-muted hover:opacity-100"}`,children:[(0,t.jsx)("span",{children:"🇬🇧"}),(0,t.jsx)("span",{children:"English"})]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"flex flex-col justify-between p-6 rounded-2xl theme-card shadow-sm",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4",children:(0,t.jsx)(n,{className:"w-6 h-6"})}),(0,t.jsx)("h3",{className:"text-lg font-bold theme-text",children:s("settings.downloadJsonBtn")}),(0,t.jsx)("p",{className:"text-xs theme-muted mt-1.5 leading-relaxed",children:s("settings.downloadJsonSub")})]}),(0,t.jsxs)("button",{onClick:C,disabled:N,className:"mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer",children:[(0,t.jsx)(n,{className:"w-4 h-4 stroke-[2.5]"}),(0,t.jsx)("span",{children:N?s("modal.saving"):s("settings.downloadJsonBtn")})]})]}),(0,t.jsxs)("div",{className:"flex flex-col justify-between p-6 rounded-2xl theme-card shadow-sm",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4",children:(0,t.jsx)(i,{className:"w-6 h-6"})}),(0,t.jsx)("h3",{className:"text-lg font-bold theme-text",children:s("settings.restoreCardTitle")}),(0,t.jsx)("p",{className:"text-xs theme-muted mt-1.5 leading-relaxed",children:s("settings.restoreCardSub")})]}),(0,t.jsxs)("label",{className:"mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer",children:[(0,t.jsx)(i,{className:"w-4 h-4 stroke-[2.5]"}),(0,t.jsx)("span",{children:T?s("modal.saving"):"tr"===o?"Yedek Dosyası Seç":"Choose Backup File"}),(0,t.jsx)("input",{ref:x,type:"file",accept:".json",onChange:F,className:"hidden"})]})]})]}),(0,t.jsxs)("div",{className:"p-6 rounded-2xl theme-card shadow-sm flex flex-col gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-base font-bold theme-text",children:"tr"===o?"Raporlama ve Tablo Dışa Aktarma":"Reporting & Table Exports"}),(0,t.jsx)("p",{className:"text-xs theme-muted mt-0.5",children:"tr"===o?"Excel tablosu (.xls), virgülle ayrılmış veri (.csv) veya yazdırılabilir PDF raporları oluşturun.":"Generate styled Excel (.xls), CSV, or printable financial summary reports."})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",children:[(0,t.jsxs)("button",{onClick:S,className:"flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border active:scale-95 transition-all cursor-pointer",children:[(0,t.jsx)(m.FileSpreadsheet,{className:"w-4 h-4 text-emerald-500"}),(0,t.jsx)("span",{children:"Excel (.xls)"})]}),(0,t.jsxs)("button",{onClick:E,className:"flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border active:scale-95 transition-all cursor-pointer",children:[(0,t.jsx)(h.FileText,{className:"w-4 h-4 text-indigo-500"}),(0,t.jsx)("span",{children:"CSV"})]}),(0,t.jsxs)("button",{onClick:A,className:"flex items-center justify-center gap-2 p-3 rounded-xl theme-sub-card hover:opacity-80 theme-text text-xs font-semibold border theme-border active:scale-95 transition-all cursor-pointer",children:[(0,t.jsx)(c,{className:"w-4 h-4 text-amber-500"}),(0,t.jsx)("span",{children:"tr"===o?"Yazdır / PDF Rapor":"Print / PDF"})]}),(0,t.jsxs)("button",{onClick:()=>k(!0),className:"flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/30 active:scale-95 transition-all cursor-pointer",children:[(0,t.jsx)(l.Trash2,{className:"w-4 h-4 text-rose-500"}),(0,t.jsx)("span",{children:s("settings.resetBtn")})]})]})]}),(0,t.jsx)(y.ConfirmDialog,{isOpen:j,onClose:()=>k(!1),onConfirm:M,title:s("settings.resetConfirmTitle"),description:s("settings.resetConfirmDesc"),confirmText:s("transactions.confirmDelete"),isDanger:!0})]})}var j=e.i(56231),k=e.i(66794);e.s(["default",0,function(){let{triggerRefresh:e}=(0,j.useGlobalModal)(),{t:a}=(0,v.useLanguage)();return(0,t.jsxs)("div",{className:"flex flex-col gap-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-2xl sm:text-3xl font-extrabold theme-text tracking-tight flex items-center gap-2",children:[(0,t.jsx)(k.Settings,{className:"w-6 h-6 text-indigo-500"}),(0,t.jsx)("span",{children:a("settings.title")})]}),(0,t.jsx)("p",{className:"text-xs sm:text-sm theme-muted mt-1",children:a("settings.subtitle")})]}),(0,t.jsx)(w,{onRefresh:e})]})}],13399)},75157,e=>{"use strict";function t(e){return e?"en"===e?"en-US":"tr-TR":"en"===(localStorage.getItem("finance_tracker_lang")||document.documentElement.lang)?"en-US":"tr-TR"}function a(e,a){if(!e)return"";let r=new Date(e),s=a||t();return new Intl.DateTimeFormat(s,{day:"numeric",month:"long",year:"numeric"}).format(r)}function r(e,t,a){let r=new Blob([e],{type:a}),s=URL.createObjectURL(r),n=document.createElement("a");n.href=s,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(s)}e.s(["downloadFile",0,r,"exportTransactionsToCSV",0,function(e,t="gelir-gider-raporu.csv"){r("\uFEFF"+["sep=;","Tarih;İşlem Türü;Kategori;Açıklama;Tutar (TL);Net Bakiye Etkisi (TL)",...e.map(e=>{let t=e.amount.toFixed(2).replace(".",","),a=("income"===e.type?"+":"-")+t;return[e.date,"income"===e.type?"Gelir":"Gider",e.category,`"${(e.description||"").replace(/"/g,'""')}"`,t,a]}).map(e=>e.join(";"))].join("\r\n"),t,"text/csv;charset=utf-8;")},"exportTransactionsToExcel",0,function(e,t="gelir-gider-tablosu.xls"){let a=e.filter(e=>"income"===e.type).reduce((e,t)=>e+t.amount,0),s=e.filter(e=>"expense"===e.type).reduce((e,t)=>e+t.amount,0),n=a-s;r(`
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>İşlemler</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Calibri, sans-serif; font-size: 11pt; }
        th { background-color: #4F46E5; color: #FFFFFF; font-weight: bold; border: 1px solid #3730A3; padding: 10px; text-align: left; }
        td { border: 1px solid #CBD5E1; padding: 8px; }
        .income { color: #16A34A; font-weight: bold; text-align: right; }
        .expense { color: #E11D48; font-weight: bold; text-align: right; }
        .amount { text-align: right; }
        .center { text-align: center; }
        .footer-label { font-weight: bold; background-color: #E2E8F0; }
        .footer-val { font-weight: bold; background-color: #E2E8F0; text-align: right; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>İşlem T\xfcr\xfc</th>
            <th>Kategori</th>
            <th>A\xe7ıklama</th>
            <th>Tutar (₺)</th>
            <th>Net Bakiye Etkisi (₺)</th>
          </tr>
        </thead>
        <tbody>
          ${e.map(e=>`
            <tr>
              <td class="center">${e.date}</td>
              <td class="${"income"===e.type?"income":"expense"}">${"income"===e.type?"Gelir":"Gider"}</td>
              <td>${e.category}</td>
              <td>${(e.description||"").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</td>
              <td class="amount">₺${e.amount.toFixed(2).replace(".",",")}</td>
              <td class="${"income"===e.type?"income":"expense"}">${"income"===e.type?"+":"-"}₺${e.amount.toFixed(2).replace(".",",")}</td>
            </tr>
          `).join("")}
          <tr>
            <td colspan="4" class="footer-label">TOPLAM GELİR:</td>
            <td colspan="2" class="footer-val" style="color: #16A34A;">₺${a.toFixed(2).replace(".",",")}</td>
          </tr>
          <tr>
            <td colspan="4" class="footer-label">TOPLAM GİDER:</td>
            <td colspan="2" class="footer-val" style="color: #E11D48;">₺${s.toFixed(2).replace(".",",")}</td>
          </tr>
          <tr>
            <td colspan="4" class="footer-label">NET BAKİYE:</td>
            <td colspan="2" class="footer-val" style="color: #4F46E5;">₺${n.toFixed(2).replace(".",",")}</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `,t,"application/vnd.ms-excel;charset=utf-8;")},"formatCurrency",0,function(e,a){let r=Math.abs(e),s=a||t(),n=new Intl.NumberFormat(s,{minimumFractionDigits:2,maximumFractionDigits:2}).format(r);return`${e<0?"-":""}₺${n}`},"formatDate",0,a,"formatMonthName",0,function(e,a){if(!e)return"";let[r,s]=e.split("-"),n=new Date(parseInt(r,10),parseInt(s,10)-1,1),o=a||t();return new Intl.DateTimeFormat(o,{month:"long",year:"numeric"}).format(n)},"formatRelativeDate",0,function(e,r){if(!e)return"";let s=new Date(e),n=new Date,o=(r||t()).startsWith("en"),i=s.getDate()===n.getDate()&&s.getMonth()===n.getMonth()&&s.getFullYear()===n.getFullYear(),l=new Date;l.setDate(n.getDate()-1);let d=s.getDate()===l.getDate()&&s.getMonth()===l.getMonth()&&s.getFullYear()===l.getFullYear();return i?o?"Today":"Bugün":d?o?"Yesterday":"Dün":a(e,r)},"getCurrentWeekRange",0,function(){let e=new Date,t=e.getDay(),a=new Date(e);a.setDate(e.getDate()+(0===t?-6:1-t));let r=new Date(a);r.setDate(a.getDate()+6);let s=e=>{let t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`};return{start:s(a),end:s(r)}},"getCurrentYearMonth",0,function(){let e=new Date,t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0");return`${t}-${a}`},"getNextMonth",0,function(e){let[t,a]=e.split("-"),r=parseInt(t,10),s=parseInt(a,10)-1;return(s+=1)>11&&(s=0,r+=1),`${r}-${String(s+1).padStart(2,"0")}`},"getPreviousMonth",0,function(e){let[t,a]=e.split("-"),r=parseInt(t,10),s=parseInt(a,10)-1;return(s-=1)<0&&(s=11,r-=1),`${r}-${String(s+1).padStart(2,"0")}`}])}]);