/* 臺灣兒童（0–10歲）及青少年（11–18歲）疫苗初步篩選，2026-10-12。
   疾管署115.09時程、115年公費流感/COVID規定；HPV公費男女國中生依國健署2025起政策。
   不知道接種史時只能展示時程／候選疫苗，不能斷定漏打，更不能直接安排補種。 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.ChildVaccineRules=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const SOURCES={
 childSchedule:{label:'疾管署115年9月版兒童預防接種時程（115/10/1起）',url:'https://www.cdc.gov.tw/En/Category/Page/TxRW-x3WzvPhvEtxM628GA'},
 adolescent:{label:'疾管署青少年（11–18歲）接種建議',url:'https://www.cdc.gov.tw/Category/List/EnLU6Jt494Pba5C_3S8USg'},
 childFlu:{label:'疾管署115年度流感疫苗劑次及對象',url:'https://www.cdc.gov.tw/Category/QAPage/D1uGZc4_eZUpZogGNQxEzA'},
 childCovid:{label:'疾管署115–116年度COVID-19疫苗接種計畫',url:'https://www.cdc.gov.tw/Category/QAPage/JCyOJznV52tt35_bDBeHfA'},
 hpvYouth:{label:'國健署2025年起擴及國中男生公費HPV',url:'https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4878&pid=19321'},
 rotavirus:{label:'疾管署輪狀病毒疫苗2027年公費計畫',url:'https://www.cdc.gov.tw/Category/ListContent/Hh094B49-DRwe2RR4eFfrQ?uaId=AKJEJRXb3ze37t3ziTbrEQ'},
 ev71:{label:'疾管署腸病毒A71型疫苗',url:'https://www.cdc.gov.tw/Category/Page/u87VWWvbc8dH6BcgAguctw'},
 childhood:{label:'疾管署兒童公費與自費接種疫苗',url:'https://www.cdc.gov.tw/Category/List/Ptfl2kjX_AWqDbkrh44r8A'},
 travelCountries:{label:'疾管署國際旅遊處方箋',url:'https://www.cdc.gov.tw/InternationalTravel/Index/ZkNLTkRxQ0NyQmc5Rk50dmZZZlI2Zz09'},
 rabies:{label:'疾管署狂犬病疫苗與暴露後處置',url:'https://www.cdc.gov.tw/Category/Page/1u48Sr5o_Ck9zu9gJFedtA'}
};
const CONDITION_LABELS={diabetes:'糖尿病',heart:'慢性心臟／心血管疾病',lung:'慢性肺部疾病',kidney:'慢性腎病',dialysis:'透析',liver:'慢性肝病／肝硬化',obesity:'BMI ≥ 30',cancerTx:'一年內癌症治療／免疫抑制治療',immune:'免疫功能不全／高度免疫抑制',hiv:'HIV感染',transplant:'器官或幹細胞移植',asplenia:'無脾／脾臟功能缺損',csf:'腦脊髓液滲漏',cochlear:'人工耳植入',complement:'補體缺損',rare:'罕見疾病',major:'重大傷病',tb:'結核病',disability:'失能／神經發展障礙',mental:'符合公費定義的精神疾病'};
const has=(a,v)=>Array.isArray(a)&&a.includes(v);
function parseDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return null;const [y,m,d]=s.split('-').map(Number);const date=new Date(y,m-1,d,12);return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d?date:null;}
function evaluate(p={},atDate){const now=atDate?parseDate(atDate):new Date();const dob=parseDate(p.birthDate);if(!dob)return{error:'請輸入有效的兒童／青少年出生年月日。'};
 const days=Math.floor((new Date(now.getFullYear(),now.getMonth(),now.getDate())-new Date(dob.getFullYear(),dob.getMonth(),dob.getDate()))/86400000);if(days<0)return{error:'出生日期不能晚於今天。'};
 let months=(now.getFullYear()-dob.getFullYear())*12+now.getMonth()-dob.getMonth();if(now.getDate()<dob.getDate())months--;
 let age=now.getFullYear()-dob.getFullYear();if(now.getMonth()<dob.getMonth()||now.getMonth()===dob.getMonth()&&now.getDate()<dob.getDate())age--;
 if(age<0||age>=19)return{error:'兒童／青少年模式限未滿19歲；19歲以上請切換成人模式。'};
 const asOf=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const conditions=p.conditions||[],risks=p.risks||[],tr=p.travelRisks||[],td=p.travelDiseases||[];
 const c=id=>has(conditions,id),r=id=>has(risks,id),travelDisease=id=>has(td,id),travelRisk=id=>has(tr,id);
 const immune=['immune','hiv','cancerTx','transplant'].some(c);
 const complexRisk=immune||['asplenia','complement','cochlear','csf','dialysis'].some(c);
 const specialCovid=['diabetes','heart','lung','kidney','dialysis','liver','obesity','immune','hiv','transplant','rare','major','tb','disability','mental','cancerTx'].some(c);
 const travelMode=r('travel')||tr.length>0||td.length>0;
 const pregnancy=age>=11&&p.sex!=='male'&&!!p.pregnant;
 const student=['elementary','junior7','junior8','junior9','senior','vocational'].includes(p.schoolStage);
 const schoolStage=p.schoolStage||'unknown';
 const potentialFluPublic=months>=6&&(age<6||student||['diabetes','heart','lung','kidney','dialysis','liver','obesity','rare','major','cancerTx','immune','hiv','transplant'].some(c));
 const potentialCovidPublic=months>=6&&(specialCovid||(age<6&&p.covidEverVaccinated===false)||r('facilityResident'));
 const recs=[],alerts=[];
 function add(id,title,group,dose,why,fundingType,funding,action,source,caution='') {const typ=['public','self','check'].includes(fundingType)?fundingType:'check';recs.push({id,title,group,dose,why,fundingType:typ,fundingLabel:typ==='public'?'可能符合公費':typ==='self'?'自費':'公費資格待確認',funding,action,source,caution});}
 const monthText=m=>m===0?'出生後24小時內':`滿${m}個月`;
 function routine(id,title,arr,why,extra=''){
   const schedule=arr.map((m,i)=>`${monthText(m)}第${i+1}劑`).join('；');
   const past=arr.filter(m=>months>=m),upcoming=arr.find(m=>m>months);
   if(past.length){const latest=past[past.length-1];const recent=months-latest<=1;
    // 已超過全部常規時程數年者，不擅自推定漏打；只讓醫護確認是否完成。
    if(months-latest>=48 && months>=84)return;
    add(id,title,recent?'now':'check',schedule,`目前${age===0?`約${months}個月大`:`${age}歲`}；表定已到達${monthText(latest)}的接種節點。${why}`,'public','符合常規公費時程者通常可公費；漏打補種需依年齡、戶籍及適用辦法核對。','請先查兒童健康手冊／NIIS是否完成，不要僅依年齡判定未接種或重複接種。','childSchedule',extra);
   }else if(upcoming!==undefined&&upcoming-months<=5){add(id,title,'consider',schedule,`目前尚未到表定${monthText(upcoming)}接種年齡。${why}`,'public','符合適齡常規接種對象可能公費。',`請在接近${monthText(upcoming)}時，與兒科門診確認安排。`,'childSchedule',extra);}
 }
 if(age<=10){
 routine('p_hepb','B型肝炎疫苗（HepB）',[0,1,6],'出生、1與6個月完成基礎系列。');
 routine('p_bcg','卡介苗（BCG）',[5],'建議出生滿5–8個月接種。',immune?'疑似免疫不全者不可直接安排活性卡介苗，需由兒科及相關專科確認。':'特殊結核病暴露可能需提前評估。');
 routine('p_penta','五合一疫苗（DTaP-Hib-IPV）',[2,4,6,18],'預防白喉、破傷風、百日咳、b型嗜血桿菌及小兒麻痺。');
 routine('p_pcv','結合型肺炎鏈球菌疫苗（兒童PCV）',[2,4,12],'以115.09時程表的PCV13常規時程為依據；實際使用產品以接種院所當年度公告為準。');
 routine('p_var','水痘疫苗',[12],'常規於滿12個月接種。',immune?'免疫功能低下者活性疫苗須專科評估。':'');
 routine('p_mmr','MMR（麻疹、腮腺炎、德國麻疹）',[12,60],'第1劑滿12個月，第2劑於滿5歲至入國小前。',immune?'免疫功能低下者活性疫苗須專科評估。':'第2劑須核對是否已完成，國小後漏打請醫護訂定補種時程。');
 routine('p_je','日本腦炎疫苗',[15,27],'115年版為活性減毒嵌合型2劑，間隔約12個月。',immune?'免疫功能低下者須評估是否可使用活性疫苗，勿直接套用常規。':'');
 routine('p_hepa','A型肝炎疫苗',[18,27],'115年版滿18、27個月各1劑；此處以2017年以後出生兒童為主。');
 if(months>=54){
  const isSchool=schoolStage==='elementary';
  const grp=(months>=60&&!isSchool&&age<=6)?'now':'check';
  add('p_dtaip','入國小前四合一疫苗（DTaP-IPV）',grp,'滿5歲至入國小前1劑','需由醫護核對入學前追加劑是否已完成。','public','符合公費學齡前常規時程者可公費；已入學者依補種辦法。','攜帶兒童健康手冊或由醫護確認NIIS紀錄，避免重複接種。','childSchedule');
 }
 if(days>=42&&months<8){
  const rotPublic=asOf>='2027-01-01'?'check':'self';
  {add('p_rota','輪狀病毒口服疫苗','check','依廠牌為2劑（2、4個月）或3劑（2、4、6個月），各劑至少間隔4週','適用年齡有限；接種史不明時須由醫護確認已接種劑次及是否仍能於上限月齡內完成。',rotPublic,asOf>='2027-01-01'?'全國公費計畫預定2027/1/1起實施，須核對當年度資格與產品。':'2026年原則自費，部分縣市可能另有補助；2027/1/1預定納入全國公費。','務必核對產品起始與完成接種的週齡上限，不可單憑此頁決定補種。','rotavirus');}
 }
 if(months>=2&&months<72)add('p_ev71','腸病毒A71型疫苗','consider','依核准產品仿單決定2–3劑等時程','適用滿2個月至未滿6歲幼兒；預防腸病毒A71型相關重症，不預防所有腸病毒。','self','目前以自費接種為主；地方補助另查。','可向兒科討論產品年齡、既往施打及劑次。','ev71');
 }
 if(age>=11){
  add('y_tdap','Tdap（減量破傷風／白喉／百日咳）','check','11–18歲建議至少1劑Tdap。','需核對青少年時期是否已有接種Tdap。','self','一般以自費接種為主，地方補助及校園安排另查。','先核對接種紀錄；如未完成與醫護討論補種。','adolescent');
  add('y_mmr','MMR（麻疹、腮腺炎、德國麻疹）',pregnancy||immune?'check':'consider','總計2劑，兩劑至少間隔28天。','未有2劑有效紀錄的青少年應討論補種，不表示所有青少年都要再打。','check','符合政府補種方案者可能公費，其他情況可能自費。',pregnancy?'懷孕期間不可施打MMR；產後再討論補種。':'請核對2劑紀錄與免疫史。','adolescent',immune?'免疫功能低下者活性MMR疫苗可能禁忌。':'');
  add('y_var','水痘疫苗',pregnancy||immune?'check':'consider','未曾接種且未曾感染者，13歲以上需2劑（間隔4–8週）。','未感染／未接種者需評估，避免對已具免疫力者重複接種。','check','可能有兒童補種公費資格，其他情況通常自費，須核對出生年與政策。',pregnancy?'懷孕期間禁用活性水痘疫苗；產後評估。':'查詢NIIS與水痘感染史再安排。','adolescent',immune?'活性疫苗需先確認免疫功能。':'');
  add('y_hepb','B型肝炎疫苗','consider','未曾接種者一般完成3劑系列。','未接種或高風險且無保護力的青少年，需依疫苗及檢驗紀錄評估。','self','一般青少年非補種政策對象，多為自費。','既有3劑系列且非高風險者，不應僅憑anti-HBs陰性常規追加。','adolescent');
  add('y_hepa','A型肝炎疫苗','consider','未接種者2劑，通常間隔6–12個月。','未具免疫力、高感染風險或前往疫區者可考慮。','self','一般青少年自費，特殊補種及地方補助另查。','先查既往疫苗及免疫紀錄。','adolescent');
  add('y_ipv','不活化小兒麻痺疫苗（IPV）','consider','依過去基礎接種史決定補種或追加劑。','未完成常規接種或前往小兒麻痺流行地區者需評估。','self','旅遊或一般自費補種以醫護判定為準。','先確認童年五合一及學齡前追加劑，不要自動重做全套。','adolescent');
  const hpvPublic=['junior8','junior9'].includes(schoolStage);
  add('y_hpv','人類乳突病毒疫苗（HPV）',pregnancy?'check':'now',age<15?'9–14歲開始接種通常2劑（0、6月）；依仿單與免疫狀況調整。':'15歲以上開始通常3劑（0、2、6月）；依仿單與免疫狀況調整。','臺灣2025年起已擴大國中男女生公費接種，資格主要依入學屆別與學籍，而非單憑性別或歲數。',hpvPublic?'public':'check',hpvPublic?'目前填答為國中八／九年級，可能符合國健署公費資格；仍須依入學屆別、接種紀錄及學校核對。':'請確認是否為公費國中生屆別、是否已接種；非公費對象可評估自費。',pregnancy?'懷孕期間暫緩接種HPV疫苗。':'請學校護理師確認是否已有公費接種或補種通知。','hpvYouth');
  if(complexRisk){add('y_pcv','肺炎鏈球菌疫苗（高風險青少年）','check','依高危險類型與既往PCV／PPV23紀錄制定接種時程。','具有無脾、免疫低下、人工耳植入或其他高風險狀況。','check','青少年高風險疫苗公費資格與產品，須查核現行補助及適用政策。','請由兒科／感染科評估，勿套用成人65歲接種方案。','adolescent');}
 }
 if(months>=6){
  let fluDose=age>=9?'每年1劑':age<3?'依115年度規則：未曾接種或累計僅1劑者本季2劑、間隔至少4週；累計至少2劑者1劑。':'依115年度規則：未曾接種者本季2劑（間隔至少4週）；曾接種至少1劑者通常1劑。';
  add('p_flu','季節性流感疫苗','now',fluDose,'滿6個月以上每年依年齡和過往劑數安排。',potentialFluPublic?'public':'check',potentialFluPublic?'年齡、學籍或高風險條件可能符合115年度公費；國小在校集中接種原則先提供1劑。':'是否公費需確認實際學籍、慢性病及115年度方案；非符合者須評估自費。','由醫護核對以前打過幾劑流感疫苗；9歲以下可能需要第2劑。','childFlu');
  if(months>=6){add('p_covid','COVID-19疫苗','check','依當年度疫苗產品、年齡與既往接種史決定劑次。','115–116年度公費對象包含特定高危險兒童，以及滿6個月至未滿6歲且從未接種的幼兒。',potentialCovidPublic?'public':'check',potentialCovidPublic?'可能符合115–116年度公費資格；未滿6歲者需核對「從未接種」條件。':'是否符合公費及適用產品仍需依當年度公告確認。','先核對既往COVID-19疫苗史；不同年齡／產品的劑次不可混用成人規則。','childCovid');}
 }else alerts.push('目前未滿6個月：流感疫苗尚未達適用起始年齡，請與照顧者討論周邊保護及例行疫苗。');
 if(travelMode){
  const trId=(id)=>travelRisk(id)||travelDisease(id);
  if(trId('yellow'))add('p_yellow','黃熱病疫苗（兒童旅遊評估）','check','依適用產品年齡與國際預防接種證明規範評估。','已勾選黃熱病疫情或行程風險。','self','旅遊醫學門診原則自費。','未滿9個月者尤其不可直接安排，須由旅遊醫學及兒科確認禁忌、入境規定與必要性。','travelCountries');
  if(trId('typhoid'))add('p_typhoid','傷寒疫苗（兒童旅遊評估）','check','注射Vi多醣體疫苗通常須滿2歲，產品選擇由醫師確認。','已勾選傷寒疫情或食品飲水暴露風險。','self','旅遊醫學門診原則自費。','未滿適用年齡者不可直接接種；需重視飲食飲水預防。','travelCountries');
  if(trId('polio'))add('p_polio','小兒麻痺旅遊追加劑評估','check','依完整兒童基礎接種紀錄與目的國當期規定。','已勾選流行地區／接種證明風險。','check','旅行接種資格及是否自費須由旅遊醫學門診確認。','先查五合一與學齡前補種記錄，勿假定需要每人再打1劑。','travelCountries');
  if(travelRisk('meningHajj')||travelRisk('meningBelt')||travelDisease('mening')||complexRisk){add('p_mening','流行性腦脊髓膜炎疫苗（兒童／青少年旅遊）','check','MenACWY及MenB依產品適用年齡與感染風險決定。','目的國或特殊疾病風險可能需要評估。','self','旅遊疫苗通常自費；特殊病況補助另查。','朝覲相關規定及年齡適用性需查目的國最新要求。','travelCountries');}
  if(travelDisease('measles')) alerts.push('目的地有麻疹疫情：請查詢兒童是否完成MMR，必要時由醫師評估提早接種或追加；早期接種不能自行當作常規兩劑完成。');
  if(travelDisease('dengue')||travelDisease('malaria')||travelDisease('zika')) alerts.push('目的地手動勾選登革熱、瘧疾或茲卡：請加強防蚊，並依目的地評估預防性用藥；不可直接套用成人疫苗規則。');
 }
 if(r('animalBite'))add('p_rabies','疑似狂犬病暴露後緊急處置','urgent','依暴露情況由醫護決定疫苗與免疫球蛋白。','已填寫近期疑似風險動物咬抓傷。','check','暴露後補助需依規定查核。','立即大量清水與肥皂清洗傷口約15分鐘並儘速就醫。','rabies');
 if(immune) alerts.push('免疫功能低下兒童接種卡介苗、MMR、水痘及活性日本腦炎等活性疫苗須先由專科評估，不能依一般時程直接接種。');
 if(pregnancy)alerts.push('已勾選青少年懷孕：請以產科及兒科評估妊娠期疫苗；MMR、水痘等活性疫苗不應在懷孕期間接種。');
 if(age<=10)alerts.push('兒童疫苗時程為「依月齡可能已到接種節點」而非判斷漏打。應以兒童健康手冊與NIIS接種日期決定當次可接種的劑次；延遲接種不可直接從頭重打。');
 if(age>=11)alerts.push('國中二年級HPV公費政策於114年起擴及男生。是否公費依學籍及入學屆別認定，不能只用性別或出生年判定。');
 if(travelMode)alerts.push('旅遊疫苗與目的地疫情均為手動勾選。兒童產品有最低接種年齡，須另核對當地疫情與入境規定，勿直接採用成人劑次。');
 if(asOf<'2026-10-01'||asOf>='2027-10-01')alerts.push('公費流感與COVID-19等年度方案需核對執行日期及最新公告。');
 const order={urgent:0,now:1,check:2,consider:3,done:4};recs.sort((a,b)=>order[a.group]-order[b.group]||a.title.localeCompare(b.title,'zh-Hant'));
 const counts=Object.fromEntries(['urgent','now','check','consider','done'].map(t=>[t,recs.filter(x=>x.group===t).length]));
 return {age,ageMonths:months,birthYear:dob.getFullYear(),birthDate:p.birthDate,ageLabel:age<1?`出生後${days}天（約${Math.max(0,months)}個月）`:`${age}歲${months%12}個月`,population:'child',asOf,recs,counts,alerts,policyVersion:'兒童115.09／青少年115.09＋115年公費政策（2026-10-12檢核）',sources:SOURCES,
  conditions:conditions.map(x=>CONDITION_LABELS[x]).filter(Boolean),risks:risks.map(x=>x).filter(Boolean),travelDestination:p.travelDestination||'',travelDate:p.travelDate||'',travelRiskLabels:tr,travelDiseaseLabels:td,outbreakCheckDate:p.outbreakCheckDate||'',otherEpidemic:p.otherEpidemic||''};
}
return{evaluate,SOURCES};
});
