'use client'

import { useState } from 'react'
import { Send, Check, Calendar, Users, Mail, User, MessageSquare } from 'lucide-react'
import { PROEVERIJ_OPTIES } from '@/lib/evenementen'

export default function ProeverijAanvraag() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    naam: '',
    email: '',
    aantal: '2',
    type: PROEVERIJ_OPTIES[0],
    opmerking: '',
  })

  const update = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // MVP: open mail-client met vooringevulde aanvraag
    const subject = encodeURIComponent(`Aanvraag: ${form.type} — ${form.naam}`)
    const body = encodeURIComponent(
      `Naam: ${form.naam}\nE-mail: ${form.email}\nAantal personen: ${form.aantal}\nProeverij: ${form.type}\n\nOpmerkingen:\n${form.opmerking}`
    )
    window.location.href = `mailto:info@gastrovinorotterdam.nl?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-olive/25 bg-olive/8 p-10 text-center space-y-3 animate-fade-in">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-olive text-cream">
          <Check size={22} strokeWidth={2.5} />
        </span>
        <h3 className="font-serif text-2xl font-medium text-ink">Aanvraag verstuurd!</h3>
        <p className="text-sm font-sans text-ink-muted max-w-sm mx-auto leading-relaxed">
          Je e-mailprogramma is geopend met de aanvraag. Naomi &amp; Melanie nemen
          binnen één werkdag contact met je op om de details af te stemmen.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-sm font-sans font-medium text-olive hover:text-olive-dark transition-colors"
        >
          Nog een aanvraag doen
        </button>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-xl border border-cream-darker bg-cream px-4 py-3 text-sm font-sans text-ink placeholder:text-ink-subtle focus:border-olive/50 focus:outline-none focus:ring-1 focus:ring-olive/30 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-cream-darker bg-cream-dark p-8 shadow-warm space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="naam" className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-ink-muted">
            <User size={11} /> Naam
          </label>
          <input
            id="naam" type="text" required value={form.naam} onChange={update('naam')}
            placeholder="Je volledige naam" className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-ink-muted">
            <Mail size={11} /> E-mail
          </label>
          <input
            id="email" type="email" required value={form.email} onChange={update('email')}
            placeholder="je@email.nl" className={inputCls}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="aantal" className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-ink-muted">
            <Users size={11} /> Aantal personen
          </label>
          <select id="aantal" value={form.aantal} onChange={update('aantal')} className={inputCls}>
            {['2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'].map(n => (
              <option key={n} value={n}>{n} {n === '2' ? 'personen' : ''}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="type" className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-ink-muted">
            <Calendar size={11} /> Welke proeverij?
          </label>
          <select id="type" value={form.type} onChange={update('type')} className={inputCls}>
            {PROEVERIJ_OPTIES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="opmerking" className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-ink-muted">
          <MessageSquare size={11} /> Opmerkingen <span className="font-normal normal-case text-ink-subtle">(datum-voorkeur, dieetwensen…)</span>
        </label>
        <textarea
          id="opmerking" rows={4} value={form.opmerking} onChange={update('opmerking')}
          placeholder="Vertel ons over de gelegenheid, je datum-voorkeur of speciale wensen…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-terracotta text-cream px-8 py-4 rounded-xl text-sm font-sans font-semibold hover:bg-terracotta-dark transition-colors shadow-warm-sm"
      >
        <Send size={14} strokeWidth={2} />
        Verstuur aanvraag
      </button>

      <p className="text-xs font-sans text-ink-subtle leading-relaxed">
        Liever direct contact? Bel <a href="tel:0104767277" className="text-olive font-medium hover:underline">010-4767277</a> of
        mail naar <a href="mailto:info@gastrovinorotterdam.nl" className="text-olive font-medium hover:underline">info@gastrovinorotterdam.nl</a>.
      </p>
    </form>
  )
}
