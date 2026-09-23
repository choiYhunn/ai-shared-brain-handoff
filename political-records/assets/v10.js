
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const PHOTO={"이재명":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Lee%20Jae%20Myung%20portrait.jpg","윤석열":"https://upload.wikimedia.org/wikipedia/commons/b/bf/South_Korea_President_Yoon_Suk_Yeol_portrait_%28crop%29.jpg","문재인":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/President_Moon_Jae_In.jpg/960px-President_Moon_Jae_In.jpg","한동훈":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Han%20Dong-hoon%27s%20Portrait%20%282025%29.png","안철수":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Ahn%20Cheol-Soo%27s%20Portrait%20%282025%29.png","홍준표":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Hong%20Joon-pyo%2020221125.jpg","김동연":"https://upload.wikimedia.org/wikipedia/commons/c/c8/Kim_Dong-yeon_20230926.jpg","오세훈":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Oh%20Se-hoon%202023.jpg","박근혜":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Park%20Geun-hye%20presidential%20portrait%20%28cropped%29.png","이언주":"https://commons.wikimedia.org/wiki/Special:Redirect/file/%EC%9D%B4%EC%96%B8%EC%A3%BC.png","조경태":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Cho%20Kyoung-tae%2020250203.jpg","김문수":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Kim%20Moon-soo%20%28cropped%29.jpg","박지원":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Park%20Jie-won.jpg","정동영":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Chung%20Dong-young.jpg","유승민":"https://commons.wikimedia.org/wiki/Special:Redirect/file/%EC%9C%A0%EC%8A%B9%EB%AF%BC%202018.png","이낙연":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Lee%20Nak-yon%202020.jpg","추미애":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Choo%20Mi-ae%20ministerial%20portrait.png","나경원":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Na%20Kyung-won%27s%20Portrait%20%282016.12%29.png","이준석":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Lee%20Jun-seok.jpg"};
const META={"이재명":"대통령 · 전 경기도지사","윤석열":"전 대통령 · 전 검찰총장","문재인":"전 대통령","한동훈":"국회의원 · 전 법무부 장관","안철수":"국회의원 · 전 대선후보","홍준표":"전 대구시장 · 전 국회의원","김동연":"정치인 · 전 대선후보","오세훈":"서울시장","박근혜":"전 대통령","이언주":"국회의원","조경태":"국회의원","김문수":"정치인 · 전 경기도지사","박지원":"국회의원 · 전 국정원장","정동영":"국회의원 · 전 통일부 장관","유승민":"전 국회의원","이낙연":"전 국무총리 · 전 민주당 대표","추미애":"정치인 · 전 법무부 장관","나경원":"국회의원","이준석":"국회의원"};
const app={cases:[],events:[],posts:[],members:[],room:"전체",sort:"new",saved:new Set(JSON.parse(localStorage.getItem("sicha10-saved")||"[]")),following:new Set(JSON.parse(localStorage.getItem("sicha10-follow")||"[]")),comments:JSON.parse(localStorage.getItem("sicha10-comments")||"{}"),userPosts:JSON.parse(localStorage.getItem("sicha10-posts")||"[]")};

function allRecords(){return app.events.concat(app.cases)}
function byId(id){return allRecords().find(x=>x.id===id)}
function headline(x){return x.kind==="event"?x.headline:x.headlineA+" → "+x.headlineB}
function summary(x){return x.summary||""}
function short(s,n=105){s=String(s||"");return s.length>n?s.slice(0,n).trim()+"…":s}
function saveLocal(){localStorage.setItem("sicha10-saved",JSON.stringify([...app.saved]));localStorage.setItem("sicha10-follow",JSON.stringify([...app.following]));localStorage.setItem("sicha10-comments",JSON.stringify(app.comments));localStorage.setItem("sicha10-posts",JSON.stringify(app.userPosts))}
function toast(t){$("#toast").textContent=t;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),1300)}
function go(s){$$(".screen").forEach(x=>x.classList.toggle("on",x.id==="screen-"+s));$$(".nav button").forEach(x=>x.classList.toggle("on",x.dataset.nav===s));if(s==="today")renderToday();if(s==="talk")renderTalk();if(s==="people")renderPeople();window.scrollTo(0,0)}
function nowLabel(){const d=new Date(),days=["일","월","화","수","목","금","토"];return (d.getMonth()+1)+"월 "+d.getDate()+"일 "+days[d.getDay()]+"요일"}
function countComments(id){return (app.comments[id]||[]).length+app.posts.filter(p=>p.eventId===id).reduce((n,p)=>n+(p.replies||0),0)}
function status(e){return e.statusLabel||({developing:"진행 중",pending:"결정 대기",proposed:"추진 중",confirmed:"확인됨"}[e.status]||"기록")}
function topToday(){const live=app.events.filter(x=>x.live&&x.feedReady!==false).sort((a,b)=>String(b.lastVerifiedAt||b.date).localeCompare(String(a.lastVerifiedAt||a.date)));const picks=["ahn-2022","lee-immunity","oh-resign"].map(byId).filter(Boolean);return live.concat(picks).slice(0,8)}

