# 全齡疫苗接種指南（臺灣）

兒童／青少年（0–18歲）與成人（19歲以上）個人化接種衛教與門診討論工具。依據疾管署**115年9月兒童、青少年及成人預防接種建議時程表**、**115年度流感公費對象**、**115–116年度COVID-19政策**及**115年8月10日起PCV20／PCV21肺炎鏈球菌公費政策**編寫。**規則最後檢核：2026-10-12**。

## 立即使用

開啟 `index.html` 即可在本機填寫，無需主機、資料庫、帳號或API。程式包含 `index.html`、`rules.js`、`child_rules.js`，需放在同一資料夾。Chrome、Edge、Safari 等現代瀏覽器支援。

成人輸入：**西元出生年（必填，自動換算年度年齡）**；兒少輸入**完整出生日期（必填，計算月齡）**及就學年級（選填），另填性別（選填）、是否懷孕及週數、慢性病、免疫功能與特殊風險。**不必先填寫疫苗接種史。**輸出符合條件的候選疫苗、建議劑次、理由、公費資格提示及疾管署來源；每項附醫護接種史核對區，可複製摘要或列印為PDF。

## 部署為與舊網站不同的GitHub Pages網址

**建議另建新的 repository，不要修改先前健康體位 Chatbot：**

1. 到 GitHub 新增儲存庫，例如 `adult-vaccine-guide`（不要使用舊站的儲存庫）。
2. 上傳 `index.html`、`rules.js`、`child_rules.js` 三個檔案（可一併上傳本 `README.md`）。
3. Repository **Settings → Pages → Build and deployment → Deploy from a branch**，Branch 選 `main`，資料夾選 `/ (root)`，儲存。
4. 發布後網址通常為 `https://<您的GitHub帳號>.github.io/adult-vaccine-guide/`；舊網站URL與內容不變。
5. 若需要不同網域，可額外綁定自訂網域。不需為了隔開網址而新辦GitHub帳號。

**注意：GitHub Pages發布的網頁通常可以被任何知道網址的人存取，並不等於「私人網站」。即使Repository本身設定private，也不要把它當成病患隱私保護措施。** 此工具不收集姓名、身分證、病歷號，亦無儲存或上傳資料功能。請避免將真實個案辨識資訊寫入程式碼或repository。

## 更新規則

- 維護 `rules.js`（成人）或 `child_rules.js`（兒少），相關規則均在 `evaluate()` 中。
- `index.html` 維護表單與樣式、頁面資料日期、提示與參考來源。
- 修改115–116年度流感／COVID資格時，請先確認最新疾管署公告。
- 肺炎鏈球菌使用 **PCV20或PCV21**，仍需由醫護人員區分**僅PPV23**、**僅PCV13/15**、**兩種皆打**及**PCV20/21已打**以決定銜接；前台不要求民眾自行填寫。不能把慢性心肺病或糖尿病單獨等同政府公告IPD高風險公費身分。
- 預設只提供初步篩選：不提供自動核對NIIS、庫存／接種院所即時資訊、醫囑或禁忌症完整判斷。

## 資料安全

所有判斷於瀏覽器端執行。不呼叫外部API、無Cookie、無localStorage、無追蹤碼；使用者重新載入頁面後表單不保留。不要用於儲存個案可識別資料。複製／列印結果由使用者自行決定是否保留。

## 醫療使用限制

本網站涵蓋0–18歲兒童／青少年及19歲以上成人；未具備自動NIIS接種史查核功能。孕婦、免疫功能低下者、器官移植、近期免疫抑制治療、動物咬抓傷及國際旅遊的接種規劃都需要個別醫師評估。填報的**初篩階段沒有要求使用者自行填寫接種史；每張候選疫苗卡片都需由醫護人員核對NIIS／疫苗手冊後，才能判斷是否實際安排接種。** 出生年換算的是年度年齡，適用年齡門檻須確認生日。公費資格依接種時最新版政策、身分證明、接種紀錄及院所判定為準。

## 主要來源

