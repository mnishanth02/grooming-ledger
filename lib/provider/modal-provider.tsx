"use client";

import { useMounted } from "@/hooks/general/use-mounted";

export const ModalProvider = () => {
  const mounted = useMounted();

  if (!mounted) return null;

  return <></>;
};
