'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface ApiQuickstartSnippetProps {
  sampleKey: string;
  baseApiUrl: string;
  copied: boolean;
  onCopy: (text: string) => void;
}

export function ApiQuickstartSnippet({
  sampleKey,
  baseApiUrl,
  copied,
  onCopy,
}: ApiQuickstartSnippetProps) {
  const [codeTab, setCodeTab] = useState<'curl' | 'js' | 'python' | 'php'>('curl');

  const snippets = {
    curl: `curl -X GET "${baseApiUrl}/products" \\
  -H "X-API-Key: ${sampleKey}" \\
  -H "Accept: application/json"`,
    js: `// Fetch products using CodeBridges Merchant API Key
const response = await fetch('${baseApiUrl}/products', {
  headers: {
    'X-API-Key': '${sampleKey}',
    'Accept': 'application/json'
  }
});
const products = await response.json();
console.log(products);`,
    python: `import requests

url = "${baseApiUrl}/products"
headers = {
    "X-API-Key": "${sampleKey}",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())`,
    php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "${baseApiUrl}/products",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "X-API-Key: ${sampleKey}",
        "Accept: application/json"
    ],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight">API Quickstart Integration Examples</h3>
            <p className="text-xs text-slate-400">
              Authenticate any external request using the <code className="text-orange-400 font-mono">X-API-Key</code> HTTP header.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
          {(['curl', 'js', 'python', 'php'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setCodeTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                codeTab === tab ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
        <button
          onClick={() => onCopy(snippets[codeTab])}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
        <pre>{snippets[codeTab]}</pre>
      </div>
    </div>
  );
}
