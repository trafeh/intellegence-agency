import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { crmApi } from '../services/crmApi'
import {
  FileText,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react'

export default function ClientQuotePortal() {
  const { token } = useParams()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Acceptance Form State
  const [signerName, setSignerName] = useState('')
  const [poNumber, setPoNumber] = useState('')
  const [comment, setComment] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successResult, setSuccessResult] = useState(null)

  useEffect(() => {
    async function loadQuote() {
      try {
        setLoading(true)
        setError(null)
        const res = await crmApi.getPublicQuote(token)
        if (res?.data) {
          setQuote(res.data)
          setSignerName(res.data.client_name || '')
          setPoNumber(res.data.client_po_number || '')
        } else {
          setError('Devis introuvable ou lien expiré.')
        }
      } catch (err) {
        setError(err.message || 'Impossible de charger le devis.')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadQuote()
    }
  }, [token])

  const formatMAD = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const handleAcceptQuote = async (e) => {
    e.preventDefault()
    if (!agreed) {
      alert('Veuillez cocher la case confirmant votre accord.')
      return
    }

    try {
      setSubmitting(true)
      const res = await crmApi.acceptPublicQuote(token, {
        signerName,
        poNumber,
        comment
      })

      if (res?.success) {
        setSuccessResult(res)
        setQuote(prev => ({
          ...prev,
          status: 'Accepted',
          client_signed_at: res.signed_at,
          client_signer_name: signerName,
          client_po_number: res.po_number,
        }))
      }
    } catch (err) {
      alert(err.message || 'Une erreur est survenue lors de la signature.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-100">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500">Chargement sécurisé de votre devis...</p>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-100">
        <div className="max-w-md w-full bg-white dark:bg-navy-900 p-8 rounded-2xl shadow-xl border border-red-200 dark:border-red-900/30 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Devis Non Disponible</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
          >
            <span>Retour à l'accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const isAccepted = quote.status === 'Accepted' || successResult

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-600/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400">Portail Client Sécurisé</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold">TVA Maroc 20%</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Devis Officiel : {quote.quote_number}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              isAccepted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
            }`}>
              {isAccepted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-blue-600" />}
              <span>{isAccepted ? 'Devis Accepté & Signé' : 'En Attente de Votre Validation'}</span>
            </span>
          </div>
        </div>

        {/* Success Banner if just signed */}
        {isAccepted && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300">
                Offre Commerciale Validée avec Succès !
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Le bon de commande officiel a été généré et transmis à l'équipe commerciale et au service comptabilité.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-emerald-500/20 text-xs">
                <div>
                  <span className="text-slate-400 block">Signataire :</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{quote.client_signer_name || signerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Réf. Bon de Commande :</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{quote.client_po_number || poNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date de signature :</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {new Date(quote.client_signed_at || Date.now()).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise & Client Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Destination */}
          <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <Building2 className="w-4 h-4 text-brand-500" />
              <span>Entreprise Destinataire</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{quote.client_company}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>À l'attention de : <strong>{quote.client_name}</strong></span>
              </p>
              {quote.client_email && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{quote.client_email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Issuer / Sales Rep */}
          <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Émetteur & Responsable de Compte</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Intelligence Agency (Sales OS)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Interlocuteur : <strong>{quote.sales_representative?.name}</strong> ({quote.sales_representative?.title})</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{quote.sales_representative?.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Détail des Prestations & Licences</h3>
            {quote.expiry_date && (
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Offre valable jusqu'au : <strong>{quote.expiry_date}</strong></span>
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6 text-center">Quantité</th>
                  <th className="py-3 px-6 text-right">Prix Unitaire HT</th>
                  <th className="py-3 px-6 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs text-slate-800 dark:text-slate-200">
                {quote.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-semibold">{item.description}</td>
                    <td className="py-4 px-6 text-center">{item.qty}</td>
                    <td className="py-4 px-6 text-right font-mono">{formatMAD(item.unit_price)}</td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatMAD(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals Card */}
          <div className="p-6 bg-slate-50/70 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between gap-6">
            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300">Conditions de règlement :</p>
              <p>Paiement à 30 jours fin de mois. Validité de l'offre 30 jours à compter de la date d'émission.</p>
              {quote.notes && (
                <div className="mt-3 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300">
                  <strong>Notes : </strong> {quote.notes}
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Sous-total HT :</span>
                <span className="font-mono font-bold">{formatMAD(quote.subtotal)}</span>
              </div>

              {quote.discount_percent > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Remise accordée ({quote.discount_percent}%) :</span>
                  <span className="font-mono font-bold">- {formatMAD(quote.discount_amount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>TVA Légale (20%) :</span>
                <span className="font-mono font-bold">{formatMAD(quote.tax_amount)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase">Net à Payer TTC :</span>
                <span className="text-lg font-black font-mono text-brand-600 dark:text-brand-400">
                  {formatMAD(quote.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* E-Signature Form (Only shown if not yet accepted) */}
        {!isAccepted ? (
          <div className="bg-gradient-to-br from-white via-white to-brand-50/50 dark:from-navy-900 dark:via-navy-900 dark:to-brand-950/20 p-8 rounded-2xl border-2 border-brand-500/30 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Validation & Signature Électronique</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Confirmez votre commande en ligne pour déclencher immédiatement l'activation de votre projet.
                </p>
              </div>
            </div>

            <form onSubmit={handleAcceptQuote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Nom & Prénom du Signataire *
                  </label>
                  <input
                    type="text"
                    required
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Ex: Omar Kabbaj"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    N° Bon de Commande (Facultatif)
                  </label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="Ex: BC-2026-0042 (Généré auto si vide)"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Commentaire ou Instructions Particulières (Facultatif)
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Remarques éventuelles sur la livraison ou le déploiement..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <input
                  type="checkbox"
                  id="agreeCheckbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="agreeCheckbox" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  Je confirme l'acceptation formelle de ce devis au nom de <strong>{quote.client_company}</strong> et autorise l'émission du bon de commande correspondant.
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !agreed}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Validation en cours...' : 'Valider & Signer le Devis'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center p-6 text-xs text-slate-400">
            Ce document est juridiquement validé et archivé électroniquement.
          </div>
        )}

      </div>
    </div>
  )
}
