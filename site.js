/* Сайт Торнике Каладзе: линейка шапки темнеет после прокрутки; полоса ЭКГ на главной считает пульс. */

/* Шапка: класс переключается один раз на смену состояния; прокрутка — пассивная, через rAF */
(() => {
  const nav = document.querySelector(".nav"); if (!nav) return;
  let floating = false, ticking = false;
  const update = () => {
    const next = window.scrollY > 40;
    if (next !== floating) { floating = next; nav.classList.toggle("is-floating", floating); }
  };
  window.addEventListener("scroll", () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  update();
})();

/* Счётчик пульса: среднее между нажатиями на полосу → удары в минуту. Пауза больше 2,5 с начинает замер
   заново. Ничего не толкуем: показываем число и напоминаем, что это не диагноз. */
(() => {
  const btn = document.querySelector(".ecg__tap"); if (!btn) return;
  const num = btn.querySelector(".ecg__num"), unit = btn.querySelector(".ecg__unit");
  const live = document.getElementById("pulse-live");
  let taps = [], beat = 0;
  btn.addEventListener("click", () => {
    const now = performance.now();
    if (taps.length && now - taps[taps.length - 1] > 2500) taps = [];
    taps.push(now); if (taps.length > 10) taps.shift();
    if (taps.length < 4) {
      btn.dataset.state = "count"; num.textContent = "—";
    } else {
      const bpm = Math.round(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)));
      if (bpm >= 30 && bpm <= 220) {
        btn.dataset.state = "done"; num.textContent = String(bpm);
        if (live) live.textContent = bpm + " " + unit.textContent.trim();
      }
    }
    btn.classList.add("is-beat");
    clearTimeout(beat); beat = setTimeout(() => btn.classList.remove("is-beat"), 140);
  });
})();
