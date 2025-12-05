async function loadPublicationsEn() {
    try {
        const response = await fetch("data/publications.json");
        const data = await response.json();

        /* ========== Journal Articles ========== */
        const journalContainer = document.getElementById("journal-container");
        const journal = (data.journal || []).slice();

        // 年ごとにグループ化
        const journalByYear = {};
        journal.forEach(pub => {
            let year = pub.year;
            if (!year && pub.date && pub.date.length >= 4) {
                year = parseInt(pub.date.slice(0, 4), 10);
            }
            year = year || "Others";
            if (!journalByYear[year]) {
                journalByYear[year] = [];
            }
            journalByYear[year].push(pub);
        });

        // 年を降順ソート
        const journalYears = Object.keys(journalByYear).sort((a, b) => {
            const na = parseInt(a, 10) || 0;
            const nb = parseInt(b, 10) || 0;
            return nb - na;
        });
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
                const date = pub.date ? ` (${pub.date})` : "";

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
                    <div class="pub-title"><strong>${pub.title_en}</strong></div>
                    <div class="pub-authors">${pub.authors_en}</div>
                    <div class="pub-journal">${journalHtml}</div>
                `;
                ul.appendChild(li);
            });

            yearBlock.appendChild(ul);
            journalContainer.appendChild(yearBlock);
        });

		/* ========== Conference Presentations ========== */
		const allPres = (data.presentations || []).slice();

		const intlPres = allPres.filter(p => p.type === "international");
		const domesticPres = allPres.filter(p => p.type === "domestic");

		function renderConferenceSectionEn(containerId, items) {
			const container = document.getElementById(containerId);
			if (!container) return;

			const byYear = {};
			items.forEach(p => {
				let year = p.year;
				if (!year && p.date && p.date.length >= 4) {
					year = parseInt(p.date.slice(0, 4), 10);
				}
				year = year || "Others";
				if (!byYear[year]) {
					byYear[year] = [];
				}
				byYear[year].push(p);
			});

			const years = Object.keys(byYear).sort((a, b) => {
				const na = parseInt(a, 10) || 0;
				const nb = parseInt(b, 10) || 0;
				return nb - na; // 降順
			});
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
					const stylePart = p.style_en ? `[${p.style_en}]` : "";
					const numberPart = p.number ? `${p.number}` : "";

					const infoLine = [stylePart, numberPart].filter(Boolean).join(" ");

					const li = document.createElement("li");
					li.innerHTML = `
						<div class="pub-title"><strong>${p.title_en}</strong></div>
						<div class="pub-authors">${p.authors_en}</div>
						<div class="pub-journal">
							${p.conference_en}${dateStr ? " " + dateStr : ""}
							${infoLine ? "<br>" + infoLine : ""}
						</div>
					`;
					ul.appendChild(li);
				});


				yearBlock.appendChild(ul);
				container.appendChild(yearBlock);
			});
		}

		// 実際に描画
		renderConferenceSectionEn("intl-container", intlPres);
		renderConferenceSectionEn("domestic-container", domesticPres);


    } catch (e) {
        console.error("Failed to load publications (EN):", e);
    }
}

loadPublicationsEn();
