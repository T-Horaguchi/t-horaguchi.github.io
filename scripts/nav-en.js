// scripts/nav-en.js

const NAV_ITEMS_EN = [
  { id: "home-en",     href: "index-en.html",    label: "Home" },
  { id: "profile-en",  href: "profile-en.html",  label: "Profile" },
  { id: "research-en", href: "research-en.html", label: "Research" },
  { id: "pubs-en",     href: "publications-en.html", label: "Publications" },
  { id: "contact-en",  href: "contact-en.html",  label: "Contact" },
  { id: "access-en",   href: "access-en.html",   label: "Access" },
  { id: "links-en", href: "links-en.html", label: "Links" },
];

(function () {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  const currentPageId = document.body.dataset.page;

  const ul = document.createElement("ul");

  NAV_ITEMS_EN.forEach(item => {
    const li = document.createElement("li");
    const a  = document.createElement("a");

    a.href = item.href;
    a.textContent = item.label;

    if (item.id === currentPageId) {
      a.classList.add("active");
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
})();
