async function loadPublicationsJa() {
    try {
        const response = await fetch("data/publications.json");
        const data = await response.json();

        /* ========== 学術雑誌論文 ========== */
        const journalContainer = document.getElementById("journal-container");
        const journal = (data.journal || []).slice();

        if (journalContainer) {
            const journalByYear = {};
            journal.forEach(pub => {
                let year = pub.year;
                if (!year && pub.date && pub.date.length >= 4) {
                    year = parseInt(pub.date.slice(0, 4), 10);
                }
                year = year || "その他";
                if (!journalByYear[year]) {
                    journalByYear[year] = [];
                }
                journalByYear[year].push(pub);
            });

            const journalYears = Object.keys(journalByYear).sort((a, b) => {
                const na = parseInt(a, 10) || 0;
                const nb = parseInt(b, 10) || 0;
                return nb - na;
            });

            if (journalYears.length > 0) {
                const latestJournalYear = journalYears[0];

                journalYears.forEach(year => {
                    const yearBlock = document.createElement("div");
                    yearBlock.className = "year-block";

                    const h3 = document.createElement("h3");
                    h3.className = "year-heading";
                    h3.textContent = year;
                    if (year === latestJournalYear) {
                        h3.classList.add("latest-year");
                    }
                    yearBlock.appendChild(h3);

                    const ul = document.createElement("ul");
                    ul.className = "publications-list";

                    journalByYear[year].forEach(pub => {
                        const y = pub.year ? pub.year : "";

                        let jText = pub.journal || "";
                        if (pub.volume) {
                            jText += ` <strong>${pub.volume}</strong>`;
                        }
                        if (pub.pages) {
                            jText += `, ${pub.pages}`;
                        }
                        if (y) {
                            jText += ` (${y})`;
                        }

                        let journalHtml;
                        if (pub.url) {
                            journalHtml =
                                `<a href="${pub.url}" target="_blank" rel="noopener noreferrer">${jText}</a>`;
                        } else {
                            journalHtml = jText;
                        }

                        const li = document.createElement("li");
                        li.innerHTML = `
                            <div class="pub-title"><strong>${pub.title_ja}</strong></div>
                            <div class="pub-authors">${pub.authors_ja}</div>
                            <div class="pub-journal">${journalHtml}</div>
                        `;
                        ul.appendChild(li);
                    });

                    yearBlock.appendChild(ul);
                    journalContainer.appendChild(yearBlock);
                });
            }
        } else {
            console.warn("[publications-ja] #journal-container が見つかりません");
        }

        /* ========== 学会発表・講演（国際 / 国内） ========== */
        const allPres = (data.presentations || []).slice();

        const intlPres = allPres.filter(p => (p.type || "").toLowerCase() === "international");
        const domesticPres = allPres.filter(p => (p.type || "").toLowerCase() === "domestic");

        function renderConferenceSectionJa(containerId, items) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`[publications-ja] #${containerId} が見つかりません`);
                return;
            }
            if (!items || items.length === 0) {
                return;
            }

            const byYear = {};
            items.forEach(p => {
                let year = p.year;
                if (!year && p.date && p.date.length >= 4) {
                    year = parseInt(p.date.slice(0, 4), 10);
                }
                year = year || "その他";
                if (!byYear[year]) {
                    byYear[year] = [];
                }
                byYear[year].push(p);
            });

            const years = Object.keys(byYear).sort((a, b) => {
                const na = parseInt(a, 10) || 0;
                const nb = parseInt(b, 10) || 0;
                return nb - na;
            });
            if (years.length === 0) return;

            const latestYear = years[0];

            years.forEach(year => {
                const yearBlock = document.createElement("div");
                yearBlock.className = "year-block";

                const h3 = document.createElement("h3");
                h3.className = "year-heading";
                h3.textContent = year;
                if (year === latestYear) {
                    h3.classList.add("latest-year");
                }
                yearBlock.appendChild(h3);

                const ul = document.createElement("ul");
                ul.className = "publications-list";

			byYear[year].forEach(p => {
				const dateStr   = p.date ? p.date : "";
				const stylePart = p.style_ja ? `[${p.style_ja}]` : "";
				const numberPart = p.number ? ` ${p.number}` : "";

				const infoLine = [stylePart, numberPart].filter(Boolean).join(" ");

				const li = document.createElement("li");
				li.innerHTML = `
					<div class="pub-title"><strong>${p.title_ja}</strong></div>
					<div class="pub-authors">${p.authors_ja}</div>
					<div class="pub-journal">
						${p.conference_ja}${dateStr ? " " + dateStr : ""}
						${infoLine ? "<br>" + infoLine : ""}
					</div>
				`;
				ul.appendChild(li);
			});


                yearBlock.appendChild(ul);
                container.appendChild(yearBlock);
            });
        }

        renderConferenceSectionJa("intl-container", intlPres);
        renderConferenceSectionJa("domestic-container", domesticPres);

    } catch (e) {
        console.error("Failed to load publications (JA):", e);
    }
}

loadPublicationsJa();
