'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Terminal,
  Code2,
  AlertTriangle,
  RefreshCw,
  Power,
  X,
} from 'lucide-react';
import {
  getApiKeysApi,
  createApiKeyApi,
  deleteApiKeyApi,
  toggleApiKeyApi,
} from '@/lib/api/auth';

export default function ApiKeysManagementPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Key Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [expiryDays, setExpiryDays] = useState('90');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['*']);
  const [creating, setCreating] = useState(false);

  // New Key Plaintext Reveal Modal
  const [newKeyData, setNewKeyData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Active Code Snippet Tab
  const [codeTab, setCodeTab] = useState<'curl' | 'js' | 'python' | 'php'>('curl');

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await getApiKeysApi();
      if (res.status === 'success' && res.data) {
        setKeys(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    setCreating(true);
    try {
      const res = await createApiKeyApi({
        name: keyName,
        permissions: selectedPermissions,
        expires_in_days: expiryDays === 'never' ? undefined : Number(expiryDays),
      });

      if (res.status === 'success') {
        setNewKeyData({
          key: res.plain_text_key,
          name: res.data.name,
          expires_at: res.data.expires_at,
        });
        setShowCreateModal(false);
        setKeyName('');
        setSelectedPermissions(['*']);
        fetchKeys();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate API Key.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleKey = async (id: string) => {
    try {
      await toggleApiKeyApi(id);
      fetchKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle API Key.');
    }
  };

  const handleDeleteKey = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently revoke and delete the API Key "${name}"? External integrations using this key will immediately lose access.`)) {
      return;
    }
    try {
      await deleteApiKeyApi(id);
      fetchKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to delete API Key.');
    }
  };

  const handleCopyKey = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sampleKey = newKeyData?.key || 'cb_live_e9a8f7c6b5a4d3e2f1029384756abcdef1234567';
  const baseApiUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1') : 'http://localhost:8080/api/v1';

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Key className="w-7 h-7 text-orange-500" />
            Developer & Merchant API Keys
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and manage external API keys to integrate CodeBridges POS with custom e-commerce stores, ERPs, and warehouse automations.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Generate New API Key</span>
        </button>
      </div>

      {/* Keys Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Secret API Keys</h2>
            <p className="text-[11px] text-slate-400 font-medium">Keep your keys private and never expose them in client-side public code.</p>
          </div>
          <button
            onClick={fetchKeys}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold">Loading Merchant API Keys...</div>
        ) : keys.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">No Merchant API Keys Generated Yet</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Create an API key to securely connect external webhooks, headless e-commerce storefronts, or backend inventory scripts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Key Name</th>
                  <th className="p-4">Key Token Prefix</th>
                  <th className="p-4">Permission Scopes</th>
                  <th className="p-4">Last Used</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">{k.name}</td>
                    <td className="p-4 font-mono font-bold text-slate-600 bg-slate-50/50">
                      <code>{k.key_prefix}</code>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(k.permissions) && k.permissions.includes('*') ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                            Full Admin Access (*)
                          </span>
                        ) : (
                          k.permissions?.map((p: string) => (
                            <span key={p} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {p}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {k.expires_at ? new Date(k.expires_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4">
                      {k.is_active ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleKey(k.id)}
                          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            k.is_active ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-50 text-emerald-700'
                          }`}
                          title={k.is_active ? 'Disable API Key' : 'Enable API Key'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteKey(k.id, k.name)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer"
                          title="Revoke & Delete API Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Integration Code Snippets Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">API Quickstart Integration Examples</h3>
              <p className="text-xs text-slate-400">Authenticate any external request using the <code className="text-orange-400 font-mono">X-API-Key</code> HTTP header.</p>
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
            onClick={() => handleCopyKey(snippets[codeTab])}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          <pre>{snippets[codeTab]}</pre>
        </div>
      </div>

      {/* Generate API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Generate Merchant API Key</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Description / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WooCommerce Sync, External Inventory Bot"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expiration Period</label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="30">30 Days</option>
                  <option value="90">90 Days (Recommended)</option>
                  <option value="365">1 Year</option>
                  <option value="never">Never Expire</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Permission Scopes</label>
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes('*')}
                      onChange={(e) => setSelectedPermissions(e.target.checked ? ['*'] : [])}
                      className="rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span>Full Access (All Microservices & Endpoints)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {creating ? 'Generating...' : 'Generate API Key'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* One-Time Secret Key Reveal Modal */}
      {newKeyData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-8 space-y-6"
          >
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">API Key Created Successfully!</h3>
                <p className="text-xs text-slate-500 font-medium">{newKeyData.name}</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Save this key immediately.</strong> For security reasons, you will not be able to view this full secret key again after closing this window.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">
                Your Secret API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={newKeyData.key}
                  className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-black text-slate-900 select-all"
                />
                <button
                  onClick={() => handleCopyKey(newKeyData.key)}
                  className="px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setNewKeyData(null)}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                I Have Saved My Secret API Key
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
