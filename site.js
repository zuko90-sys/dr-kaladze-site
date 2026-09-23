/* Сайт Торнике Каладзе: шапка-«пилюля» при прокрутке и счётчик пульса на главной. */

/* N10: вид шапки переключается один раз на смену состояния; прокрутка — пассивная, через rAF */
(() => {
  const nav = document.querySelector(".nav"); if (!nav) return;
  let floating = false, ticking = false;
  const update = () => {
    const next = window.scrollY > 80;
    if (next !== floating) { floating = next; nav.classList.toggle("is-floating", floating); }
  };
  window.addEventListener("scroll", () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  update();
})();

/* Счётчик пульса: среднее между нажатиями → удары в минуту. Пауза больше 2,5 с начинает замер заново.
   Ничего не толкуем: показываем число и напоминаем, что это не диагноз. */
(() => {
  const btn = document.querySelector(".pulse"); if (!btn) return;
  const dial = btn.closest(".dial"), num = btn.querySelector(".pulse__num"), unit = btn.querySelector(".pulse__unit");
  const live = document.getElementById("pulse-live");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let taps = [];
  btn.addEventListener("click", () => {
    const now = performance.now();
    if (taps.length && now - taps[taps.length - 1] > 2500) taps = [];
    taps.push(now); if (taps.length > 10) taps.shift();
    dial.classList.add("is-touched");
    if (taps.length < 4) {
      btn.dataset.state = "count"; num.textContent = "—";
    } else {
      const bpm = Math.round(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)));
      if (bpm >= 30 && bpm <= 220) {
        btn.dataset.state = "done"; num.textContent = String(bpm);
        if (live) live.textContent = bpm + " " + unit.textContent.trim();
      }
    }
    if (reduce.matches) {
      btn.classList.add("is-beat"); setTimeout(() => btn.classList.remove("is-beat"), 140);
    } else {
      const ring = document.createElement("span");
      ring.className = "ring ring--tap"; ring.setAttribute("aria-hidden", "true");
      dial.appendChild(ring); ring.addEventListener("animationend", () => ring.remove());
    }
  });
})();
