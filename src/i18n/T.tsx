"use client";

import { useTranslation } from "./provider";

interface TProps {
  k: string;
  params?: Record<string, string | number>;
}

/** Client component that renders a translated string. Usable inside server components. */
export default function T({ k, params }: TProps) {
  const { t } = useTranslation();
  return <>{t(k, params)}</>;
}
