import { useEffect, useRef } from "react";
import { mountGuide, type GuideConfig, type MountOptions } from "./index";
/** Memoize config/options when the parent rerenders to preserve the conversation. */
export function WebsiteGuide({
  config,
  options,
}: {
  config: GuideConfig;
  options?: MountOptions;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const guide = mountGuide(ref.current, config, options);
    return () => guide.destroy();
  }, [config, options]);
  return <div ref={ref} />;
}
