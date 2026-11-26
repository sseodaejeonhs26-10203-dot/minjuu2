// 서버나 외부 라이브러리 없이 실행하는 간단한 안내 서비스입니다.
const $ = id => document.getElementById(id);
// 선택 버튼과 직접 입력은 같은 규칙을 사용합니다.
const rules = [
  [/기침|콧물|코막|재채기|인후|목.{0,3}(아|따가|통증)|귀.{0,4}(아|통증|먹먹)|이명|비염|코피/, '이비인후과', '코·목·귀의 불편함을 상담할 수 있어요.'],
  [/가래|쌕쌕|천명|만성\s*기침|기침.{0,4}(오래|계속)|오래.{0,4}기침/, '호흡기내과', '오래 지속되는 기침이나 가래 등 호흡기 증상을 상담할 수 있어요.'],
  [/복통|배가|배\s*아|소화|설사|구토|속\s*쓰|메스꺼|메슥|변비|더부룩|역류|혈변|검은\s*변/, '소화기내과', '복통·소화불량·배변 변화 등을 상담할 수 있어요. 혈변이나 검은 변은 신속하게 진료를 받으세요.'],
  [/발열|열이|고열|몸살|오한|피로|기운.{0,3}없/, '내과', '발열이나 피로 등 전반적인 몸 상태를 상담할 수 있어요.'],
  [/갈증|목이.{0,3}마|체중.{0,5}(감소|증가|줄|늘)|더위.{0,4}타|추위.{0,4}타/, '내분비대사내과', '지속되는 갈증이나 원인 모를 체중 변화 등을 상담할 수 있어요.'],
  [/피부|가려|두드러기|발진|여드름|아토피|습진|무좀|탈모|머리카락.{0,3}빠/, '피부과', '피부·손발톱·두피의 변화를 상담할 수 있어요.'],
  [/허리|관절|무릎|발목|어깨|손목|삐었|삐끗|골절|목.{0,3}(뻐근|결림)/, '정형외과', '뼈·관절·근육의 통증이나 다친 부위를 상담할 수 있어요.'],
  [/재활|운동.{0,3}후.{0,3}근육통|자세.{0,3}(불균형|통증)|만성\s*근육통/, '재활의학과', '지속되는 근육 통증이나 움직임·기능 회복을 상담할 수 있어요.'],
  [/눈|충혈|시력|다래끼|안구|시야/, '안과', '눈의 통증·건조함·시력 변화를 상담할 수 있어요. 갑작스러운 시력 저하는 즉시 진료가 필요합니다.'],
  [/치아|잇몸|이빨|치통|시린\s*이|이가.{0,3}(아|시)|턱.{0,3}(통증|아)/, '치과', '치아·잇몸·턱의 불편함을 상담할 수 있어요.'],
  [/두통|머리가.{0,3}(아|지끈)|편두통|어지러|어지럼|저림|저려|손.{0,3}떨/, '신경과', '두통·어지럼·손발 저림 등을 상담할 수 있어요. 갑작스러운 마비나 말하기 어려움은 응급 안내를 먼저 확인하세요.'],
  [/생리|질염|월경|질\s*분비물|부정\s*출혈|임신/, '산부인과', '월경·질 분비물 변화·임신 관련 불편함을 상담할 수 있어요.'],
  [/소변|배뇨|혈뇨|빈뇨|잔뇨|요실금|고환/, '비뇨의학과', '배뇨 통증·빈뇨·혈뇨 등 비뇨기 증상을 상담할 수 있어요.'],
  [/불안|우울|불면|잠이|잠을.{0,3}못|공황|스트레스/, '정신건강의학과', '마음의 어려움이나 수면 문제를 상담할 수 있어요.'],
  [/상처|찰과상|화상|멍울|혹이|치질|항문/, '외과', '상처·화상·멍울·항문 불편함을 상담할 수 있어요. 넓거나 깊은 화상, 멈추지 않는 출혈은 응급 진료가 필요합니다.'],
  [/(아이|아기|영아|유아|어린이|소아).{0,15}(열|기침|설사|발진|성장)|성장.{0,4}(상담|지연)/, '소아청소년과', '아이의 발열·기침·소화 증상과 성장 문제를 상담할 수 있어요. 생후 3개월 미만의 발열은 즉시 의료진의 평가를 받으세요.']
];
const symptomGroups = [
  ['코 · 목 · 귀 · 호흡기', ['기침, 콧물', '코막힘, 재채기', '목이 아파요', '귀 통증', '이명, 귀 먹먹함', '가래, 만성 기침']],
  ['배 · 소화 · 전신', ['복통, 소화불량', '속 쓰림, 역류', '설사', '구토, 메스꺼움', '변비, 더부룩함', '발열, 몸살', '피로, 기운이 없어요', '지속되는 갈증', '이유 없는 체중 감소']],
  ['피부 · 두피 · 상처', ['피부 가려움', '두드러기, 발진', '여드름', '습진, 아토피', '무좀', '탈모', '상처, 찰과상', '가벼운 화상', '피부 아래 멍울']],
  ['뼈 · 관절 · 신경', ['허리 통증', '무릎, 관절 통증', '어깨, 목 뻐근함', '손목 통증', '발목을 삐었어요', '만성 근육통, 재활', '두통', '어지러움', '손발 저림']],
  ['눈 · 치아', ['눈 충혈', '눈 건조함', '다래끼', '시력이 흐려요', '치통', '잇몸 부음', '시린 이', '턱 통증']],
  ['배뇨 · 여성 건강 · 항문', ['소변 볼 때 통증', '빈뇨, 잔뇨감', '혈뇨', '생리통', '생리 불규칙', '질 분비물 변화', '치질, 항문 통증']],
  ['마음 · 수면 · 어린이', ['불안', '우울감', '불면, 잠이 안 와요', '공황, 스트레스', '아이 발열', '아이 기침', '아이 설사', '아이 성장 상담']]
];
const emergency = /가슴.{0,6}(통증|아|답답)|흉통|호흡.{0,3}곤란|숨.{0,8}(차|못|어려|힘)|의식.{0,3}(저하|없)|마비|갑자기.{0,8}(심한|극심한).{0,4}(두통|머리)|말.{0,4}어눌|출혈.{0,5}(안\s*멈|멈추지)|피가.{0,5}(안\s*멈|멈추지)|갑자기.{0,8}(안\s*보|보이지|시력|시야)/;
function findRecommendations(value) {
  const matches = rules.filter(([pattern]) => pattern.test(value));
  // 어린이임을 명시하면 성인 세부 진료과보다 소아청소년과에서 먼저 상담합니다.
  return matches.some(rule => rule[1] === '소아청소년과') ? matches.filter(rule => rule[1] === '소아청소년과') : matches;
}
const departmentSelect = $('department');
[...new Set(rules.map(rule => rule[1]))].forEach(department => {
  const option = document.createElement('option');
  option.textContent = department;
  departmentSelect.append(option);
});
symptomGroups.forEach(([name, symptoms], index) => {
  const group = document.createElement('details');
  group.className = 'symptom-group';
  group.open = index === 0;
  const heading = document.createElement('summary');
  heading.textContent = `${name} (${symptoms.length})`;
  const chips = document.createElement('div');
  chips.className = 'chips';
  symptoms.forEach(symptom => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.symptom = symptom;
    button.textContent = symptom;
    chips.append(button);
  });
  group.append(heading, chips);
  $('symptom-groups').append(group);
});
document.querySelectorAll('[data-symptom]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    $('symptom').value = button.dataset.symptom;
    $('symptom').setCustomValidity('');
    $('recommendation').hidden = true;
    document.querySelectorAll('[data-symptom]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    $('symptom').focus();
  });
});
$('symptom-form').addEventListener('submit', event => {
  event.preventDefault();
  const value = $('symptom').value.trim();
  if (!value) { $('symptom').setCustomValidity('증상을 입력해주세요.'); $('symptom').reportValidity(); return; }
  const result = $('recommendation');
  result.hidden = false;
  result.classList.toggle('urgent', emergency.test(value));
  result.replaceChildren();
  const title = document.createElement('strong');
  const description = document.createElement('p');
  if (emergency.test(value)) {
    title.textContent = '응급 증상인지 먼저 확인해주세요';
    description.textContent = '입력한 내용에 응급 관련 표현이 있습니다. 현재 갑작스럽거나 심한 증상이 있다면 즉시 119에 도움을 요청하세요. 이 도구로 응급 여부를 판단할 수 없습니다.';
    const call = document.createElement('a'); call.href = 'tel:119'; call.textContent = '119 전화하기';
    result.append(title, description, call);
    return;
  }
  const matches = findRecommendations(value);
  const departments = [...new Set(matches.map(rule => rule[1]))];
  title.textContent = departments.length ? `상담해볼 진료과: ${departments.join(', ')}` : '먼저 가정의학과에서 상담해보세요';
  description.textContent = matches.length ? matches.map(rule => rule[2]).join(' ') : '어느 과인지 확실하지 않으면 가정의학과에서 전반적인 상담을 받을 수 있어요.';
  $('department').value = departments.length === 1 ? departments[0] : '가정의학과';
  result.append(title, description);
  if (departments.length > 1) {
    const hint = document.createElement('p');
    hint.textContent = '병원 검색에 사용할 진료과를 고르세요. 여러 증상을 함께 상담하려면 가정의학과에서도 먼저 진료받을 수 있어요.';
    const choices = document.createElement('div'); choices.className = 'chips department-choices';
    [...departments, '가정의학과'].forEach(department => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = department;
      button.setAttribute('aria-pressed', String(department === $('department').value));
      button.addEventListener('click', () => {
        $('department').value = department;
        choices.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      });
      choices.append(button);
    });
    result.append(hint, choices);
  }
});
$('symptom').addEventListener('input', () => {
  $('symptom').setCustomValidity('');
  $('recommendation').hidden = true;
  document.querySelectorAll('[data-symptom]').forEach(item => item.setAttribute('aria-pressed', 'false'));
});
let coordinates = null;
$('area').addEventListener('input', () => { coordinates = null; $('location-status').textContent = '입력한 지역으로 검색합니다.'; });
$('locate').addEventListener('click', () => {
  if (!navigator.geolocation) { $('location-status').textContent = '위치 기능을 사용할 수 없어요. 지역을 직접 입력해주세요.'; return; }
  $('locate').disabled = true;
  $('location-status').textContent = '위치 확인 중입니다. 브라우저의 위치 사용 요청을 확인해주세요.';
  navigator.geolocation.getCurrentPosition(position => {
    coordinates = `${position.coords.latitude},${position.coords.longitude}`;
    $('area').value = '';
    $('location-status').textContent = '현재 위치를 확인했어요. 병원 검색 시 좌표가 Google 지도에 전달됩니다.';
    $('locate').disabled = false;
  }, () => {
    coordinates = null;
    $('location-status').textContent = '위치를 확인하지 못했어요. 지역을 직접 입력해주세요.';
    $('locate').disabled = false;
  }, {timeout: 10000, maximumAge: 60000});
});
$('hospital-form').addEventListener('submit', event => {
  event.preventDefault();
  const area = $('area').value.trim();
  if (!area && !coordinates) { $('hospital-status').textContent = '지역을 입력하거나 내 위치를 확인해주세요.'; $('area').focus(); return; }
  const query = coordinates ? `${$('department').value} near ${coordinates}` : `${area} ${$('department').value}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  // 새 창이 차단되어도 링크를 눌러 검색할 수 있습니다.
  $('hospital-status').replaceChildren();
  const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = '검색한 병원 지도와 목록 다시 열기';
  $('hospital-status').append(link);
  window.open(url, '_blank', 'noopener,noreferrer');
});
const benefits = [
  {types:['low'], title:'의료급여 · 의료비 부담 상담', text:'소득이 적어 의료비가 부담된다면 의료급여 등 지원 가능 여부를 주민센터나 129에서 상담해보세요.', url:'https://www.bokjiro.go.kr/', source:'복지로에서 제도 찾기'},
  {types:['low','urgent'], title:'긴급복지 의료지원', text:'갑작스러운 위기 상황으로 치료비 마련이 어렵다면 긴급 의료지원에 대해 상담해보세요.', url:'https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003179&wlfareInfoReldBztpCd=01', source:'복지로 공식 안내'},
  {types:['large','low'], title:'재난적의료비 지원', text:'가구의 부담 능력에 비해 의료비가 많이 발생했다면 국민건강보험공단에 지원 가능 여부를 문의해보세요.', url:'https://www.nhis.or.kr/static/html/wbma/c/wbmac0222.html', source:'국민건강보험공단 안내'},
  {types:['local'], title:'우리 동네 보건소', text:'보건소별로 진료 항목과 비용·감면 기준이 다릅니다. 방문 전 해당 보건소에 확인해주세요.', url:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('가까운 보건소'), source:'지도에서 보건소 찾기'}
];
function showBenefits() {
  const selected = $('situation').value;
  $('benefits-list').replaceChildren();
  benefits.filter(item => selected === 'all' || item.types.includes(selected)).forEach(item => {
    const card = document.createElement('article'); card.className = 'benefit';
    const title = document.createElement('h3'); title.textContent = item.title;
    const text = document.createElement('p'); text.textContent = item.text;
    const link = document.createElement('a'); link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.source;
    card.append(title, text, link); $('benefits-list').append(card);
  });
}
$('situation').addEventListener('change', showBenefits);
showBenefits();