/* ── V10.2 rendering: 시차 record/post grammar ─────────────────────────────
   - 기록(시차가 검토한 층)은 전폭 레이아웃, 사용자 글은 아바타 칼럼 레이아웃
   - ● 확인된 것 / ○ 아직 확인 안 된 것 — 배지 대신 점 두 개
   - 인물 사진은 아바타로만. 큰 미디어는 사건 자체의 사진·영상(x.media / x.image)일 때만
   - 선택 필드 x.brief 가 있으면 사용, 없으면 기존 필드로 안전하게 대체 */
const ICON={
  cmt:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.1A8 8 0 1 1 20 12z"/></svg>',
  save:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M6 3.8h12v16.6l-6-4.2-6 4.2z"/></svg>',
  share:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.5 8.5 12 4l4.5 4.5M5 13v6h14v-6"/></svg>',
  more:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/></svg>',
  back:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  heart:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
  ask:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.3-.9.8-.9 1.4v.5M12 16.6v.2"/></svg>',
  cmtS:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.1A8 8 0 1 1 20 12z"/></svg>'
};
const q=s=>"'"+String(s??"").replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"; // onclick 인자용 (esc()와 함께 사용)
const A=s=>esc(q(s));

/* 날짜 */
function parseD(s){const m=String(s||"").match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);return m?new Date(+m[1],+m[2]-1,+m[3]):null}
function fmtD(s){const d=parseD(s);if(!d)return String(s||"");const y=new Date().getFullYear();return (d.getFullYear()!==y?d.getFullYear()+"년 ":"")+(d.getMonth()+1)+"월 "+d.getDate()+"일"}
function fmtShort(s){const d=parseD(s);if(!d)return String(s||"");const y=new Date().getFullYear();return (d.getFullYear()!==y?String(d.getFullYear()).slice(2)+".":"")+(d.getMonth()+1)+"."+d.getDate()}
function gapLabel(a,b){const d1=parseD(a),d2=parseD(b);if(!d1||!d2)return "";const days=Math.round((d2-d1)/864e5);if(days<0)return "";if(days===0)return "같은 날";if(days<45)return days+"일 뒤";const mo=Math.round(days/30.44);if(mo<12)return mo+"개월 뒤";const y=Math.floor(mo/12),r=mo%12;return y+"년"+(r?" "+r+"개월":"")+" 뒤"}
function fmtStamp(s){const d=new Date(s);if(isNaN(d))return "";const p=Object.fromEntries(new Intl.DateTimeFormat("ko-KR",{timeZone:"Asia/Seoul",month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(d).map(o=>[o.type,o.value]));return p.month+"월 "+p.day+"일 "+p.hour+":"+p.minute}

/* 공통 조각 */
function av(name,cls){return '<div class="av'+(cls?" "+cls:"")+'">'+(PHOTO[name]?'<img src="'+PHOTO[name]+'" alt="" loading="lazy" onerror="this.remove()">':"")+'<span>'+esc((name||"?")[0])+'</span></div>'}
function roleOf(x){return x.role||META[x.person]||""}
function isOpen(x){return x.kind==="event"&&["developing","pending","proposed"].includes(x.status)}
function kindWord(x){return x.kind==="event"?"사건 기록":"발언 대조"}
function mediaOf(x){const m=x.media||{};const url=m.url||x.image;if(!url)return null;return {url,type:m.type||"image",poster:m.poster||"",credit:m.credit||"",ratio:m.ratio||""}}
function mediaHTML(x,cls){const m=mediaOf(x);if(!m)return "";const r=m.ratio?' style="--ratio:'+esc(m.ratio.replace(":","/"))+'"':"";const body=m.type==="video"?'<video src="'+esc(m.url)+'"'+(m.poster?' poster="'+esc(m.poster)+'"':"")+' controls playsinline preload="metadata"></video>':'<img src="'+esc(m.url)+'" alt="" loading="lazy">';return '<figure class="'+cls+'"'+r+' style="margin:0">'+body+'</figure>'+(m.credit?'<p class="rp-credit">'+esc(m.credit)+'</p>':"")}
function discoveryMedia(x){const m=mediaHTML(x,"rp-media");if(m)return m;if(x.person&&PHOTO[x.person])return '<figure class="rp-thumb" onclick="openRecord('+A(x.id)+')"><img src="'+esc(PHOTO[x.person])+'" alt="'+esc(x.person)+'" loading="lazy"><span>'+esc(x.person)+'</span></figure>';return ""}

/* 흐름(evidence chain) — brief.chain 우선, 없으면 기존 날짜 필드로만 구성 */
function chainOf(x){
  const b=x.brief||{};
  if(Array.isArray(b.chain)&&b.chain.length)return b.chain.map(c=>({d:c.d||"",k:c.k||c.t||"",t:c.t||c.k||"",done:c.done!==false}));
  if(x.kind!=="event")return [{d:x.beforeDate,k:fmtShort(x.beforeDate),t:x.headlineA,done:true},{d:x.afterDate,k:fmtShort(x.afterDate),t:x.headlineB,done:true}];
  const c=[{d:x.date,k:fmtShort(x.date)+" 첫 기록",t:x.lead,done:true}];
  if(x.outcomeDate&&x.outcome)c.push({d:x.outcomeDate,k:fmtShort(x.outcomeDate)+" 후속",t:x.outcome,done:true});
  if(isOpen(x))c.push({d:"",k:"진행 중",t:status(x),done:false});
  return c;
}
function railHTML(x){
  if(x.kind!=="event"){const g=gapLabel(x.beforeDate,x.afterDate);return '<div class="rail pair"><span class="n">'+esc(fmtShort(x.beforeDate))+'</span><span class="gap">'+(g?'<span>'+esc(g)+'</span>':"")+'</span><span class="n">'+esc(fmtShort(x.afterDate))+'</span></div>'}
  const c=chainOf(x);if(c.length<2)return "";
  const cols=c.length===2?"1fr 1fr":"1fr repeat("+(c.length-2)+",2fr) 1fr";return '<div class="rail"><ol style="grid-template-columns:'+cols+'">'+c.map(s=>'<li class="'+(s.done?"":"o"+(x.live?" hot":""))+'"><i></i>'+esc(s.k)+'</li>').join("")+'</ol></div>';
}

/* ── 오늘 피드 ─────────────────────────── */
function topPost(id){return relatedPosts(id).slice().sort((a,b)=>(b.replies||0)-(a.replies||0))[0]}
function peekHTML(x){const n=countComments(x.id);if(!n)return "";const p=topPost(x.id);return '<button class="peek" onclick="openComments('+A(x.id)+')">'+(p?'<p class="clamp2"><b>'+esc(p.author)+'</b>'+esc(p.title||p.body)+'</p>':"")+'<span>댓글 '+n+'개 모두 보기</span></button>'}
function actsHTML(x){const on=app.saved.has(x.id);return '<div class="acts"><button class="act" aria-label="댓글" onclick="openComments('+A(x.id)+')">'+ICON.cmt+'<span>'+(countComments(x.id)||"")+'</span></button><button class="act'+(on?" on":"")+'" aria-label="저장" aria-pressed="'+on+'" onclick="toggleSave('+A(x.id)+',this)">'+ICON.save+'</button><button class="act" aria-label="공유" onclick="shareRecord('+A(x.id)+')">'+ICON.share+'</button><span class="sp"></span><button class="act rec" onclick="openRecord('+A(x.id)+')">기록 보기</button></div>'}
function headHTML(x){const meta=[roleOf(x),fmtD(x.kind==="event"?x.date:x.afterDate)].filter(Boolean).join(" · ");return '<header class="rp-head">'+av(x.person)+'<div class="rp-who"><b>'+esc(x.person||"기관")+'</b><span>'+esc(meta)+(isOpen(x)&&x.live?' · <span class="live">진행 중</span>':"")+'</span></div><button class="icon-btn" aria-label="더 보기" onclick="moreMenu('+A(x.id)+')">'+ICON.more+'</button></header>'}
function slideDots(n){return n>1?'<div class="story-dots" aria-hidden="true">'+Array.from({length:n},(_,i)=>'<i class="'+(i===0?"on":"")+'"></i>').join("")+'</div>':""}
function storyBg(media,person,cls){
  const m=media, src=m&&m.type!=="video"?m.url:(person&&PHOTO[person]?PHOTO[person]:"");
  return src?'<img class="story-bg '+(cls||"")+'" src="'+esc(src)+'" alt="" loading="lazy"><div class="story-shade"></div>':'<div class="story-fallback"></div>'
}
function storySlide(type,label,title,body,bg,extra){
  return '<section class="story-slide '+type+'">'+bg+(extra||"")+'<div class="story-copy"><small>'+esc(label)+'</small><h3>'+esc(title||"").replace(/\n/g,"<br>")+'</h3>'+(body?'<p>'+esc(body)+'</p>':"")+'</div></section>'
}
function storyCarousel(x){
  const f=x.feed||{},m=mediaOf(x),slides=[],bg1=storyBg(m,x.person,"crop-a"),bg2=storyBg(m,x.person,"crop-b"),bg3=storyBg(m,x.person,"crop-c"),bg4=storyBg(m,x.person,"crop-d");
  slides.push(storySlide("cover","지금 사람들이 보는 포인트",short(f.hook||x.headline,72),"",bg1));
  if(f.context)slides.push(storySlide("context","앞서",short(f.context,84),"",bg2));
  if(f.question)slides.push(storySlide("question","왜 말이 나오나",short(f.question,72),"",bg3));
  const open=f.open||((x.issueFlags||[])[0]||"");
  if(open)slides.push(storySlide("status","확인할 것",short(open,96),"",bg4,'<span class="story-open">○ 확인 중</span>'));
  const n=Math.min(slides.length,5);
  return '<div class="story-wrap"><div class="story-carousel" data-story="'+esc(x.id)+'" onscroll="storyScroll(this)">'+slides.slice(0,n).join("")+'</div>'+slideDots(n)+'</div>'
}
function storyScroll(el){const i=Math.round(el.scrollLeft/Math.max(1,el.clientWidth));const dots=el.parentElement.querySelectorAll(".story-dots i");dots.forEach((d,j)=>d.classList.toggle("on",j===i))}
function eventPost(x){
  return '<article class="rp story-post">'+headHTML(x)+storyCarousel(x)+'<div class="story-caption" onclick="openRecord('+A(x.id)+')"><b>'+esc(short((x.feed||{}).hook||x.headline,56))+'</b><span>기록 보기 ›</span></div>'+actsHTML(x)+peekHTML(x)+'</article>';
}
function quoteOr(t,flag){return flag?"“"+t+"”":t}
function contrastPost(x){
  return '<article class="rp">'+headHTML(x)+discoveryMedia(x)+'<div class="rp-body" onclick="openRecord('+A(x.id)+')">'+railHTML(x)+'<div class="ab"><p><small>그때</small><span class="clamp2">'+esc(short(quoteOr(x.headlineA,x.qa),48))+'</span></p><p><small>이후</small><span class="clamp2">'+esc(short(quoteOr(x.headlineB,x.qb),48))+'</span></p></div>'+(x.summary?'<p class="rp-sum clamp2">'+esc(short(x.summary,64))+'</p>':"")+'</div>'+actsHTML(x)+peekHTML(x)+'</article>';
}
function renderToday(){$("#todayDate").textContent=nowLabel();const list=topToday();$("#todayFeed").innerHTML=list.length?list.map(x=>x.kind==="event"?eventPost(x):contrastPost(x)).join(""):'<div class="empty">아직 올라온 기록이 없어요.</div>'}
function toggleSave(id,b){app.saved.has(id)?app.saved.delete(id):app.saved.add(id);saveLocal();const on=app.saved.has(id);if(b){b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)}toast(on?"저장했어요":"저장에서 뺐어요")}
async function shareRecord(id){const url=location.href.split("#")[0]+"#"+id;try{if(navigator.share){await navigator.share({title:headline(byId(id)||{}),url});return}await navigator.clipboard.writeText(url);toast("링크를 복사했어요")}catch(e){if(e&&e.name==="AbortError")return;toast("주소창 링크를 복사해 주세요")}}

/* ⋯ 메뉴 — 신고는 여기로만 */
function moreMenu(id,postId){$("#asheetIn").innerHTML=(id?'<button onclick="closeMore();shareRecord('+A(id)+')">링크 공유</button>':"")+(id&&!postId?'<button onclick="closeMore();openRecord('+A(id)+')">원문·근거 보기</button>':"")+'<button class="danger" onclick="closeMore();reportContent()">신고</button><button onclick="closeMore()">취소</button>';$("#asheet").classList.add("open")}
function closeMore(){$("#asheet").classList.remove("open")}
function reportContent(){toast("신고가 접수된 것으로 표시했어요")}

/* ── 토론 ─────────────────────────────── */
function rooms(){return [...new Set(["전체","DMZ 지뢰","청와대 인사","불체포특권","2022 대선","정치 언어"].concat(app.posts.map(p=>p.room),app.userPosts.map(p=>p.room)).filter(Boolean))]}
function setRoom(r){app.room=r;renderTalk()}
function setTalkSort(s){app.sort=s;$$("[data-talksort]").forEach(b=>b.classList.toggle("on",b.dataset.talksort===s));renderTalk()}
function embedHTML(p){const x=p.eventId&&byId(p.eventId);if(x)return '<button class="embed" onclick="openRecord('+A(x.id)+')"><small>시차 기록 · '+esc(kindWord(x))+'</small><b class="clamp2">'+esc(headline(x))+'</b></button>';return p.attachment?'<div class="embed"><small>연결된 기록</small><b>'+esc(p.attachment)+'</b></div>':""}
function postCard(p,opt={}){const main=opt.compact?'<p class="tp-text">'+esc(p.body||p.title)+'</p>':'<p class="tp-title">'+esc(p.title)+'</p><p class="tp-text">'+esc(p.body)+'</p>'+embedHTML(p);return '<article class="tp">'+av(p.author||"나")+'<div><div class="tp-meta"><b>'+esc(p.author||"나")+'</b><span>'+esc([opt.compact?"":p.room,p.time||"방금"].filter(Boolean).join(" · "))+'</span>'+(p.demo?'<span>· 예시 글</span>':"")+'<button class="more" aria-label="더 보기" onclick="moreMenu('+A(p.eventId||"")+','+A(p.id||"x")+')">'+ICON.more+'</button></div>'+main+'<div class="tp-acts"><button class="act" onclick="openComments('+A(p.eventId||"")+')">'+ICON.cmtS+(p.replies||"")+'</button><button class="act" onclick="toast(\'공감했어요\')">'+ICON.heart+(p.likes||"")+'</button><button class="act" onclick="toast(\'근거 요청을 남겼어요\')">'+ICON.ask+'근거 요청</button></div></div></article>'}
function renderTalk(){$("#roomStrip").innerHTML=rooms().map(r=>'<button class="'+(app.room===r?"on":"")+'" onclick="setRoom('+A(r)+')">'+esc(r)+'</button>').join("");let p=app.userPosts.concat(app.posts).filter(x=>app.room==="전체"||x.room===app.room);if(app.sort==="reply")p=p.slice().sort((a,b)=>(b.replies||0)-(a.replies||0));$("#postFeed").innerHTML=p.length?p.map(x=>postCard(x)).join(""):'<div class="empty">아직 글이 없어요.</div>'}
function openComposer(_re){if(!_re)pushView("openComposer",[]);$("#sheet").className="sheet";$("#sheet").innerHTML=topBar("새 글")+'<div class="compose"><input id="composeTitle" placeholder="제목"><textarea id="composeBody" placeholder="어떤 점이 궁금하거나 하고 싶은 말이 있나요? 사실을 말할 땐 근거를 붙여 주세요."></textarea><input id="composeRoom" placeholder="이슈 (예: DMZ 지뢰)"><p class="help">게시글과 댓글은 사용자 의견으로 표시되고, 시차가 확인한 기록과 섞이지 않아요.</p><button class="btn" onclick="submitPost()">올리기</button></div>';openSheet()}
function submitPost(){const title=$("#composeTitle").value.trim(),body=$("#composeBody").value.trim(),room=$("#composeRoom").value.trim()||"자유 토론";if(!title||!body){toast("제목과 내용을 써주세요");return}app.userPosts.unshift({id:"u-"+Date.now(),room,author:"나",time:"방금",title,body,replies:0,likes:0});saveLocal();closeSheet();app.room=room;go("talk");toast("글을 올렸어요")}

/* ── 시트 스택 (뒤로 가기가 이전 화면으로) ── */
const STACK=[];
function pushView(fn,args){STACK.push([fn,args]);$("#scrim").scrollTop=0}
function topBar(title,right){return '<div class="sheet-top"><button class="icon-btn" aria-label="뒤로" onclick="sheetBack()">'+ICON.back+'</button><b>'+esc(title)+'</b>'+(right||"")+'</div>'}
function sheetBack(){STACK.pop();const t=STACK[STACK.length-1];if(!t){closeSheet();return}window[t[0]].apply(null,t[1].concat([true]));$("#scrim").scrollTop=0}
function openSheet(){$("#scrim").classList.add("open");document.body.style.overflow="hidden"}
function closeSheet(){$("#scrim").classList.remove("open");document.body.style.overflow="";STACK.length=0}

/* ── 기록 화면 ─────────────────────────── */
function steps(x){return x.kind==="event"?[{d:x.date,t:x.lead},{d:x.outcomeDate,t:x.outcome}].filter(s=>s.t):[{d:x.beforeDate,t:x.before},{d:x.afterDate,t:x.after}]}
function relatedPosts(id){return app.userPosts.concat(app.posts).filter(p=>p.eventId===id)}
function srcHTML(l){const parts=String(l[0]).split(" · ");const outlet=parts.length>1?parts[0]:"";const rest=parts.length>1?parts.slice(1):parts;const date=rest.length>1&&/\d{4}-\d{2}-\d{2}/.test(rest[rest.length-1])?rest.pop():"";return '<a class="src" href="'+esc(l[1])+'" target="_blank" rel="noopener noreferrer">'+(outlet||date?'<b>'+esc([outlet,date].filter(Boolean).join(" · "))+'</b>':"")+'<span>'+esc(rest.join(" · "))+'</span><em>↗</em></a>'}
function tlHTML(items,x){return '<ol class="tl">'+items.map(s=>'<li class="'+(s.done?"":"o"+(x&&x.live?" hot":""))+'"><i></i>'+(s.d?'<time>'+esc(/\d{4}/.test(s.d)?fmtD(s.d):s.d)+'</time>':"")+'<p>'+esc(s.t)+'</p></li>').join("")+'</ol>'}
function openRecord(id,_re){const x=byId(id);if(!x)return;if(!_re)pushView("openRecord",[id]);const b=x.brief||{},rp=relatedPosts(id);let h='<div class="rec"><p class="rec-kind">'+esc(kindWord(x))+' · '+esc(x.person||"")+(roleOf(x)?' · '+esc(roleOf(x)):"")+'</p><h1 class="rec-title">'+esc(headline(x))+'</h1>';
  if(x.kind==="event"){h+='<p class="rec-status"><i class="dot'+(isOpen(x)?" o":"")+'"></i><span>'+esc(status(x))+(x.lastVerifiedAt?' <span class="meta">· '+esc(fmtStamp(x.lastVerifiedAt))+' 확인</span>':"")+'</span></p>'}
  h+=mediaOf(x)?'<div class="rec-media">'+mediaHTML(x,"rp-media")+'</div>':"";
  if(x.kind==="event"){
    if(b.why)h+='<p class="rec-why">'+esc(b.why)+'</p>';
    if(Array.isArray(b.known)&&b.known.length)h+='<section class="sec"><h3>확인된 것</h3><ul class="facts">'+b.known.map(t=>'<li><i class="dot"></i><span>'+esc(t)+'</span></li>').join("")+'</ul></section>';
    if(Array.isArray(b.said)&&b.said.length)h+='<section class="sec"><h3>당사자·기관 설명</h3><ul class="said">'+b.said.map(s=>'<li><b>'+esc(s.who)+'</b>'+(s.d?'<time>'+esc(fmtD(s.d))+'</time>':"")+'<p>'+esc(s.text)+'</p></li>').join("")+'</ul></section>';
    if(Array.isArray(b.open)&&b.open.length)h+='<section class="sec"><h3>아직 확인 안 된 것</h3><ul class="facts">'+b.open.map(t=>'<li><i class="dot o"></i><span>'+esc(t)+'</span></li>').join("")+'</ul></section>';
    else if((x.issueFlags||[]).length)h+='<section class="sec"><h3>쟁점 · 아직 결론 아님</h3><ul class="facts">'+x.issueFlags.map(t=>'<li><i class="dot o"></i><span>'+esc(t)+'</span></li>').join("")+'</ul></section>';
    if(b.chain){h+='<section class="sec"><h3>흐름</h3>'+tlHTML(chainOf(x),x)+'</section><section class="sec full"><h3>기록 전문</h3>'+steps(x).map(s=>'<p><time>'+esc(fmtD(s.d))+'</time>'+esc(s.t)+'</p>').join("")+'</section>'}
    else{const tl=steps(x).map(s=>({d:s.d,t:s.t,done:true}));if(isOpen(x))tl.push({d:"",t:status(x),done:false});h+='<section class="sec"><h3>흐름</h3>'+tlHTML(tl,x)+'</section>'}
  }else{
    const g=gapLabel(x.beforeDate,x.afterDate);
    h+='<div style="margin-top:14px">'+railHTML(x)+'</div><section class="sec ab-full"><div><time class="meta">'+esc(fmtD(x.beforeDate))+' · 그때</time><h4>'+esc(quoteOr(x.headlineA,x.qa))+'</h4><p style="line-height:1.65">'+esc(x.before)+'</p></div><div><time class="meta">'+esc(fmtD(x.afterDate))+(g?' · '+esc(g):"")+'</time><h4>'+esc(quoteOr(x.headlineB,x.qb))+'</h4><p style="line-height:1.65">'+esc(x.after)+'</p></div></section>';
    if(x.summary)h+='<section class="sec"><h3>두 기록 사이</h3><p style="line-height:1.65">'+esc(x.summary)+'</p></section>';
  }
  if(x.kind==="event"&&x.summary&&!b.why)h+='<section class="sec"><h3>이 기록이 다루는 것</h3><p style="line-height:1.65">'+esc(x.summary)+'</p></section>';
  if(x.note)h+='<details class="memo"><summary>편집 메모 · 이 기록을 이렇게 나눈 이유</summary><p>'+esc(x.note)+'</p></details>';
  if((x.links||[]).length)h+='<section class="sec"><h3>원문 '+x.links.length+'</h3><div class="srcs">'+x.links.map(srcHTML).join("")+'</div></section>';
  h+='<button class="go-talk" onclick="openComments('+A(id)+')">이 기록에 대한 댓글<span>'+(countComments(id)?countComments(id)+"개 ›":"첫 댓글 남기기 ›")+'</span></button>';
  if(x.person&&(PHOTO[x.person]||META[x.person]))h+='<button class="go-talk" style="margin-top:0;border-top:0" onclick="openProfile('+A(x.person)+')">'+esc(x.person)+'의 다른 기록<span>›</span></button>';
  h+='</div>';
  $("#sheet").className="sheet";$("#sheet").innerHTML=topBar(kindWord(x),'<button class="icon-btn" aria-label="공유" onclick="shareRecord('+A(id)+')">'+ICON.share+'</button>')+h;openSheet()}

/* ── 댓글 ─────────────────────────────── */
function openComments(id,_re){const x=byId(id);if(!x)return;if(!_re)pushView("openComments",[id]);const seed=relatedPosts(id),local=app.comments[id]||[];const items=seed.map(p=>postCard(p,{compact:true})).join("")+local.map(c=>postCard({author:"나",time:"",body:c,eventId:id,id:"l"},{compact:true})).join("");
  $("#sheet").className="sheet has-bar";$("#sheet").innerHTML=topBar("댓글")+'<div class="cm-embed"><button class="embed" onclick="openRecord('+A(id)+')"><small>시차 기록 · '+esc(kindWord(x))+'</small><b class="clamp2">'+esc(headline(x))+'</b></button></div><p class="cm-head">'+(seed.length+local.length?"의견 "+(seed.length+local.length):"아직 댓글이 없어요")+'</p><div class="cm-list">'+items+'</div><div class="composer-bar"><textarea id="commentInput" rows="1" placeholder="의견 남기기" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'"></textarea><button onclick="addComment('+A(id)+')">게시</button></div>';openSheet()}
function addComment(id){const v=$("#commentInput").value.trim();if(!v)return;app.comments[id]=(app.comments[id]||[]).concat(v);saveLocal();openComments(id,true);toast("댓글을 남겼어요")}

/* ── 인물 ─────────────────────────────── */
function peopleFromRecords(){return [...new Set(allRecords().map(x=>x.person).filter(n=>n&&!n.includes("·")&&!n.includes("당")))]}
function featured(){return ["이재명","윤석열","한동훈","안철수","문재인","오세훈"].filter(n=>peopleFromRecords().includes(n))}
function renderPeople(){$("#peopleFeatured").innerHTML=featured().map(n=>'<button class="face-btn" onclick="openProfile('+A(n)+')">'+av(n,"md")+'<span>'+esc(n)+'</span></button>').join("");$("#peopleFeatured").style.display=featured().length?"":"none";const qv=($("#peopleSearch").value||"").trim().toLowerCase();let list=app.members.length?app.members:peopleFromRecords().map(name=>({name}));list=list.filter(m=>!qv||[m.name,m.party,m.district,m.committee].join(" ").toLowerCase().includes(qv));$("#peopleState").textContent=app.members.length?"현직 의원 "+app.members.length+"명":"기록이 있는 인물 "+list.length+"명";$("#peopleList").innerHTML=list.map((m,i)=>'<button class="row" data-idx="'+i+'">'+av(m.name)+'<div><b>'+esc(m.name)+'</b><span>'+esc([m.party,m.district,m.committee].filter(Boolean).join(" · ")||META[m.name]||"")+'</span></div><em>›</em></button>').join("");[...$("#peopleList").querySelectorAll(".row")].forEach((el,i)=>el.addEventListener("click",()=>openProfile(list[i].name,list[i])))}
async function loadMembers(){try{const r=await fetch("https://korean-eyes.com/api/v1/members",{headers:{Accept:"application/json"}});if(!r.ok)throw 0;const j=await r.json(),raw=Array.isArray(j)?j:(j.members||j.data||j.results||[]);app.members=raw.map(m=>({name:m.name||"",party:m.party||"",district:m.district||"",committee:m.committee||""})).filter(m=>m.name)}catch{app.members=[]}renderPeople()}
function profileRecords(name){return allRecords().filter(x=>x.person===name).sort((a,b)=>String(b.kind==="event"?b.date:b.afterDate).localeCompare(String(a.kind==="event"?a.date:a.afterDate)))}
function profilePosts(name){return app.posts.concat(app.userPosts).filter(p=>p.eventId&&byId(p.eventId)?.person===name)}
function openProfile(name,m,_re){if(m===true){_re=true;m=undefined}m=m||app.members.find(x=>x.name===name)||{};if(!_re)pushView("openProfile",[name,m]);const on=app.following.has(name),rec=profileRecords(name),posts=profilePosts(name);const facts=[m.party,m.district,m.committee].filter(Boolean).join(" · ");
  $("#sheet").className="sheet";$("#sheet").innerHTML=topBar(name)+'<div class="pf"><div class="pf-main">'+av(name,"lg")+'<div><h2>'+esc(name)+'</h2>'+(META[name]?'<p>'+esc(META[name])+'</p>':"")+'</div></div>'+(facts?'<p class="pf-facts">'+esc(facts)+'</p>':"")+'<button class="btn'+(on?" ghost":"")+'" id="followBtn" onclick="toggleFollow('+A(name)+',this)">'+(on?"팔로잉":"팔로우")+'</button></div><div class="pf-tabs"><button class="on" onclick="profileTab('+A(name)+',\'기록\',this)">기록 '+rec.length+'</button><button onclick="profileTab('+A(name)+',\'토론\',this)">토론 '+posts.length+'</button><button onclick="profileTab('+A(name)+',\'의정활동\',this)">의정활동</button></div><div class="pf-body" id="profileContent"></div>';openSheet();profileTab(name,"기록")}
function toggleFollow(n,b){app.following.has(n)?app.following.delete(n):app.following.add(n);saveLocal();const on=app.following.has(n);b.textContent=on?"팔로잉":"팔로우";b.classList.toggle("ghost",on);toast(on?"팔로우했어요. 새 기록이 붙으면 알려드려요":"팔로우를 해제했어요")}
function row(x){return '<button class="hit" onclick="openRecord('+A(x.id)+')"><small>'+esc(kindWord(x))+' · '+esc(x.kind==="event"?fmtD(x.date):fmtD(x.beforeDate)+" → "+fmtD(x.afterDate))+'</small><b>'+esc(headline(x))+'</b></button>'}
function profileTab(name,tab,b){if(tab==="요약")tab="기록";if(tab==="활동")tab="의정활동";if(b){$$(".pf-tabs button").forEach(x=>x.classList.remove("on"));b.classList.add("on")}const rec=profileRecords(name);let h="";
  if(tab==="기록"){if(!rec.length)h='<p class="pf-empty">아직 연결된 기록이 없어요. 공식 기록이 들어오면 날짜순으로 여기에 쌓여요.</p>';else{let yr="";h=rec.map(x=>{const d=x.kind==="event"?x.date:x.afterDate,y=(parseD(d)||{getFullYear:()=>""}).getFullYear();const head=y!==yr?(yr?'</ol>':"")+'<h4>'+esc(y||"날짜 미상")+'</h4><ol class="tl">':"";yr=y;return head+'<li'+(isOpen(x)?' class="o'+(x.live?" hot":"")+'"':"")+'><i></i><button onclick="openRecord('+A(x.id)+')"><time>'+esc(x.kind==="event"?fmtD(x.date):fmtD(x.beforeDate)+" → "+fmtD(x.afterDate))+'<span class="k">'+esc(kindWord(x))+'</span></time><p>'+esc(headline(x))+'</p></button></li>'}).join("")+'</ol>'}}
  else if(tab==="토론"){const posts=profilePosts(name);h=posts.length?posts.map(p=>postCard(p)).join(""):'<p class="pf-empty">아직 이 인물 기록에 달린 글이 없어요.</p>'}
  else h='<p class="pf-empty">법안 발의·표결·회의 발언은 국회 공식 데이터를 연결하면 이 탭에 날짜순으로 붙어요.</p>';
  $("#profileContent").innerHTML=h}

/* ── 검색 · 내 활동 ─────────────────────── */
function openSearch(){$("#searchLayer").classList.add("open");$("#globalSearch").focus();renderSearch("")}
function closeSearch(){$("#searchLayer").classList.remove("open");$("#globalSearch").value=""}
function renderSearch(qs){qs=(qs||"").trim().toLowerCase();if(!qs){$("#searchResults").innerHTML='<div class="empty">인물, 이슈, 발언을 찾아보세요.</div>';return}const rec=allRecords().filter(x=>JSON.stringify(x).toLowerCase().includes(qs)).slice(0,12),ppl=(app.members.length?app.members:peopleFromRecords().map(name=>({name}))).filter(m=>JSON.stringify(m).toLowerCase().includes(qs)).slice(0,8);$("#searchResults").innerHTML=(ppl.length||rec.length)?ppl.map((m,i)=>'<button class="row" data-p="'+i+'">'+av(m.name)+'<div><b>'+esc(m.name)+'</b><span>'+esc(META[m.name]||m.party||"인물")+'</span></div><em>›</em></button>').join("")+rec.map(x=>'<button class="hit" onclick="closeSearch();openRecord('+A(x.id)+')"><small>'+esc(kindWord(x))+' · '+esc(x.person||"")+'</small><b>'+esc(headline(x))+'</b></button>').join(""):'<div class="empty">찾는 결과가 없어요.</div>';[...$("#searchResults").querySelectorAll("[data-p]")].forEach((el,i)=>el.addEventListener("click",()=>{closeSearch();openProfile(ppl[i].name,ppl[i])}))}
function openMy(_re){if(!_re)pushView("openMy",[]);const saved=[...app.saved].map(byId).filter(Boolean),fol=[...app.following];$("#sheet").className="sheet";$("#sheet").innerHTML=topBar("내 활동")+'<div class="my"><h3>팔로우 '+fol.length+'</h3>'+(fol.length?fol.map(n=>'<button class="row" onclick="openProfile('+A(n)+')">'+av(n)+'<div><b>'+esc(n)+'</b><span>'+esc(META[n]||"")+'</span></div><em>›</em></button>').join(""):'<p class="none">팔로우한 인물이 없어요.</p>')+'<h3>저장한 기록 '+saved.length+'</h3>'+(saved.length?saved.map(row).join(""):'<p class="none">저장한 기록이 없어요.</p>')+'</div>';openSheet()}

async function bootstrap(){const names=["cases-v8-1.json","cases-v8-2.json","cases-v8-3.json","events-v8-1.json","events-v8-2.json","events-v8-3.json","events-v8-4.json","events-v8-5.json","events-v8-6.json","events-v8-7.json","events-v8-8.json","events-v8-9.json","events-v8-10.json","events-v8-11.json","events-v8-12.json","events-v8-13.json","events-v8-14.json","events-v8-15.json","events-v8-16.json","events-v8-17.json","events-v8-18.json","events-v8-19.json","events-v8-20.json","events-v8-21.json","events-v8-22.json","events-v8-23.json"];
  const load=n=>fetch("./data/"+n).then(r=>{if(!r.ok)throw new Error(n+" "+r.status);return r.json()});
  const rs=await Promise.allSettled(names.map(load));rs.forEach((r,i)=>{if(r.status==="rejected")console.error(r.reason)});const ds=rs.map(r=>r.status==="fulfilled"&&Array.isArray(r.value)?r.value:[]);
  app.cases=[...ds[0],...ds[1],...ds[2]];app.events=ds.slice(3).flat();
  try{app.posts=await load("community-v10.json")}catch(e){console.error(e);app.posts=[]}
  $("#globalSearch").addEventListener("input",e=>renderSearch(e.target.value));$("#peopleSearch").addEventListener("input",renderPeople);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){if($("#asheet").classList.contains("open"))closeMore();else if($("#scrim").classList.contains("open"))sheetBack()}});
  renderToday();renderTalk();renderPeople();loadMembers();if(location.hash){const id=decodeURIComponent(location.hash.slice(1));if(byId(id))openRecord(id)}}
bootstrap();
