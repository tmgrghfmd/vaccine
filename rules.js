/* 成人疫苗建議規則，台灣，整理日期：2026-10-12。
   資料依據：疾管署115年9月成人時程表及2026年8-10月最新公費政策。
   本檔只做初步建議；不得取代醫師接種評估、疫苗仿單及NIIS接種紀錄。 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.VaccineRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SOURCES = {
    schedule: { label: '疾管署成人預防接種建議時程表（115年9月版）', url: 'https://www.cdc.gov.tw/Category/ListPage/p1b6JRPkfMCUfBsaTSxaCw' },
    pneumo: { label: '疾管署成人公費肺炎鏈球菌疫苗（PCV20／PCV21）', url: 'https://at.cdc.gov.tw/Category/Page/U_hY1WCfa5BU6fuqW9FIXg' },
    influenza: { label: '疾管署115年度流感公費實施對象', url: 'https://www.cdc.gov.tw/Category/QAPage/T93ZfoLyyuCaZvKf7v9eww' },
    covid: { label: '疾管署115-116年度COVID-19疫苗接種時程', url: 'https://www.cdc.gov.tw/Category/QAPage/JCyOJznV52tt35_bDBeHfA' },
    rsv: { label: '疾管署RSV疫苗接種建議', url: 'https://www.cdc.gov.tw/Category/Page/HMYG9wwEPFHjjpE8D6R31Q' },
    travel: { label: '疾管署欲至外國者預防接種建議', url: 'https://www.cdc.gov.tw/Category/ListPage/37c87fQbw89fNxUHngpy6Q' },
    immune: { label: '疾管署免疫功能低下者接種建議', url: 'https://www.cdc.gov.tw/Category/ListPage/g9rqm1jhIt65b8sr5Vap8w' },
    rabies: { label: '疾管署狂犬病疫苗與暴露後處置', url: 'https://www.cdc.gov.tw/Category/Page/1u48Sr5o_Ck9zu9gJFedtA' },
    yellowFever: { label: '疾管署黃熱病疫苗與國際預防接種證明', url: 'https://www.cdc.gov.tw/Category/ListContent/YipvR33b32K-dsMI2eIrIg?uaid=xwZvRLGTVN0ItcWOO_i_4Q' },
    typhoid: { label: '疾管署傷寒疫苗接種建議', url: 'https://www.cdc.gov.tw/Category/ListContent/YipvR33b32K-dsMI2eIrIg?uaid=-EHqnOHSFXal6KiCE-riMg' },
    polio: { label: '疾管署小兒麻痺疫苗與旅遊風險', url: 'https://www.cdc.gov.tw/Category/ListContent/6786?uaid=17248' },
    meningVax: { label: '疾管署流行性腦脊髓膜炎疫苗', url: 'https://www.cdc.gov.tw/Category/Page/cTs_1wINWKYOxjzn_hi8fg' },
    travelFees: { label: '疾管署旅遊醫學門診自費項目', url: 'https://www.cdc.gov.tw/Category/ListContent/mtLMDNb29h9iyKcJdj7uYA?uaid=7xJffAe-293ImV5qeweoeQ' },
    hajj: { label: '疾管署2026年赴沙國朝覲接種說明', url: 'https://www.cdc.gov.tw/Category/ListContent/xvuY1QHWIxRpnXlm0sMv6g?uaid=LfCqKnjfAtoyGoF_zDRGcg' },
    travelCountries: { label: '疾管署國際旅遊處方箋（國別建議）', url: 'https://www.cdc.gov.tw/InternationalTravel/Index/ZkNLTkRxQ0NyQmc5Rk50dmZZZlI2Zz09' },
    travelEpidemics: { label: '疾管署國際旅遊疫情建議等級（即時查詢）', url: 'https://www.cdc.gov.tw/InternationalEpidemicLevel/' },
  };
  const CONDITION_LABELS = {
    diabetes:'糖尿病', heart:'慢性心臟／心血管疾病', lung:'慢性肺部疾病', kidney:'慢性腎病', dialysis:'透析',
    liver:'慢性肝病／肝硬化', obesity:'BMI ≥ 30', cancerTx:'一年內癌症治療／免疫抑制治療',
    immune:'先天或後天免疫不全／高度免疫抑制', hiv:'HIV感染', transplant:'器官或幹細胞移植',
    asplenia:'無脾／脾臟功能缺損', csf:'腦脊髓液滲漏', cochlear:'人工耳植入', complement:'補體缺損',
    dementia:'失智症', disability:'失能／神經發展障礙', mental:'符合公費定義的精神疾病', tb:'結核病',
    rare:'罕見疾病', major:'重大傷病', hemophilia:'血友病'
  };
  const RISK_LABELS = {
    indigenous:'原住民', healthcare:'醫事／衛生防疫相關人員', facilityResident:'長照或照護機構住民', facilityStaff:'長照機構工作人員',
    childcare:'幼兒園／托育人員', infantCare:'6個月內嬰兒的父母或照顧者', animals:'禽畜或動物防疫相關工作',
    smoker:'吸菸', alcohol:'酒精使用障礙', hbvExposure:'B肝血液／同住／性接觸等高暴露風險',
    mmrExposure:'醫療工作／高接觸／麻疹疫情地區暴露風險', mpoxExposure:'M痘暴露或符合高風險條件',
    travel:'計畫出國／前往疫區', jeExposure:'日本腦炎高風險環境', meningExposure:'腦膜炎雙球菌流行地區暴露風險',
    rabiesOccup:'獸醫／動物防疫／野生動物等狂犬病職業暴露風險', animalBite:'近期疑似狂犬病風險動物咬抓傷',
    hepAExposure:'A肝風險職業／流行區暴露', hpvExposure:'HPV高感染風險'
  };
  const TRAVEL_RISK_LABELS = {
    yellow:'前往非洲／中南美洲黃熱病風險區，或需黃熱病入境證明／疫區轉機',
    typhoid:'前往飲食飲水衛生風險較高地區、偏鄉、探親、背包旅行或長期停留',
    polio:'前往小兒麻痺病例或疫苗衍生株流行地區、需出入境接種證明',
    meningHajj:'前往沙烏地阿拉伯朝覲（Hajj）／副朝覲（Umrah）',
    meningBelt:'前往非洲腦膜炎帶或其他流行性腦脊髓膜炎疫情地區'
  };
  const TRAVEL_DISEASE_LABELS = {
    yellow:'黃熱病', typhoid:'傷寒', polio:'小兒麻痺症', mening:'流行性腦脊髓膜炎',
    measles:'麻疹', hepatitisA:'A型肝炎', japaneseEncephalitis:'日本腦炎', mpox:'M痘',
    dengue:'登革熱', malaria:'瘧疾', zika:'茲卡病毒感染症', chikungunya:'屈公病', cholera:'霍亂', influenza:'流感'
  };
  const has = (list, id) => Array.isArray(list) && list.includes(id);
  const history = (p, id) => p.history && p.history[id] || 'unknown';
  const yearPassed = (y, today) => Number.isInteger(+y) && +y > 1900 ? today.getFullYear() - Number(y) : null;
  const POLICY_START = '2026-10-01', POLICY_SECOND = '2026-11-02';
  function evaluate(raw, atDate) {
    const p = raw || {};
    const now = atDate ? new Date(atDate + 'T12:00:00') : new Date();
    const birthYear = p.birthYear == null || p.birthYear === '' ? null : Number(p.birthYear);
    const age = birthYear !== null ? now.getFullYear() - birthYear : Number(p.age);
    if (birthYear !== null && (!Number.isInteger(birthYear) || birthYear<now.getFullYear()-120 || birthYear>now.getFullYear()-19)) return {error:'請輸入19–120歲成人的有效出生年。'};
    if (!Number.isInteger(age) || age < 19 || age > 120) return { error:'本工具以19歲以上成人為對象，請輸入有效出生年。' };
    const asOf = [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
    const isPolicyYear = asOf >= POLICY_START && asOf < '2027-10-01';
    const risk = p.risks || [], conditions = p.conditions || [], travelRisk = p.travelRisks || [], travelDiseases = p.travelDiseases || [];
    const c = id => has(conditions, id), r = id => has(risk,id), tr = id => has(travelRisk,id), td = id => has(travelDiseases,id);
    const travelMode = r('travel') || travelRisk.length > 0 || travelDiseases.length > 0;
    const outbreakCheckDate = /^\d{4}-\d{2}-\d{2}$/.test(p.outbreakCheckDate||'') ? p.outbreakCheckDate : '';
    const otherEpidemic = typeof p.otherEpidemic==='string' ? p.otherEpidemic.trim().slice(0,120) : '';
    const travelDest = typeof p.travelDestination==='string' ? p.travelDestination.trim().slice(0,120) : '';
    const travelDate = /^\d{4}-\d{2}-\d{2}$/.test(p.travelDate||'') ? p.travelDate : '';
    const pregnant = p.sex !== 'male' && !!p.pregnant, gestation = pregnant ? Number(p.weeks) || 0 : 0;
    const highInfluenza = ['diabetes','heart','lung','kidney','dialysis','liver','obesity','cancerTx','immune','hiv','transplant','rare','major'].some(c);
    const highCovid = highInfluenza || ['tb','dementia','disability','mental'].some(c);
    const firstPriority = age >= 65 || age >= 55 && r('indigenous') || pregnant || highInfluenza ||
      ['healthcare','facilityResident','facilityStaff','childcare','infantCare'].some(r);
    const firstCovid = age >= 65 || age >= 55 && r('indigenous') || pregnant || highCovid ||
      ['healthcare','facilityResident','facilityStaff','childcare','infantCare'].some(r);
    const pneumococcalIPD = ['asplenia','immune','hiv','cochlear','csf','cancerTx','transplant'].some(c);
    const pneumococcalPublic = age >= 65 || age>=55 && age <=64 && r('indigenous') || age<65 && pneumococcalIPD;
    const pneumoExtra = ['heart','lung','kidney','dialysis','diabetes','liver'].some(c) || r('smoker') || r('alcohol');
    const immune = ['immune','hiv','transplant','cancerTx'].some(c);
    const reducedImmunity = immune || c('dialysis');
    const rsvRisk = c('lung') || c('heart') || c('kidney') || c('dialysis') || c('liver') || r('facilityResident');
    const riskHepB = immune || c('dialysis') || c('transplant') || r('healthcare') || r('hbvExposure');
    const riskHepA = c('liver') || c('hemophilia') || c('transplant') || r('hepAExposure') || r('travel') || td('hepatitisA');
    const mmrBirth = birthYear;
    const may1966 = mmrBirth ? mmrBirth>=1966 : (age <=59 ? true : (age >=62 ? false : null));
    const eligibleHighRiskHPV = immune || r('hpvExposure');
    let recs = [];
    const add = (id, title, group, dose, why, funding, action, source, caution='') => recs.push({id,title,group,dose,why,funding,action,source,caution});
    const checkOr = (id, groupIfNone='now') => history(p,id)==='done' ? 'done' : history(p,id)==='partial' ? 'check' : groupIfNone;
    const policy = (eligible, phase) => !isPolicyYear ? '公費政策依年度調整，請確認當年度最新公告。' : eligible ? `可能符合115年度公費對象，${phase}；請以實際身分及合約院所查核為準。` : '目前填答條件未顯示符合115年度公費對象；請確認其他身分或自費接種。';
    // 1. Influenza
    const fluElig = firstPriority || age>=50 || r('animals');
    const fluPhase = firstPriority || age>=65 || r('animals') ? '第一階段自10/1開放' : '50–64歲無高風險者第二階段自11/2開放';
    add('flu','季節性流感疫苗',checkOr('flu'),'每年1劑。', '每位成人都建議每年接種；慢性病、孕婦與長者尤其重要。',policy(fluElig,fluPhase),history(p,'flu')==='done'?'本季已接種；下個流感季再接種。':'核對是否已於115年度流感季接種。', 'influenza');
    // 2. COVID-19
    const covidElig = firstCovid || age>=50;
    const covidPhase = firstCovid ? '第一階段自10/1開放' : '50–64歲無高風險者第二階段自11/2開放';
    const covidExtra = age>=65 || age>=55 && r('indigenous') || reducedImmunity;
    let covAction = history(p,'covid')==='done' ? '已填報接種本季XFG疫苗；若屬加強劑適用對象，需確認間隔。' : '先確認是否已接種115–116年度XFG疫苗及上次接種日期。';
    if (covidExtra) covAction += ' 本季第1劑後滿180天，符合條件者可再追加1劑。';
    add('covid','COVID-19 疫苗',checkOr('covid',covidElig?'now':'consider'),
      '115–116年度成人原則接種XFG疫苗1劑；過去曾接種者與前劑至少間隔84天。符合條件者可再追加1劑。',
      '依本年度病毒株與高風險身分安排接種。',policy(covidElig,covidPhase),covAction,'covid');
    // 3. Pneumococcal
    const ph = history(p,'pneumo'), pneumoDate = p.pneumoDate || '', lastP = pneumoDate ? new Date(pneumoDate+'T12:00:00') : null;
    const dateOk = lastP && !isNaN(+lastP) && lastP <= now;
    let pnGroup='consider', pnDose='依PCV13/15、PPV23、PCV20/21既往接種史決定。', pnAction='';
    if (ph==='done20') { pnGroup='done'; pnDose='已完成1劑PCV20或PCV21，原則無須再接種。'; pnAction='已完成接種；特殊狀況仍可由醫師查核。'; }
    else if (ph==='both') {pnGroup='done'; pnDose='PCV13/15 + PPV23 已完成基礎接種。'; pnAction='若在65歲前以IPD高風險身分完成兩種疫苗，滿65歲且與前劑至少5年，可評估再追加1劑PCV20/21。'; if (age>=65 && p.pre65Pneumo) pnGroup='check';}
    else if (ph==='none') { pnGroup=pneumococcalPublic?'now':'consider'; pnDose='符合接種條件且未曾接種者：PCV20或PCV21，1劑。'; pnAction='核對疫苗紀錄與接種當日適用資格。'; }
    else if (ph==='ppv23' || ph==='pcv13') {
      pnGroup=pneumococcalPublic?'check':'consider'; const shorter=ph==='pcv13' && (pneumococcalIPD || age>=65 && (r('facilityResident')||c('dialysis')));
      const days = ph==='ppv23'?365:(shorter?56:365); const interval=ph==='ppv23'?'至少1年':shorter?'至少8週':'至少1年';
      pnDose=`僅接種過${ph==='ppv23'?'PPV23':'PCV13/15'}：間隔${interval}，評估接種1劑PCV20或PCV21。`;
      if(dateOk) { const target = new Date(lastP); target.setDate(target.getDate()+days); const iso=target.toISOString().slice(0,10); pnAction=target>now ? `依填寫日期估算，最早於 ${iso} 後再安排；仍需確認實際疫苗種類與日期。` : '依填寫日期估算已達間隔，可由接種院所確認後安排。'; }
      else pnAction='請查詢上次接種日期；未確認間隔前不可認定立即可施打。';
    } else { pnGroup=pneumococcalPublic?'now':'consider'; pnAction='屬可能適合接種的對象。實際施打前由醫護人員查NIIS／黃卡，確認PCV或PPV既往種類及接種間隔。'; }
    if (!pneumococcalPublic && !pneumoExtra && ph==='none') pnGroup='consider';
    if(pneumococcalPublic || pneumoExtra || ph!=='unknown') add('pneumo','肺炎鏈球菌疫苗',pnGroup,pnDose,
      pneumococcalPublic?'符合65歲以上、55–64歲原住民或19–64歲IPD特定高風險對象條件之一。':pneumoExtra?'有慢性病或其他肺炎風險，建議與醫師討論自費接種；不等於符合IPD公費高風險資格。':'依年齡及特殊風險決定，非所有19–64歲成人均需立即接種。',
      pneumococcalPublic?'可能符合成人肺炎鏈球菌公費接種身分；須核對疫苗紀錄及身分。':'目前未符合本工具所列公費身分；如有其他醫療必要，請個別評估。',pnAction,'pneumo');
    // 4. Tdap
    const ty=yearPassed(p.lastTetanusYear,now), th=history(p,'tdap');
    let tdGroup=th==='none'||th==='unknown'?'now':'done';
    let tdAction=th==='none'?'建議完成至少1劑Tdap；若基礎免疫史不完整，須個別安排補接種。':'確認是否曾接種Tdap與最近一次含破傷風疫苗施打年份。';
    if (th==='done' && ty!==null) { tdGroup=ty>=10?'now':'done'; tdAction=ty>=10?`距最近一次接種約${ty}年，建議安排10年追加劑。`:`距最近一次接種約${ty}年，尚未滿10年。`; }
    else if (th==='done') tdGroup='check';
    if(pregnant) {tdGroup='now';tdAction='每次懷孕均需1劑Tdap；以懷孕27–36週接種最佳，不受以往Tdap接種史限制。'; }
    add('tdap','Tdap／破傷風相關疫苗',tdGroup,'成人至少1劑Tdap，之後每10年追加；每次懷孕1劑Tdap。',
      pregnant?'孕婦可將抗體傳給嬰兒，應於本次懷孕重新接種。':'日常成人預防及保護新生兒。','成人一般自費；實際補助依特定方案。',tdAction,'schedule');
    // 5. MMR
    const mh=history(p,'mmr');
    if (may1966!==false || r('mmrExposure') || td('measles')) {
      let mg=mh==='done'?'done':mh==='partial'?'check':'now';
      if(td('measles') && mg==='consider') mg='now';
      if (may1966===null) mg='consider';
      if (pregnant) mg='check';
      const rubellaPublic=p.sex==='female' && age<=49 && p.rubellaRecentNegative;
      add('mmr','麻疹、腮腺炎、德國麻疹混合疫苗（MMR）',mg,'1966年（含）以後出生者，建議滿1歲後有2劑紀錄，兩劑至少間隔28天。',
        td('measles')?'使用者在官方旅遊資訊查詢後，手動勾選麻疹；須再核對當地疫情、免疫力與2劑接種紀錄。':'與出生年、接種史及暴露風險有關。',rubellaPublic?'15–49歲育齡婦女符合近3個月德國麻疹抗體陰性證明等條件者，可能公費1劑。':'一般成人多需自費；育齡婦女符合特定條件者可查公費。',
        pregnant?'MMR為活性疫苗，懷孕期間不可接種；產後評估補種。':(may1966===null?'出生年不確定，請填西元出生年以判斷1966年界線。':mh==='done' && r('mmrExposure')?'高暴露風險者，應再核對最近接種日期或抗體陽性證明是否符合疾管署免疫力判定條件。':'請核對兩劑紀錄；接種後4週內應避免懷孕。'), 'schedule',immune?'免疫低下者活性疫苗可能禁忌，需個別評估。':'');
    }
    // 6. Hep B
    const bh=history(p,'hepb');
    let bg=checkOr('hepb',riskHepB?'now':'consider');
    if(p.hbsAg==='positive') bg='check';
    if(bh==='done' && p.antiHbs==='negative' && riskHepB) bg='check';
    let bAction=p.hbsAg==='positive'?'已填寫HBsAg陽性：不應以一般未接種流程直接追加B肝疫苗，請先評估感染及追蹤。':
      bh==='done' && p.antiHbs==='negative' && riskHepB?'B肝感染高危險群若anti-HBs <10 mIU/mL，可先追加1劑，1個月後複驗，依結果決定是否續打。':
      bh==='done'?'已完成接種；非高風險者不須僅因抗體轉陰便全面追加。':'請確認既往3劑紀錄、感染狀態（必要時HBsAg）及是否需評估anti-HBs。';
    add('hepb','B型肝炎疫苗',bg,'未曾接種者一般基礎系列3劑；高危險群需依抗體反應調整。',riskHepB?'有B肝暴露或免疫相關風險。':'依既往接種紀錄及感染風險判斷。','一般成人自費，特定方案另依政策。',bAction,'schedule');
    // 7. Hep A
    const ah=history(p,'hepa');
    add('hepa','A型肝炎疫苗',checkOr('hepa',riskHepA?'now':'consider'),'一般2劑，間隔6–12個月。',
      riskHepA?'慢性肝病、血友病、器官移植或感染暴露風險會提高接種必要性。':'未具抗體且未曾接種者可與醫師討論自費接種。',
      '一般成人自費；特定政策對象另依公告。',ah==='done'?'已填寫完成2劑接種。':'核對既往疫苗與免疫史；出國者應考慮目的地流行病風險。','schedule');
    // 8. HPV
    if(age<=45) {
      const hp=history(p,'hpv'), primary=age<=26, hpg=checkOr('hpv',primary?'now':eligibleHighRiskHPV?'consider':'consider');
      add('hpv','人類乳突病毒疫苗（HPV）',pregnant&&hp!=='done'?'check':hpg,'19–45歲成人依仿單評估；成人基礎接種通常3劑。',
        primary?'疾管署建議19–26歲成人接種。':eligibleHighRiskHPV?'27–45歲具感染風險者可優先討論接種。':'27–45歲需依感染風險與過去接種史個別決策。',
        '本成人流程不判定公費HPV資格，一般成人多為自費。',pregnant?'懷孕期間建議暫緩HPV疫苗，產後評估。':hp==='done'?'已填寫完成基礎系列。':'疫苗不治療既有HPV感染，接種前須確認年齡、仿單與既往劑次。','schedule');
    }
    // 9. Zoster
    if(age>=50 || immune) {
      const zh=history(p,'zoster'); let za=zh==='done'?'已完成2劑接種。':'重組非活性帶狀疱疹疫苗可在醫師評估後安排；若近期帶狀疱疹發作，建議滿1年且症狀消退後接種。';
      add('zoster','非活性基因重組帶狀疱疹疫苗（RZV）',checkOr('zoster',age>=50?'now':'consider'),'共2劑，常規間隔2–6個月。',
        age>=50?'50歲以上成人建議接種，不論過去是否有帶狀疱疹病史。':'18歲以上免疫不全者可經醫師評估接種。',
        '本成人建議以自費接種為主；地方政府補助另需查詢。',za,'schedule');
    }
    // 10. RSV
    const rsvEligible=age>=75 || age>=60 && age<=74 && rsvRisk || pregnant;
    if(rsvEligible) {
      const sh=history(p,'rsv'), pregWindow=pregnant && gestation>=28 && gestation<=36;
      const inWindow=age>=60 || pregWindow; let sg=checkOr('rsv',inWindow?'consider':'check');
      add('rsv','呼吸道細胞融合病毒疫苗（RSV）',sg,'經醫師評估自費接種1劑；目前無成人每年重複接種建議。',
        pregnant?`懷孕${gestation||'週數未填'}週：依疾管署建議在28–36週接種，以保護出生後6個月內嬰兒。`:age>=75?'75歲以上成人建議評估RSV疫苗。':'60–74歲合併慢性心肺、肝腎疾病或住機構者屬高風險。',
        '目前屬自費接種建議。',sh==='done'?'已填寫曾接種，請勿預設需再打每年追加劑。':pregnant&&!pregWindow?'目前尚未確認在28–36週窗口，請由產科與接種醫師確認適用週數與產品。':'確認是否已接種RSV疫苗、產品適用年齡／妊娠適應症及禁忌。','rsv');
    }
    // 11. Japanese encephalitis
    if (r('jeExposure') || r('travel') || td('japaneseEncephalitis')) {
      add('je','日本腦炎疫苗',history(p,'je')==='done'?'check':td('japaneseEncephalitis')?'now':'consider','依產品可為活性減毒嵌合型1劑，或Vero細胞不活化疫苗3劑（特殊旅遊時程另評估）。',
        '到日本腦炎感染風險地區、農畜場、病媒蚊高風險環境時考慮接種。',
        '成人通常自費。','依免疫史與暴露地區選擇產品；孕婦或免疫低下者須由旅遊醫學／感染科評估，避免不適用之活性疫苗。', 'schedule');
    }
    // 12. Meningococcal
    if(c('asplenia')||c('complement')||c('hiv')||r('meningExposure')||travelMode) {
      const pilgrimage=tr('meningHajj'), belt=tr('meningBelt')||td('mening');
      add('mening','流行性腦脊髓膜炎疫苗（MenACWY／MenB）',
        checkOr('mening',pilgrimage||belt?'now':'consider'),
        pilgrimage?'朝覲／副朝覲需4價MenACWY疫苗及有效接種證明；結合型疫苗證明自接種滿10日後生效，效期通常5年。':'依風險、血清型、年齡及仿單決定：MenACWY與MenB並非同一疫苗。',
        pilgrimage?'沙烏地阿拉伯朝覲／副朝覲對MenACWY有入境要求。':belt?'前往非洲腦膜炎帶或疫情流行地區，應評估MenACWY。':c('asplenia')||c('complement')||c('hiv')?'無脾、補體缺損或HIV等屬特殊感染高風險。':'一般旅遊不一定需要，須核對目的國、季節、群聚活動與接種史。',
        '成人旅遊醫學門診原則自費，費用與供應依合約院所。',
        pilgrimage?'請確認沙國當年度入境規定、產品與國際預防接種證明書；可於行前2–4週就診。':'依目的國／特殊病史決定疫苗型別與劑次；一般觀光旅行不需一律施打。','meningVax');
    }
    // 13. Mpox
    if(r('mpoxExposure')||td('mpox')) add('mpox','M痘疫苗（Mpox）',checkOr('mpox',r('mpoxExposure')?'now':'consider'),'感染風險族群共2劑，至少間隔4週。',
      r('mpoxExposure')?'依填答屬可能符合暴露前／後預防評估族群。':'使用者手動勾選目的地M痘疫情；僅有當地疫情不代表符合疫苗接種資格，需評估實際暴露方式。',
      '符合疾管署規定的風險與身分者可能公費；須由指定院所確認。',
      '請由指定院所確認是否符合風險定義，以及暴露後時程與既往劑次。','schedule');
    // 14. Rabies
    if(r('animalBite')) {
      add('rabies','狂犬病暴露後緊急評估','urgent','暴露後預防依傷口、動物及接種史評估是否需疫苗與免疫球蛋白。',
        '已填寫近期可能風險動物咬抓傷，應立即就醫，不要等待線上接種建議。','暴露後處置公費與否依當時規定、暴露風險評估。',
        '立即以肥皂和大量清水沖洗傷口約15分鐘，儘速至醫療院所評估狂犬病暴露後處置與破傷風預防。','rabies');
    } else if(r('rabiesOccup')) add('rabies','狂犬病暴露前疫苗','consider','暴露前接種需依最新主管機關建議、產品與風險分層決定劑次。',
      '與動物或野生動物接觸較多的職業／環境。','通常需洽指定院所確認。','可洽旅遊醫學或感染科評估職業暴露前預防與抗體追蹤需求。','rabies');
    // 15. 旅遊專屬四項疫苗：未知接種史仍顯示初步候選項目，不可依國名欄位推定國家法規。
    if(travelMode) {
      const yfRisk=tr('yellow')||td('yellow');
      add('yellow','黃熱病疫苗（Yellow fever）',
        pregnant||immune||age>=60 ? 'check' : yfRisk?'now':'consider',
        '多數旅客若適用為1劑活性減毒疫苗；需接種者應於出發至少10日前施打，國際證明書第10日起生效，通常終身有效。',
        yfRisk?'勾選可能前往黃熱病風險區／疫區轉機或須入境證明，應優先確認接種需求。':'僅部分非洲、拉丁美洲地區有感染風險；也可能因轉機路線而有入境證明要求，非所有出國旅客都需要。',
        '自費；疫苗與國際預防接種證明書須至指定旅遊醫學合約醫院辦理。',
        pregnant||immune||age>=60?'黃熱病為活性疫苗；孕婦、免疫低下者及60歲以上初次接種者應由旅遊醫學專科評估禁忌或風險，必要時討論入境豁免證明。':'查詢目的國入境規定、疫區轉機路線與接種證明要求；需施打者提前預約旅遊醫學門診。',
        'yellowFever');
      add('typhoid','傷寒疫苗（Typhoid）',
        pregnant?'check':tr('typhoid')||td('typhoid')?'now':'consider',
        '臺灣旅遊醫學門診常用之Vi多醣體注射疫苗為1劑，建議至少出發14天前接種；持續暴露可評估每3年追加。',
        tr('typhoid')||td('typhoid')?'旅遊風險或手動查詢的疫情包含傷寒，適合優先討論接種。':'短期一般觀光不一定需要；前往南亞、部分東南亞、非洲及中南美的衛生條件較差地區風險較高。',
        '自費；依旅遊醫學合約院所供應與收費。',
        pregnant?'孕婦應先由旅遊醫學與產科醫師評估接種必要性。':'即使已接種仍須注意飲食飲水安全；依行程與過去接種史確認是否需要。',
        'typhoid');
      add('polio','小兒麻痺疫苗（IPV）',
        tr('polio')||td('polio')?'now':'consider',
        '成人依既往基礎接種史決定補接種；部分高風險國家可要求近期追加1劑IPV／OPV及接種證明。',
        tr('polio')||td('polio')?'旅遊風險或手動查詢的疫情包含小兒麻痺，需由旅遊醫學門診核對時程與入出境證明。':'一般旅遊不需例行追加；前往特定流行國家、長期停留或接種史不完整者應評估。',
        '旅遊醫學門診成人接種原則自費。',
        '不同國家要求可能包括「離境前4週至12個月內」接種；目的國與停留時間應查最新WHO／疾管署公告，勿僅憑本頁判定。',
        'polio');
    }
    // Context alerts
    const alerts=[];
    if(pregnant) alerts.push('懷孕期間MMR、水痘等活性疫苗不可接種；其他疫苗請依妊娠週數和產品仿單評估。');
    if(immune) alerts.push('免疫功能低下／免疫抑制治療可能影響活性疫苗安全性及接種時機；本工具不代替免疫低下個案專用接種計畫。');
    if(r('animalBite')) alerts.unshift('疑似狂犬病風險動物咬抓傷：請立即就醫評估，不可等待例行預防接種。');
    if(travelMode) alerts.push('旅遊疫苗為候選評估項目，不代表四種全部都需要接種。目的國、轉機路線、入境政策及疫情可能變動；請依疾管署國際旅遊處方箋與目的國最新要求核對。');
    if(travelDiseases.length) alerts.push('下列疫情疾病為使用者參考疾管署網站後「手動勾選」，本工具未自動取得或驗證當地疫情；若未勾選，也不代表目的地沒有疫情。');
    if(td('dengue')) alerts.push('登革熱：本工具不會直接推薦一般成人旅客施打登革熱疫苗；以白天及戶外防蚊、清除積水、發病後就醫告知旅遊史為主。');
    if(td('malaria')) alerts.push('瘧疾：一般成人旅客沒有常規適用的瘧疾疫苗，請於行前至旅遊醫學門診依目的地評估抗瘧預防藥物及防蚊。');
    if(td('zika')) alerts.push('茲卡病毒：一般旅客無常規接種疫苗；孕婦或備孕者應特別諮詢行程風險、防蚊及適當的生育規劃。');
    if(td('chikungunya')) alerts.push('屈公病：疫苗可用性、核准適應症會隨地區與產品改變，不能僅憑本工具安排；請加強防蚊並洽旅遊醫學門診。');
    if(td('cholera')) alerts.push('霍亂：以飲水飲食衛生為主；特定高風險行程可洽旅遊醫學門診評估口服疫苗的適用性與供應。');
    if(td('influenza')) alerts.push('旅遊地若有流感疫情，請確認是否已接種當季流感疫苗，並注意呼吸道防護。');
    if(otherEpidemic) alerts.push('另記錄的疫情「'+otherEpidemic+'」未納入自動疫苗判斷；請依疾管署官方建議與旅遊醫學門診評估。');
    if(travelMode && travelDate) {
      const diff=Math.ceil((new Date(travelDate+'T12:00:00')-now)/86400000);
      if(diff<0) alerts.push('填寫的出發日期已過，請更新行程資訊。');
      else if(diff<28) alerts.push(`距離填寫的出發日期約${diff}天，部分旅遊疫苗需提前10–14天以上，建議儘速諮詢旅遊醫學門診。`);
    }
    if(!isPolicyYear) alerts.push('目前日期不在115年度政策預設展示期間：公費資格與接種時間必須重新查核最新版公告。');
    if(birthYear!==null && [19,26,27,45,49,50,55,60,64,65,74,75].includes(age)) alerts.push('目前依出生年份換算為年度年齡，若剛好接近接種年齡門檻，需由醫護人員確認實際生日。');
    if(!p.neverSevereAllergy) alerts.push('施打前仍須告知醫師過敏、過去嚴重不良反應、近期急性疾病及用藥；本頁未完成禁忌症評估。');
    const order = {urgent:0,now:1,check:2,consider:3,done:4};
    for(const v of recs) {
      let category='self';
      if(v.id==='flu') category=isPolicyYear ? (fluElig?'public':'self') : 'check';
      else if(v.id==='covid') category=isPolicyYear ? (covidElig?'public':'self') : 'check';
      else if(v.id==='pneumo') category=pneumococcalPublic?'public':'self';
      else if(v.id==='mmr') category=p.sex==='female' && age<=49 ? 'check':'self';
      else if(v.id==='mpox' || v.id==='rabies') category='check';
      v.fundingType=category;
      v.fundingLabel=category==='public'?'可能符合公費':category==='self'?'自費':'公費資格待確認';
    }
    recs = recs.sort((a,b)=>order[a.group]-order[b.group] || a.title.localeCompare(b.title,'zh-Hant'));
    const counts = Object.fromEntries(['urgent','now','check','consider','done'].map(t=>[t,recs.filter(x=>x.group===t).length]));
    return {age, birthYear, asOf, recs, counts, alerts, policyVersion:'115–116年度（規則檢核：2026-10-12）',
      conditions:conditions.map(x=>CONDITION_LABELS[x]).filter(Boolean),risks:risk.map(x=>RISK_LABELS[x]).filter(Boolean),
      travelDestination:travelDest,travelDate,travelRiskLabels:travelRisk.map(x=>TRAVEL_RISK_LABELS[x]).filter(Boolean),
      travelDiseaseLabels:travelDiseases.map(x=>TRAVEL_DISEASE_LABELS[x]).filter(Boolean),outbreakCheckDate,otherEpidemic,pneumococcalIPD};
  }
  return { evaluate,SOURCES,CONDITION_LABELS,RISK_LABELS,TRAVEL_RISK_LABELS,TRAVEL_DISEASE_LABELS };
});
