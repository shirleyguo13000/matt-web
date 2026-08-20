import { useEffect, useRef, useState } from "react";

// fades its element in and out as it enters and leaves the viewport.
// the observer is deliberately not disconnected after the first hit -
// that is what lets it fade back out when you scroll away.
function ScrollFade({
  as: Tag = "div",
  className = "",
  // negative margins pull the trigger line inwards, so the fade starts
  // as the element approaches the edge rather than exactly at it
  rootMargin = "-25% 0px -25% 0px",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Tag
      ref={ref}
      className={`${className} scroll-fade${inView ? " is-in" : ""}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default ScrollFade;
