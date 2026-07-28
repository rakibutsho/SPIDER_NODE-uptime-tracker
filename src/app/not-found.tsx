"use client";
import PageNotFound from "@/components/Others/PageNotFound/PageNotFound";
import { usePathname } from "next/navigation";
import React from "react";

const NotFound = () => {
  const pathName = usePathname();
  const page = pathName ? pathName.replace("/", "") : "requested";
  return <PageNotFound pageName={page} />;
};

export default NotFound;
