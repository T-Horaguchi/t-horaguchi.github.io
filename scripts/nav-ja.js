// scripts/nav-ja.js

// ナビの項目一覧（ここだけ直せば全ページに反映される）
const NAV_ITEMS_JA = [
  { id: "home-ja",        href: "index.html",        label: "ホーム" },
  { id: "profile-ja",     href: "profile.html",      label: "プロフィール" },
  { id: "research-ja",    href: "research.html",     label: "研究内容" },
  { id: "pubs-ja",        href: "publications.html", label: "論文・発表リスト" },
  { id: "contact-ja",     href: "contact.html",      label: "連絡先" },
  { id: "access-ja",      href: "access.html",       label: "アクセス" },
  { id: "links-ja", href: "links.html", label: "リンク" },
];

(function () {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  // body の data-page から「このページはどのタブか」を知る
  const currentPageId = document.body.dataset.page;

  const ul = document.createElement("ul");

  NAV_ITEMS_JA.forEach(item => {
    const li = document.createElement("li");
    const a  = document.createElement("a");

    a.href = item.href;
    a.textContent = item.label;

    if (item.id === currentPageId) {
      a.classList.add("active");  // styles.css の .active がそのまま効く
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
})();
