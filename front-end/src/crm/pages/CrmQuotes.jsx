import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCrm } from '../context/CrmContext'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Printer,
  DollarSign,
  Building2,
  Trash2,
  X,
  Send,
  ShieldCheck,
  ExternalLink,
  Link2Off,
  AlertCircle
} from 'lucide-react'

export default function CrmQuotes() {
  const { quotes, deals, accounts, addQuote, approveQuoteDiscount, sendQuote, acceptQuote, pendingMutations, mutationError } = useCrm()
  const { currentUser, role } = useAuth()
  const { lang } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false)
  const [previewQuote, setPreviewQuote] = useState(null)
  const [successToast, setSuccessToast] = useState(null)

  // New Quote Form State
  const [newQuoteForm, setNewQuoteForm] = useState({
    accountId: accounts[0]?.id || '',
    dealId: deals[0]?.id || '',
    validUntil: '2026-11-20',
    discountPercent: 10,
    items: [
      { description: 'Intelligence Sales Corporate SaaS Annual Contract', qty: 1, unitPrice: 180000, total: 180000 },
      { description: 'AI Sales Agents & Smart Follow-Up Engine', qty: 1, unitPrice: 45000, total: 45000 },
    ]
  })

  // Respond to URL query parameters (e.g. from Opportunity modal)
  useEffect(() => {
    const action = searchParams.get('action')
    const dealIdParam = searchParams.get('dealId')
    const accountIdParam = searchParams.get('accountId')

    if (action === 'new-quote') {
      setIsNewQuoteOpen(true)
      if (dealIdParam || accountIdParam) {
        const targetDeal = deals.find(d => d.id === dealIdParam)
        const targetAccount = accounts.find(a => a.id === (accountIdParam || targetDeal?.accountId))

        setNewQuoteForm(prev => {
          let items = prev.items
          if (targetDeal?.products && targetDeal.products.length > 0) {
            const splitPrice = Math.round((targetDeal.amount || 100000) / targetDeal.products.length)
            items = targetDeal.products.map(p => ({
              description: p,
              qty: 1,
              unitPrice: splitPrice,
              total: splitPrice
            }))
          }

          return {
            ...prev,
            dealId: dealIdParam || prev.dealId,
            accountId: targetAccount ? targetAccount.id : (prev.accountId || accounts[0]?.id || ''),
            items: items.length > 0 ? items : prev.items
          }
        })
      }
    }
  }, [searchParams, deals, accounts])

  // Format currency
  const formatMAD = (amount) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'en-US', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate items sum
  const subtotal = newQuoteForm.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0)
  const discountAmount = Math.round(subtotal * (newQuoteForm.discountPercent / 100))
  const totalHT = subtotal - discountAmount
  const tvaAmount = Math.round(totalHT * 0.20) // 20% TVA
  const totalTTC = totalHT + tvaAmount

  const filteredQuotes = quotes.filter(q => {
    // 1. Role-based scoping
    if (role === 'rep') {
      const isOwner =
        q.ownerName?.toLowerCase().includes(currentUser?.name?.toLowerCase() || '') ||
        q.user_id === currentUser?.id
      if (!isOwner) return false
    } else if (role === 'client') {
      const clientCompany = currentUser?.accountName || currentUser?.account?.name || ''
      const isClientQuote =
        (currentUser?.accountId && (q.accountId || q.account_id) === currentUser.accountId) ||
        (clientCompany && (
          q.accountName?.toLowerCase().includes(clientCompany.toLowerCase()) ||
          q.client_company?.toLowerCase().includes(clientCompany.toLowerCase())
        )) ||
        q.client_email === currentUser?.email
      if (!isClientQuote) return false
    }

    // 2. Search & Status filter
    const matchSearch =
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.ownerName && q.ownerName.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchStatus = statusFilter === 'all' || q.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleAddItem = () => {
    setNewQuoteForm(prev => ({
      ...prev,
      items: [...prev.items, { description: 'Deployment, Scoping & Training Services', qty: 1, unitPrice: 25000, total: 25000 }]
    }))
  }

  const handleRemoveItem = (index) => {
    setNewQuoteForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleItemChange = (index, field, value) => {
    setNewQuoteForm(prev => {
      const updated = [...prev.items]
      updated[index][field] = field === 'description' ? value : Number(value)
      updated[index].total = updated[index].qty * updated[index].unitPrice
      return { ...prev, items: updated }
    })
  }

  const handleCreateQuote = async (e) => {
    e.preventDefault()
    const acc = accounts.find(a => a.id === newQuoteForm.accountId) || accounts[0]
    if (!acc) {
      setSuccessToast('Create or load an account before creating a quote.')
      setTimeout(() => setSuccessToast(null), 4000)
      return
    }
    const deal = deals.find(d => d.id === newQuoteForm.dealId)

    const created = await addQuote({
      dealId: deal?.id || '',
      accountId: acc.id,
      accountName: acc.name,
      contactName: acc.contactName,
      validUntil: newQuoteForm.validUntil,
      discountPercent: newQuoteForm.discountPercent,
      items: newQuoteForm.items,
      subtotal,
      discountAmount,
      totalHT,
      tvaAmount,
      totalTTC,
    })

    if (!created) return
    setIsNewQuoteOpen(false)
    if (created.status === 'Pending Approval') {
      setSuccessToast(`Quote ${created.id} created and is awaiting manager approval.`)
    } else {
      setSuccessToast(`Quote ${created.id} generated successfully!`)
    }
    setTimeout(() => setSuccessToast(null), 5000)
  }

  const handleApprove = async (quoteId) => {
    const approved = await approveQuoteDiscount(quoteId)
    if (!approved) return
    setSuccessToast(`Discount approved by Sales Director! Quote is now ready for delivery.`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  const handleSend = async quoteId => {
    const sent = await sendQuote(quoteId)
    if (!sent) return
    setSuccessToast(`Quote ${sent.id} status updated to Sent.`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  const handleAccept = async (quoteId) => {
    const accepted = await acceptQuote(quoteId)
    if (!accepted) return
    setSuccessToast('Quote acceptance confirmed. The linked deal has been reconciled with the server.')
    setTimeout(() => setSuccessToast(null), 5000)
  }

  // Note: Link revocation is temporarily unavailable pending database compatibility work.

  return (
    <div className="space-y-6 w-full">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-brand-600 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Mutation Error Alert */}
      {mutationError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{mutationError}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'ar' ? 'عروض الأسعار والمقترحات (Devis)' : 'Commercial Quotations & Proposals'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-600/10 text-amber-600 text-xs font-bold border border-amber-500/20">
              {filteredQuotes.length} quotes
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'توليد عروض الأسعار وحساب الهوامش والربط التلقائي بنظام اللوجستيك عند القبول'
              : 'Quotation generation, margin checks, approval workflows, and automated ERP order sync'}
          </p>
        </div>

        {role !== 'client' && (
          <button
            onClick={() => setIsNewQuoteOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'ar' ? 'إنشاء عرض سعر جديد' : 'New Quotation'}</span>
          </button>
        )}
      </div>

      {/* Role Banner */}
      {role === 'client' && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <Building2 className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            {lang === 'ar'
              ? `عروض الأسعار الموجهة إلى ${currentUser?.accountName || currentUser?.account?.name || 'حسابكم'}: يمكنك الاطلاع والتوقيع الإلكتروني مباشرة.`
              : `Proposals addressed to ${currentUser?.accountName || currentUser?.account?.name || 'Your Company'}: You can review and e-sign directly.`}
          </span>
        </div>
      )}

      {role === 'rep' && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            {lang === 'ar'
              ? `تشاهد عروض الأسعار التي حررتها لزبنائك. الخصومات التي تفوق 15% تتطلب موافقة المدير التجاري.`
              : `Viewing quotations issued by your account. Note: Discounts > 15% require Sales Director approval.`}
          </span>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-navy-900 p-3.5 rounded-lg border border-slate-200 dark:border-white/10">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by quote reference, company name, sales rep..."
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-100 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="Pending Approval">Pending Approval (Discount &gt; 15%)</option>
          <option value="Sent">Sent to Client</option>
          <option value="Accepted">Accepted / Won</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Notice: Link Revocation Temporarily Unavailable */}
      {role !== 'client' && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs">
          <Link2Off className="h-4 w-4 shrink-0 text-slate-400" />
          <span>
            {lang === 'ar'
              ? 'تنبيه: خاصية إلغاء روابط عروض الأسعار غير متاحة مؤقتاً في انتظار إكمال توافق قاعدة البيانات.'
              : 'Link revocation is temporarily unavailable pending database compatibility work.'}
          </span>
        </div>
      )}

      {/* Quotes Table */}
      <div className="bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="py-3 px-4">Quote Ref</th>
                <th className="py-3 px-4">Client Enterprise</th>
                <th className="py-3 px-4">Net Amount</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Total Inc. VAT</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredQuotes.map((quote) => {
                const isPending = quote.status === 'Pending Approval'
                const isAccepted = quote.status === 'Accepted'
                const isDraft = quote.status === 'Draft'
                const isSent = quote.status === 'Sent'

                return (
                  <tr key={quote.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-black text-brand-600">
                      {quote.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div>{quote.accountName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{quote.contactName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {formatMAD(quote.totalHT)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${quote.discountPercent > 15 ? 'text-rose-600 font-black' : 'text-slate-600 dark:text-slate-400'}`}>
                        {quote.discountPercent}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                      {formatMAD(quote.totalTTC)}
                    </td>
                    <td className="py-3.5 px-4">
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800/40">
                          <Clock className="h-3 w-3" />
                          <span>Director Approval Needed</span>
                        </span>
                      )}
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800/40">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Accepted & Transmitted to ERP</span>
                        </span>
                      )}
                      {!isPending && !isAccepted && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {quote.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {quote.validUntil}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewQuote(quote)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300"
                          title="Preview Quote"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Public Client Portal Link (only if active & not revoked) */}
                        {quote.publicToken && !quote.isRevoked && (
                          <a
                            href={`/portal/quote/${quote.publicToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-bold text-[10px] shadow-sm transition-all"
                            title={lang === 'ar' ? 'فتح بوابة الزبون للتوقيع المباشر' : 'Open client portal for direct e-signature'}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{lang === 'ar' ? 'رابط الزبون' : 'Client Link'}</span>
                          </a>
                        )}

                        {/* Badge if link is revoked */}
                        {quote.isRevoked && (
                          <span className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold text-[9px] border border-rose-200 dark:border-rose-900/50">
                            {lang === 'ar' ? 'الرابط ملغى' : 'Link Revoked'}
                          </span>
                        )}

                        {/* Role-Specific Actions */}
                        {role === 'client' ? (
                          !isAccepted ? (
                            quote.isRevoked ? (
                              <span className="text-[10px] text-rose-500 font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                                {lang === 'ar' ? 'الرابط ملغى' : 'Link Revoked'}
                              </span>
                            ) : quote.publicToken ? (
                              <a
                                href={`/portal/quote/${quote.publicToken}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-sm transition-all"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>{lang === 'ar' ? 'مراجعة وتوقيع العرض' : 'Review & Sign'}</span>
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500">Client link unavailable</span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{lang === 'ar' ? 'تم التوقيع' : 'Signed'}</span>
                            </span>
                          )
                        ) : (
                          <>
                            {/* Revoke Public Token Action — Temporarily disabled pending database compatibility work */}
                            {quote.publicToken && !quote.isRevoked && !isAccepted && (
                              <button
                                type="button"
                                disabled
                                aria-disabled="true"
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 font-bold text-[10px] border border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-75 shadow-none transition-all select-none"
                                title={
                                  lang === 'ar'
                                    ? 'إلغاء الرابط غير متاح مؤقتاً في انتظار توافق قاعدة البيانات'
                                    : 'Link revocation is temporarily unavailable pending database compatibility work'
                                }
                              >
                                <Link2Off className="h-3 w-3" />
                                <span>{lang === 'ar' ? 'إلغاء الرابط (غير متاح)' : 'Revoke Link (Unavailable)'}</span>
                              </button>
                            )}
                            {isDraft && !isPending && <button onClick={() => handleSend(quote.id)} className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-[10px]">Send to Client</button>}
                            {/* Manager / Admin Discount Approval Button */}
                            {isPending && (role === 'admin' || role === 'manager' || role === 'director') && (
                              <button
                                disabled={Boolean(pendingMutations[`approve-quote-${quote.id}`])}
                                onClick={() => handleApprove(quote.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] shadow-sm transition-all"
                              >
                                Approve Discount
                              </button>
                            )}

                            {/* Rep sees pending label since they cannot approve their own high discount */}
                            {isPending && role === 'rep' && (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-[9px] border border-amber-200 dark:border-amber-800/40">
                                {lang === 'ar' ? 'في انتظار المدير' : 'Pending Manager'}
                              </span>
                            )}

                            {/* Record Client Decision / Accord */}
                            {!isAccepted && isSent && (
                              <button
                                disabled={Boolean(pendingMutations[`accept-quote-${quote.id}`])}
                                onClick={() => handleAccept(quote.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-sm transition-all"
                                title={lang === 'ar' ? 'تسجيل موافقة الزبون واستلام الـ Bon de commande' : 'Log client agreement / PO received'}
                              >
                                {lang === 'ar' ? 'تسجيل موافقة الكليان' : 'Log Client Accord'}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE QUOTE MODAL */}
      {isNewQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'إنشاء عرض سعر احترافي (Devis)' : 'Proposal & Quotation Builder'}
              </h3>
              <button
                onClick={() => setIsNewQuoteOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'الشركة المستهدفة *' : 'Client Enterprise *'}
                  </label>
                  <select
                    value={newQuoteForm.accountId}
                    onChange={(e) => {
                      const accId = e.target.value
                      setNewQuoteForm({
                        ...newQuoteForm,
                        accountId: accId,
                        dealId: deals.find(d => d.accountId === accId)?.id || newQuoteForm.dealId
                      })
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} - {acc.contactName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'الصفقة / الفرصة' : 'Associated Opportunity'}
                  </label>
                  <select
                    value={newQuoteForm.dealId}
                    onChange={(e) => {
                      const dId = e.target.value
                      const targetDeal = deals.find(d => d.id === dId)
                      setNewQuoteForm({
                        ...newQuoteForm,
                        dealId: dId,
                        accountId: targetDeal?.accountId || newQuoteForm.accountId
                      })
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="">-- {lang === 'ar' ? 'بدون صفقة محددة' : 'No specific deal'} --</option>
                    {deals.map(deal => (
                      <option key={deal.id} value={deal.id}>{deal.title} ({formatMAD(deal.amount)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'تاريخ انتهاء العرض' : 'Offer Expiry Date'}
                  </label>
                  <input
                    type="date"
                    value={newQuoteForm.validUntil}
                    onChange={(e) => setNewQuoteForm({ ...newQuoteForm, validUntil: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Product & Service Line Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-brand-600 hover:text-brand-500 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {newQuoteForm.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                      <input
                        type="text"
                        required
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Product or service description"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        className="w-16 px-2 py-1.5 rounded-lg bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-xs text-center focus:outline-none"
                      />
                      <input
                        type="number"
                        step="1000"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        className="w-28 px-3 py-1.5 rounded-lg bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-xs text-right focus:outline-none"
                      />
                      <span className="w-28 text-right text-xs font-bold text-slate-900 dark:text-white pr-2">
                        {formatMAD(item.total)}
                      </span>
                      {newQuoteForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount & Calculation Box */}
              <div className="p-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Commercial Discount (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={newQuoteForm.discountPercent}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, discountPercent: Number(e.target.value) })}
                      className="w-20 px-3 py-1.5 rounded-lg bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-xs font-bold text-center"
                    />
                    <span className="text-xs font-bold">%</span>
                    {newQuoteForm.discountPercent > 15 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold border border-amber-500/20">
                        Requires Director Approval (&gt; 15%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right space-y-1 text-xs">
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-400">Subtotal:</span>
                    <span className="font-semibold">{formatMAD(subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-400">Discount ({newQuoteForm.discountPercent}%):</span>
                    <span className="font-semibold text-rose-500">- {formatMAD(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-slate-400">VAT (20%):</span>
                    <span className="font-semibold">{formatMAD(tvaAmount)}</span>
                  </div>
                  <div className="flex justify-between gap-6 text-sm font-black text-brand-600 pt-1 border-t border-slate-200 dark:border-white/10">
                    <span>Total Inc. VAT:</span>
                    <span>{formatMAD(totalTTC)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewQuoteOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
                >
                  Create & Deliver Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PREVIEW MODAL */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto space-y-6 border border-slate-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <div className="text-sm font-black tracking-widest text-blue-600">INTELLIGENCE SALES</div>
                <div className="text-xs text-slate-500 mt-1">Intelligence Agency Morocco</div>
                <div className="text-xs text-slate-400">Casablanca Marina • ICE: 002938475000032</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-slate-900">PROPOSAL {previewQuote.id}</div>
                <div className="text-xs text-slate-500">Date: {previewQuote.date}</div>
                <div className="text-xs text-slate-500">Valid Until: {previewQuote.validUntil}</div>
              </div>
            </div>

            {/* Client Destinataire */}
            <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Client:</span>
              <div className="text-sm font-bold text-slate-900">{previewQuote.accountName}</div>
              <div className="text-xs text-slate-600">Attention: {previewQuote.contactName}</div>
            </div>

            {/* Items */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 font-bold uppercase text-[10px] text-slate-500">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Net Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewQuote.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2.5 font-medium">{item.description}</td>
                    <td className="py-2.5 text-center">{item.qty}</td>
                    <td className="py-2.5 text-right">{formatMAD(item.unitPrice)}</td>
                    <td className="py-2.5 text-right font-bold">{formatMAD(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Recap */}
            <div className="border-t border-slate-200 pt-4 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Net:</span>
                  <span>{formatMAD(previewQuote.subtotal)}</span>
                </div>
                {previewQuote.discountPercent > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Discount ({previewQuote.discountPercent}%):</span>
                    <span>- {formatMAD(previewQuote.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>VAT (20%):</span>
                  <span>{formatMAD(previewQuote.tvaAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                  <span>Total Inc. VAT:</span>
                  <span>{formatMAD(previewQuote.totalTTC)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] text-slate-400">Generated by Intelligence Sales OS</span>
              <button
                onClick={() => setPreviewQuote(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
