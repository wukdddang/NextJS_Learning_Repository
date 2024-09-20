'use client'

import React from 'react';
import {LiveblocksProvider} from "@liveblocks/react";

const Providers: React.FC<{ children: React.ReactNode }> = ({children}) => {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}
    >
      {children}
    </LiveblocksProvider>
  );
};

export default Providers;
