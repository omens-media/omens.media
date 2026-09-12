const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* ----------------------------------------------------------
   SLOW / CINEMATIC SCROLL
   ---------------------------------------------------------- */

if (!prefersReducedMotion) {
  let current = window.scrollY;
  let target = window.scrollY;
  let animationFrame = null;
  let isAnimating = false;

  const scrollSpeed = 0.35;
  const easing = 0.08;

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const getMaxScroll = () =>
    document.documentElement.scrollHeight - window.innerHeight;

  const animateScroll = () => {
    isAnimating = true;

    current += (target - current) * easing;

    window.scrollTo(0, current);

    if (Math.abs(target - current) > 0.5) {
      animationFrame = requestAnimationFrame(animateScroll);
    } else {
      current = target;

      window.scrollTo(0, target);

      animationFrame = null;
      isAnimating = false;
    }
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) return;

      event.preventDefault();

      target = clamp(
        target + event.deltaY * scrollSpeed,
        0,
        getMaxScroll()
      );

      if (!animationFrame) {
        animationFrame = requestAnimationFrame(animateScroll);
      }
    },
    {
      passive: false
    }
  );

  window.addEventListener("scroll", () => {
    if (!isAnimating) {
      current = window.scrollY;
      target = window.scrollY;
    }
  });

  window.addEventListener("resize", () => {
    target = clamp(
      target,
      0,
      getMaxScroll()
    );
  });
}


/* ----------------------------------------------------------
   CONTENT FADE-IN
   ---------------------------------------------------------- */

const revealItems = document.querySelectorAll(
  ".hero__content, .brands__inner, .founder__inner, .contact__inner"
);

if (prefersReducedMotion) {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.3
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
}