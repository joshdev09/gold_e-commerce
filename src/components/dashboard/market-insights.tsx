'use client';

import React from 'react';

export function MarketInsights() {
  const insights = [
    {
      title: 'Karat Purity Standard',
      content:
        'Karat (K) measures the ratio of pure gold to other metals out of 24 parts. 24K is 99.9% pure, 18K is 18/24 (75.0%), and 14K is 14/24 (58.33%). The remainder consists of silver, copper, or nickel to impart hardness.',
    },
    {
      title: 'Hallmark Stamps & Fineness',
      content:
        'Official hallmarks use millesimal fineness numbers stamped directly on jewelry: 999 (24K), 916 (22K), 875 (21K), 750 (18K), 585 (14K), and 375 (9K). Always check the hallmark with a jeweler loupe.',
    },
    {
      title: 'Melt Value vs Retail Price',
      content:
        'Melt or scrap value reflects only the raw pure gold content based on live spot rates. Retail jewelry includes artistry, labor, casting, hallmarking fees, and jeweler markups typically ranging from 8% to 25%.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-bold font-header text-slate-900 dark:text-white uppercase tracking-tight">
          Gold Purity &amp; Jewelry Trade Standards
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-subtitle">
          Essential guidelines for buyers, collectors, and jewelers navigating legal hallmarks and assay purities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col justify-between"
          >
            <div>
              <h4 className="text-base font-header font-bold text-slate-900 dark:text-white uppercase mb-2.5">
                {item.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-subtitle">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