- [疾管署成人預防接種建議時程表](https://www.cdc.gov.tw/Category/ListPage/p1b6JRPkfMCUfBsaTSxaCw)
- [疾管署成人肺炎鏈球菌疫苗](https://at.cdc.gov.tw/Category/Page/U_hY1WCfa5BU6fuqW9FIXg)
- [疾管署公費流感疫苗接種計畫](https://www.cdc.gov.tw/Category/QAPage/T93ZfoLyyuCaZvKf7v9eww)
- [疾管署COVID-19接種時程與實務](https://www.cdc.gov.tw/Category/QAPage/JCyOJznV52tt35_bDBeHfA)
- [疾管署RSV疫苗](https://www.cdc.gov.tw/Category/Page/HMYG9wwEPFHjjpE8D6R31Q)
- [疾管署旅遊預防接種](https://www.cdc.gov.tw/Category/ListPage/37c87fQbw89fNxUHngpy6Q)
- [疾管署狂犬病疫苗](https://www.cdc.gov.tw/Category/Page/1u48Sr5o_Ck9zu9gJFedtA)

## V3 新增：旅遊疫苗與費用色標

- 在「身分及暴露風險」勾選「計畫出國／前往疫區」後，展開**國際旅遊疫苗評估**：目的國（僅供醫護參考）、預計出發日、黃熱病風險、傷寒飲食暴露、小兒麻痺流行地區、沙國朝覲／副朝覲、非洲腦膜炎帶等選項。
- 結果分別列出 **黃熱病、傷寒、小兒麻痺IPV、流行性腦脊髓膜炎MenACWY／MenB**；不會把一般觀光旅客判定為四種疫苗一律要打。若勾選該風險，優先提醒旅遊醫學評估。黃熱病對孕婦、免疫不全者與60歲以上初次接種者提供特別風險警示。
- **費用分類與醫學上的優先程度是兩套獨立標示**：綠色「可能符合公費」、藍色「自費」、黃色「公費資格待確認」。不能僅憑此標示認定已取得公費資格；須核對當年度政策、生日、免疫史與身分。
- 旅遊醫學門診的上述四種疫苗原則為自費。官方參考：
  [旅遊醫學門診自費項目](https://www.cdc.gov.tw/Category/ListContent/mtLMDNb29h9iyKcJdj7uYA?uaid=7xJffAe-293ImV5qeweoeQ)、[黃熱病](https://www.cdc.gov.tw/Category/ListContent/YipvR33b32K-dsMI2eIrIg?uaid=xwZvRLGTVN0ItcWOO_i_4Q)、[傷寒](https://www.cdc.gov.tw/Category/ListContent/YipvR33b32K-dsMI2eIrIg?uaid=-EHqnOHSFXal6KiCE-riMg)、[小兒麻痺](https://www.cdc.gov.tw/Category/ListContent/6786?uaid=17248)、[腦膜炎雙球菌](https://www.cdc.gov.tw/Category/Page/cTs_1wINWKYOxjzn_hi8fg)。
- **重要限制**：網站為離線靜態規則，不含可持續更新的國別疫情、簽證／入境條件資料。輸入國名**不會自動判定**黃熱病疫區或小兒麻痺流行國家；旅遊專屬勾選項目只是初步風險分類。應以疾管署國際旅遊處方箋、WHO和目的國最新法規核對。

開發者可執行 `node test_rules.js`，並以 `python test_browser_v3.py` 執行介面操作驗證（需要 Chromium／Playwright）。


## V4 新增：官方疫情查詢 → 回到網頁勾選疾病

1. 在「身分及暴露風險」勾選「計畫出國／前往疫區」。
2. 填寫目的地及出發日期；按 **「查詢旅遊疫情建議等級」** 或 **「查詢國際旅遊處方箋」**，連結在**新分頁**開啟。
3. 在疾管署網站查詢國名／地區、疫情名稱、等級、發布日期及疫苗／入境建議；**切回原本疫苗網頁**。
4. 勾選「黃熱病、傷寒、小兒麻痺、流行性腦脊髓膜炎、麻疹、A型肝炎、日本腦炎、M痘、登革熱、瘧疾、茲卡、屈公病、霍亂、流感」等疾病；另外提供「其他疫情」自由填寫與自行記錄的查詢日期。
5. 繼續勾選行程暴露風險、朝覲及入境證明等條件，點「查看適合我的疫苗」。

手動勾選會連動既有疫苗規則（黃熱病、傷寒、IPV、MenACWY／MenB、MMR、日本腦炎、A肝、M痘）；瘧疾、登革熱、茲卡、屈公病、霍亂等則以個人防護與旅遊醫學評估提醒呈現，**不會把「查到疫情」直接等同於「疫苗一定要打」**。對免疫低下、孕婦與年長者的活性黃熱病疫苗警示仍保留。

此為**人工查詢／人工回填**方案：靜態HTML不從官方網站自動讀取最新疫情，不發送使用者資料；查詢日期也只表示使用者自行填寫，不構成資料已驗證的證明。外部網站可能更改網址／資料，出發前請重新查核。

官方資料來源：
- [國際旅遊疫情建議等級](https://www.cdc.gov.tw/InternationalEpidemicLevel/)
- [國際旅遊處方箋](https://www.cdc.gov.tw/InternationalTravel/Index/ZkNLTkRxQ0NyQmc5Rk50dmZZZlI2Zz09)


## V5 新增：性別與妊娠欄位防呆

- 性別選擇「男性」時，懷孕核取方塊及懷孕週數欄位均停用、灰階呈現；若之前勾選懷孕或填寫週數，切換性別時自動清除。
- 性別選擇「女性」或「不提供」時可勾選懷孕，週數欄位只在勾選後啟用。
- 按「清除」恢復初始狀態；「試用示範」同步更新欄位。接種規則另有防護：若資料標記男性，即使意外帶入`pregnant: true`，也不會啟動妊娠專屬疫苗建議。
- 本功能依目前問卷的「性別」欄位防呆；若有不符合二元性別欄位、但具懷孕可能的個案，可選「不提供」並依妊娠狀況評估。

## V6 全齡版：新增兒童／青少年評估（2026-10-12）

評估對象可切換 **成人（19歲以上）** 與 **兒童／青少年（未滿19歲）**。成人維持輸入西元出生年；兒少要求完整出生年月日，計算月齡、實足年齡與預定接種節點。兒少可另選學籍（幼兒園、國小、國中七至九年級、高中／高職、五專1–3年級），用於提示流感及 HPV 公費資格；不填者以「待確認」表示。

- 兒童（0–10歲）：依疾管署115年9月／10月時程，顯示 HepB、BCG、DTaP-Hib-IPV、PCV、MMR、水痘、JE、A肝及學齡前DTaP-IPV等對應時程；流感與COVID-19依115年度政策核對。自費項目另列輪狀病毒及腸病毒A71型，注意產品適用年齡。
- 青少年（11–18歲）：MMR、水痘、HepB、HepA、IPV、Tdap、流感、COVID-19、HPV、特殊高風險肺炎鏈球菌與旅遊疫苗。
- 公費HPV **2025年起擴大至符合資格的國中男生與女生**，不能只用性別或生日判定；需查入學屆別、學籍、校園及補種通知。此處國中八／九年級僅代表「可能符合」，**不是自動核定**。
- 輪狀病毒在2026年仍原則自費（縣市補助另查）；疾管署公告預定2027年1月1日起實施全國公費，若後續政策變更須更新 `child_rules.js`。
- 疫苗史未知不表示未接種。尤其年長兒童與青少年**不應將嬰兒時程當作重新接種處方**；必須核對兒童健康手冊／NIIS，補種應由醫護依劑次間隔制定。
- 兒童的慢性病與旅遊疫苗需依年齡、仿單及禁忌症評估，不套用成人肺炎鏈球菌、黃熱病或傷寒疫苗劑次。
- 在 V5 的性別防呆之外，未滿11歲兒童將停用懷孕欄位；11歲以上青少年依性別選項開放，但需由醫護個別判斷。

### 網頁檔案

放在同一資料夾即可運作：`index.html`、`rules.js`、`child_rules.js`，另附 `README.md` 與 `test_rules.js`、`test_children.js`、`test_browser_v6.py`。請不要將測試程式中的示例日期誤當個案資料。

### 兒少主要官方依據

- 疾管署 115.09 兒童預防接種時程： https://www.cdc.gov.tw/En/Category/Page/TxRW-x3WzvPhvEtxM628GA
- 疾管署青少年預防接種建議： https://www.cdc.gov.tw/Category/List/EnLU6Jt494Pba5C_3S8USg
- 國健署國中男生公費HPV： https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4878&pid=19321
- 疾管署2026流感疫苗劑次： https://www.cdc.gov.tw/Category/QAPage/D1uGZc4_eZUpZogGNQxEzA
- 疾管署2026–2027新冠疫苗公費： https://www.cdc.gov.tw/Category/QAPage/JCyOJznV52tt35_bDBeHfA
- 疾管署輪狀病毒2027公費預告： https://www.cdc.gov.tw/Category/ListContent/Hh094B49-DRwe2RR4eFfrQ?uaId=AKJEJRXb3ze37t3ziTbrEQ
- 疾管署自費腸病毒A71型： https://www.cdc.gov.tw/Category/Page/u87VWWvbc8dH6BcgAguctw

**重要限制**：兒少接種「年齡」是候選清單推算條件，而非判斷接種適格或漏種的充分條件。本工具不存取 NIIS，不應被當作正式補種時程計算器。高風險慢性病、免疫低下、孕婦、早產兒、未完整接種或跨國移入兒童，請轉由兒科／感染科／接種門診依官方規定評估。
