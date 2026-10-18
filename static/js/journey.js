/* Activities remains the source of dates, descriptions and photos.
   Add <!-- place:city-id --> to an activity when its city is not in the text. */
(() => {
    'use strict';
    const PLACES = [
        ['changji', 'Changji', 'China', 87.3082, 44.0112, /\bin Changji\b/i],
        ['suzhou', 'Suzhou', 'China', 120.5853, 31.2989, /\bin Suzhou\b/i],
        ['bangkok', 'Bangkok', 'Thailand', 100.5018, 13.7563, /\bin Bangkok\b/i],
        ['malmo', 'Malmö', 'Sweden', 13.0038, 55.605, /Malmö|Malmo/i],
        ['washington', 'Washington, D.C.', 'United States', -77.0369, 38.9072, /Washington,\s*D\.?C\.?/i],
        ['changsha', 'Changsha', 'China', 112.9388, 28.2282, /\bin Changsha\b/i],
        ['hong-kong', 'Hong Kong', 'China', 114.1694, 22.3193, /\bin Hong Kong\b/i],
        ['beijing', 'Beijing', 'China', 116.4074, 39.9042, /\bin Beijing\b/i],
        ['daejeon', 'Daejeon', 'South Korea', 127.3845, 36.3504, /\bin Daejeon\b/i],
        ['cixi', 'Cixi', 'China', 121.2666, 30.1697, /\bin Cixi\b/i],
        ['salt-lake-city', 'Salt Lake City', 'United States', -111.891, 40.7608, /\bin Salt Lake City\b/i],
        ['brisbane', 'Brisbane', 'Australia', 153.0251, -27.4698, /\bin Brisbane\b/i],
        ['honolulu', 'Honolulu', 'United States', -157.8583, 21.3069, /\bin Honolulu\b/i],
        ['singapore', 'Singapore', 'Singapore', 103.8198, 1.3521, /\bin Singapore\b|Nanyang Technological University/i],
        ['kyoto', 'Kyoto', 'Japan', 135.7681, 35.0116, /\bin Kyoto\b/i],
        ['glasgow', 'Glasgow', 'United Kingdom', -4.2518, 55.8642, /\bin Glasgow\b/i],
        ['nanjing', 'Nanjing', 'China', 118.7969, 32.0603, /\bin Nanjing\b/i],
        ['sanya', 'Sanya', 'China', 109.5119, 18.2528, /\bin Sanya\b/i],
        ['xiamen', 'Xiamen', 'China', 118.0894, 24.4798, /\bin Xiamen\b/i],
        ['huairou', 'Huairou · Beijing', 'China', 116.6319, 40.316, /\bin Huairou\b/i],
        ['seoul', 'Seoul', 'South Korea', 126.978, 37.5665, /\bin Seoul\b/i]
    ].map(([id, city, country, lon, lat, pattern]) => ({ id, city, country, coords: [lon, lat], pattern }));
    const $ = (s, el = document) => el.querySelector(s);
    const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const safeLink = href => /^(https?:\/\/|contents\/)/.test(href || '');
    const dateLabel = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
    const shortTitle = text => {
        if (/Smart Health and Intelligent Medicine/.test(text)) return 'Smart Health & Intelligent Medicine';
        if (/Graduate Academic Forum/.test(text)) return 'Graduate Academic Forum';
        if (/Beijing Radiology Quality Control Conference/.test(text)) return 'Radiology Quality Control';
        if (/AI Health Summit 2023/.test(text)) return 'AI Health Summit 2023';
        if (/Beijing-Tsinghua Health AI Summit/.test(text)) return 'BEIHAI Summit';
        if (/Presented our work to Rupa Sarkar/.test(text)) return 'Discussion with Rupa Sarkar';
        if (/Center for Biomedical Imaging Research/.test(text)) return 'CBIR Annual Retreat';
        if (/BME 2026/.test(text)) return 'BME 2026';
        const match = text.match(/\b(ECCV|MICCAI|MIDL|OHBM|ISMRM|ICLR|BMVC|ICASSP|OCSMRM|MICS|AIM|CASFIS|CCR|IEEE ASYNC|ISICDM)\b(?:\s+(20\d{2}))?/);
        if (match) return match[0];
        if (/Nanyang Technological University/.test(text)) return 'Visit to NTU';
        return text.replace(/^(Attended|Presented|Won|Reached)\s+(the\s+)?/i, '').split(/[.;]/)[0];
    };
    function parseActivities(raw) {
        return raw.split('\n').flatMap((line, i) => {
            const match = line.match(/^-\s+\*(\d{4})\.(\d{2})\.(\d{2})\*,\s*(.*)/);
            if (!match) return [];
            const holder = document.createElement('div');
            holder.innerHTML = marked.parseInline(match[4]);
            const explicit = line.match(/<!--\s*place:([a-z-]+)\s*-->/)?.[1];
            const place = PLACES.find(p => p.id === explicit) || PLACES.find(p => p.pattern.test(holder.textContent));
            const links = [...holder.querySelectorAll('a')].filter(a => safeLink(a.getAttribute('href'))).map(a => ({ label: a.textContent, href: a.getAttribute('href') }));
            holder.querySelectorAll('a').forEach(a => { if (/^(Photo|Poster)(\s|$)/i.test(a.textContent)) a.remove(); });
            const text = holder.textContent.replace(/\s+/g, ' ').trim();
            return [{ id: `activity-${i}`, sourceIndex: i, date: `${match[1]}-${match[2]}-${match[3]}`, year: match[1], text, title: shortTitle(text), links, photo: links.find(l => /\.(jpe?g|png|webp)$/i.test(l.href))?.href, place }];
        }).sort((a, b) => a.date.localeCompare(b.date) || a.sourceIndex - b.sourceIndex);
    }
    function loadScript(src, ready) {
        if (ready()) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src; script.onload = resolve; script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    async function start(raw) {
        const root = $('#activity-journey');
        if (!root || root.dataset.started) return;
        root.dataset.started = 'true';
        try {
            await Promise.all([
                loadScript('static/vendor/d3.v7.min.js', () => !!window.d3),
                loadScript('static/vendor/topojson-client.v3.min.js', () => !!window.topojson)
            ]);
            const response = await fetch('static/data/world-land-110m.json');
            if (!response.ok) throw new Error('Map data unavailable');
            // Keeping the topology local avoids third-party tile requests.
            const topology = await response.json();
            init(root, parseActivities(raw), topojson.feature(topology, topology.objects.land));
        } catch (error) {
            root.innerHTML = '<p class="journey-unavailable">The map could not load. Explore the complete activity history below.</p>';
            console.warn('Activity map:', error);
        }
    }
    function init(root, allEvents, land) {
        if (!allEvents.length) {
            root.innerHTML = '<p class="journey-unavailable">The activity atlas will appear when dated activities are available.</p>';
            root.dataset.ready = 'true';
            return;
        }
        let events = [], year = 'all', index = 0, playing = false, timer;
        let transform = d3.zoomIdentity;
        const width = 760, height = 390;
        const projection = d3.geoNaturalEarth1().rotate([-85, 0]).fitExtent([[16, 8], [width - 16, height - 6]], { type: 'Sphere' });
        const path = d3.geoPath(projection);
        const years = [...new Set(allEvents.map(e => e.year))].sort().reverse();
        root.innerHTML = `
            <div class="journey-heading">
                <div><span class="journey-eyebrow">FIELD NOTES · ${years.at(-1)}—${years[0]}</span><h3>A journey in research.</h3><p>Places, people, and ideas along the way.</p></div>
                <div class="journey-years" role="group" aria-label="Filter activities by year">${['all', ...years].map(y => `<button type="button" data-year="${y}" aria-pressed="${y === 'all'}">${y === 'all' ? 'All years' : y}</button>`).join('')}</div>
            </div>
            <div class="journey-body">
                <div class="journey-map-wrap">
                    <div class="journey-map-toolbar"><div role="group" aria-label="Map region"><button type="button" class="is-active" data-region="world">World</button><button type="button" data-region="asia">East Asia</button></div><span class="journey-map-hint">Select a place to explore</span><select class="journey-place-select" aria-label="Select an activity place"></select></div>
                    <svg class="journey-map" viewBox="0 0 ${width} ${height}" role="group" aria-label="Interactive map of research activities"><title>Research activities around the world</title></svg>
                    <div class="journey-map-bottom"><span><i></i> Activity locations <em>—</em> Chronological connections</span><div class="journey-zoom" role="group" aria-label="Zoom map"><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="out" aria-label="Zoom out">−</button></div></div>
                </div>
                <aside class="journey-detail" aria-label="Selected activity" aria-live="polite" aria-atomic="true"></aside>
            </div>
            <div class="journey-timeline"><button type="button" class="journey-play" aria-label="Play journey" aria-pressed="false"><span>▶</span></button><div class="journey-scrubber"><div class="journey-date-range"><span></span><span></span></div><input type="range" min="0" value="0" aria-label="Activity timeline"><div class="journey-ticks"></div></div><div class="journey-step"><button type="button" data-step="-1" aria-label="Previous activity">←</button><span></span><button type="button" data-step="1" aria-label="Next activity">→</button></div></div>
            <div class="journey-footer"><span class="journey-count"></span><span class="journey-source-note"></span></div>
            <details class="journey-unmapped"><summary></summary><ul></ul></details>
            <div class="journey-credit">Map: Natural Earth · <a href="https://deerflow.tech" target="_blank" rel="noopener">Created By Deerflow</a></div>`;
        const svg = d3.select($('.journey-map', root));
        const scene = svg.append('g');
        scene.append('path').datum(d3.geoGraticule10()).attr('d', path).attr('class', 'journey-graticule');
        scene.append('path').datum(land).attr('d', path).attr('class', 'journey-land');
        const routes = scene.append('g').attr('class', 'journey-routes');
        const markers = scene.append('g').attr('class', 'journey-markers');
        const labels = scene.append('g').attr('class', 'journey-labels').attr('aria-hidden', 'true');
        const zoom = d3.zoom().scaleExtent([1, 7]).translateExtent([[-width, -height], [width * 2, height * 2]])
            .filter(e => !e.ctrlKey && e.type !== 'wheel' && (!e.button || e.type === 'touchstart'))
            .on('zoom', e => { transform = e.transform; scene.attr('transform', transform); updateMarkerScale(); renderLabels(); });
        svg.call(zoom).on('dblclick.zoom', null);
        const pixelFactor = () => width / (svg.node().getBoundingClientRect().width || width);
        $('.journey-place-select', root).addEventListener('change', e => {
            const place = PLACES.find(p => p.id === e.target.value);
            if (place) { stop(); selectPlace(place); }
        });
        new ResizeObserver(() => { updateMarkerScale(); renderLabels(); }).observe(svg.node());
        $('.journey-years', root).addEventListener('click', e => {
            const btn = e.target.closest('[data-year]'); if (!btn) return;
            stop(); year = btn.dataset.year; filter();
        });
        root.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => { stop(); select(index + Number(btn.dataset.step)); }));
        $('.journey-play', root).addEventListener('click', () => {
            if (playing) { stop(); return; }
            if (index === events.length - 1) select(0);
            playing = true; setPlay();
            timer = setInterval(() => { if (index >= events.length - 1) stop(); else select(index + 1); }, 1700);
        });
        $('.journey-scrubber input', root).addEventListener('input', e => { stop(); select(Number(e.target.value)); });
        root.querySelectorAll('[data-zoom]').forEach(btn => btn.addEventListener('click', () => svg.transition().duration(300).call(zoom.scaleBy, btn.dataset.zoom === 'in' ? 1.5 : 1 / 1.5)));
        root.querySelectorAll('[data-region]').forEach(btn => btn.addEventListener('click', () => {
            const asia = btn.dataset.region === 'asia';
            root.querySelectorAll('[data-region]').forEach(b => b.classList.toggle('is-active', b === btn));
            const p = projection([117, 30]), k = 3.7;
            svg.transition().duration(matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600).call(zoom.transform, asia ? d3.zoomIdentity.translate(width / 2 - k * p[0], height / 2 - k * p[1]).scale(k) : d3.zoomIdentity);
        }));
        document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
        new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }).observe(root);
        function stop() { clearInterval(timer); playing = false; setPlay(); }
        function setPlay() {
            const btn = $('.journey-play', root);
            btn.setAttribute('aria-pressed', String(playing)); btn.setAttribute('aria-label', playing ? 'Pause journey' : 'Play journey');
            btn.innerHTML = `<span>${playing ? 'Ⅱ' : '▶'}</span>`;
        }
        function filter() {
            const inYear = allEvents.filter(e => year === 'all' || e.year === year);
            events = inYear.filter(e => e.place);
            root.querySelectorAll('[data-year]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.year === year)));
            const cities = new Set(events.map(e => e.place.id)).size;
            const countries = new Set(events.map(e => e.place.country)).size;
            $('.journey-count', root).innerHTML = `<b>${cities}</b> places <span>·</span> <b>${countries}</b> countries <span>·</span> <b>${events.length}</b> mapped activities`;
            const missing = inYear.filter(e => !e.place);
            $('.journey-source-note', root).textContent = 'From the Activities archive';
            const unresolved = $('.journey-unmapped', root);
            unresolved.hidden = !missing.length;
            $('summary', unresolved).textContent = `${missing.length} ${missing.length === 1 ? 'activity needs' : 'activities need'} a city to appear on the map`;
            $('ul', unresolved).innerHTML = missing.map(e => `<li><time>${escape(dateLabel(e.date))}</time> ${escape(e.text)}</li>`).join('');
            const slider = $('.journey-scrubber input', root); slider.max = Math.max(0, events.length - 1);
            slider.disabled = !events.length;
            $('.journey-play', root).disabled = events.length < 2;
            $('.journey-date-range', root).innerHTML = events.length ? `<span>${dateLabel(events[0].date)}</span><span>${dateLabel(events.at(-1).date)}</span>` : '<span>No mapped activities this year</span>';
            $('.journey-ticks', root).innerHTML = [...new Set(events.map(e => e.year))].map(y => {
                const position = events.length > 1 ? events.findIndex(e => e.year === y) / (events.length - 1) * 100 : 0;
                return `<span style="left:${position}%">${y}</span>`;
            }).join('');
            $('.journey-place-select', root).innerHTML = [...new Map(events.map(e => [e.place.id, e.place])).values()].sort((a,b) => a.city.localeCompare(b.city)).map(p => `<option value="${p.id}">${escape(p.city)}</option>`).join('');
            index = Math.max(0, events.length - 1); select(index);
        }
        function select(next) {
            index = Math.max(0, Math.min(events.length - 1, next));
            const event = events[index];
            $('.journey-scrubber input', root).value = index;
            $('.journey-scrubber input', root).style.setProperty('--progress', `${events.length > 1 ? index / (events.length - 1) * 100 : 0}%`);
            $('.journey-step span', root).textContent = events.length ? `${String(index + 1).padStart(2, '0')} / ${String(events.length).padStart(2, '0')}` : '0 / 0';
            root.querySelectorAll('[data-step]').forEach(b => b.disabled = !events.length || (b.dataset.step === '-1' ? index === 0 : index === events.length - 1));
            if (!event) { $('.journey-detail', root).innerHTML = '<p>No activity with a confirmed location in this year.</p>'; routes.selectAll('*').remove(); markers.selectAll('*').remove(); labels.selectAll('*').remove(); return; }
            $('.journey-place-select', root).value = event.place.id;
            const [sx, sy] = transform.apply(projection(event.place.coords));
            if (sx < 24 || sx > width - 24 || sy < 24 || sy > height - 24) {
                svg.interrupt().call(zoom.transform, d3.zoomIdentity);
                root.querySelectorAll('[data-region]').forEach(b => b.classList.toggle('is-active', b.dataset.region === 'world'));
            }
            const detail = $('.journey-detail', root);
            detail.innerHTML = `${event.photo ? `<a class="journey-photo" href="${escape(event.photo)}" target="_blank" rel="noopener"><img src="${escape(event.photo)}" alt="${escape(event.title)} activity photo" loading="lazy"><span>View photo ↗</span></a>` : '<div class="journey-photo-placeholder" aria-hidden="true">FIELD NOTES</div>'}<div class="journey-detail-copy" tabindex="0" role="region" aria-label="Activity details"><time datetime="${event.date}">${dateLabel(event.date)}</time><h4>${escape(event.place.city)}</h4><span class="journey-country">${escape(event.place.country)}</span><h5>${escape(event.title)}</h5><p>${escape(event.text)}</p><div class="journey-detail-links">${event.links.map(l => `<a href="${escape(l.href)}" target="_blank" rel="noopener">${escape(l.label)} ↗</a>`).join('')}</div></div>`;
            detail.querySelector('img')?.addEventListener('error', e => { e.target.closest('.journey-photo').hidden = true; });
            renderMap();
        }
        function renderMap() {
            const segments = events.slice(1).map((event, i) => ({ from: events[i], to: event, n: i + 1 })).filter(s => s.from.place.id !== s.to.place.id);
            routes.selectAll('path').data(segments).join('path')
                .attr('d', s => path({ type: 'LineString', coordinates: [s.from.place.coords, s.to.place.coords] }))
                .attr('class', s => `journey-route${s.n <= index ? ' is-travelled' : ''}${s.n === index ? ' is-current' : ''}`);
            const places = [...new Map(events.map(e => [e.place.id, e.place])).values()];
            const nodes = markers.selectAll('g').data(places, p => p.id).join(enter => {
                const g = enter.append('g').attr('tabindex', 0).attr('role', 'button').attr('class', 'journey-marker');
                g.append('circle').attr('class', 'journey-marker-hit').attr('r', 14);
                g.append('circle').attr('class', 'journey-marker-halo').attr('r', 10);
                g.append('circle').attr('class', 'journey-marker-dot').attr('r', 4);
                g.append('title'); return g;
            });
            nodes.attr('aria-label', p => `${p.city}: ${events.filter(e => e.place.id === p.id).length} activities`)
                .classed('is-selected', p => p.id === events[index].place.id)
                .classed('is-visited', p => events.slice(0, index + 1).some(e => e.place.id === p.id))
                .attr('aria-pressed', p => String(p.id === events[index].place.id))
                .on('click', (e, p) => { stop(); selectPlace(p); })
                .on('keydown', (e, p) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); selectPlace(p); } });
            nodes.select('title').text(p => `${p.city} · Click to view activities`);
            updateMarkerScale(); renderLabels();
        }
        function selectPlace(p) {
            const matches = events.flatMap((e, i) => e.place.id === p.id ? [i] : []);
            const current = matches.indexOf(index);
            select(matches[(current + 1) % matches.length]);
        }
        function updateMarkerScale() {
            markers.selectAll('g').attr('transform', p => `translate(${projection(p.coords)}) scale(${pixelFactor() / transform.k})`);
        }
        function renderLabels() {
            if (!events[index]) return;
            const selected = events[index].place.id;
            const points = [...new Map(events.map(e => [e.place.id, e.place])).values()].sort((a, b) => (b.id === selected) - (a.id === selected));
            const occupied = [];
            const visible = points.flatMap(p => {
                const [x, y] = transform.apply(projection(p.coords));
                const factor = pixelFactor();
                const w = (p.city.length * 6.7 + 12) * factor, h = 19 * factor;
                const leftSide = x + w + 15 > width;
                const bx = leftSide ? x - w - 9 * factor : x + 10 * factor, by = y - 10 * factor;
                if (x < 0 || x > width || y < 15 || y > height - 4) return [];
                const rect = [bx, by, bx + w, by + h];
                if (p.id !== selected && occupied.some(r => rect[0] < r[2] + 6 && rect[2] > r[0] - 6 && rect[1] < r[3] + 4 && rect[3] > r[1] - 4)) return [];
                occupied.push(rect); return [{ ...p, offset: leftSide ? -10 : 10, anchor: leftSide ? 'end' : 'start' }];
            });
            labels.selectAll('text').data(visible, p => p.id).join('text')
                .attr('transform', p => `translate(${projection(p.coords)}) scale(${pixelFactor() / transform.k})`)
                .attr('x', p => p.offset).attr('y', 4).attr('text-anchor', p => p.anchor)
                .attr('class', p => p.id === selected ? 'is-selected' : '').text(p => p.city);
        }
        filter();
        root.dataset.ready = 'true';
        window.activityJourney = { get events() { return allEvents; }, get mapped() { return events; }, get selected() { return events[index]; } };
    }
    function prepare() {
        const root = $('#activity-journey');
        if (!root) return;
        let visible = false, raw = window.__activitiesRaw;
        const launch = () => { if (visible && raw !== undefined) start(raw); };
        window.addEventListener('activities:error', () => {
            root.innerHTML = '<p class="journey-unavailable">Activities could not load. Refresh the page to try again.</p>';
        });
        window.addEventListener('activities:loaded', e => { raw = e.detail; launch(); });
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { visible = true; launch(); observer.disconnect(); }
        }, { rootMargin: '400px' });
        observer.observe(root);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare);
    else prepare();
})();
