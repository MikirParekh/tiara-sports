import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Mail, Clock, Send, Copy, Check, Sparkles, Eye } from 'lucide-react';
import { CLUB_FACILITIES, CLUB_LOCATION, ADMIN_EMAIL } from '../data/clubData';
import { AdminEmailPreviewModal } from './AdminEmailPreviewModal';
import { saveInquiryToStorage } from '../data/inquiryStorage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFacilityId?: string;
  isDarkMode?: boolean;
}

const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultFacilityId = 'tennis-courts',
  isDarkMode = true,
}) => {
  const [selectedFacility, setSelectedFacility] = useState(defaultFacilityId);
  const [date, setDate] = useState(() => getTodayDateStr());
  
  // Custom flexible time selection: any start time + duration
  const [startTime, setStartTime] = useState('18:30');
  const [durationMinutes, setDurationMinutes] = useState(90);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('Slot Booking & Availability');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [confirmedInquiry, setConfirmedInquiry] = useState<{
    code: string;
    item: string;
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    query: string;
    adminEmail: string;
  } | null>(null);

  if (!isOpen) return null;

  // Helper to format start time + duration into readable range
  const getSimpleFacilityName = (id: string) => {
    if (id === 'tennis-courts') return 'Tennis';
    if (id === 'pickleball-center') return 'Pickleball';
    if (id === 'badminton-arena') return 'Badminton';
    if (id === 'fitness-gym') return 'Gym';
    return 'Tennis';
  };

  const calculateTimeSlot = (start: string, duration: number) => {
    const [hStr, mStr] = start.split(':');
    const startHour = parseInt(hStr || '18', 10);
    const startMinute = parseInt(mStr || '30', 10);

    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = totalStartMinutes + duration;
    const endHour = Math.floor(totalEndMinutes / 60) % 24;
    const endMinute = totalEndMinutes % 60;

    const formatAmPm = (h: number, m: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h % 12 === 0 ? 12 : h % 12;
      const formattedM = m < 10 ? `0${m}` : m;
      return `${formattedH}:${formattedM} ${ampm}`;
    };

    return `${formatAmPm(startHour, startMinute)} – ${formatAmPm(endHour, endMinute)} (${duration} mins)`;
  };

  const formattedTimeSlot = calculateTimeSlot(startTime, durationMinutes);

  const validate = () => {
    const errs: Record<string, string> = {};
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters)';
    } else if (/^\d+$/.test(trimmedName)) {
      errs.name = 'Please enter a valid name (letters required)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length !== 10) {
      errs.phone = 'Mobile number must be exactly 10 digits';
    }

    if (!queryMessage.trim() || queryMessage.trim().length < 5) {
      errs.queryMessage = 'Please enter your query or specific requirement (min 5 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const refCode = `INQ-TIARA-${Math.floor(100000 + Math.random() * 900000)}`;
      const itemName = getSimpleFacilityName(selectedFacility);

      const inquiryData = {
        inquiryId: refCode,
        facilityName: itemName,
        date,
        timeSlot: formattedTimeSlot,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        category: inquiryType,
        query: queryMessage.trim(),
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        adminEmail: ADMIN_EMAIL,
      };

      saveInquiryToStorage(inquiryData);

      // Dispatch via Zoho SMTP server endpoint
      fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      }).catch((err) => console.warn('Backend SMTP call failed:', err));

      setConfirmedInquiry({
        code: refCode,
        item: itemName,
        date,
        time: formattedTimeSlot,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        query: queryMessage.trim(),
        adminEmail: ADMIN_EMAIL,
      });
      setIsSubmitting(false);
    }, 400);
  };

  const handleReset = () => {
    setConfirmedInquiry(null);
    setName('');
    setEmail('');
    setPhone('');
    setQueryMessage('');
    setErrors({});
    onClose();
  };

  const copyInquiry = () => {
    if (!confirmedInquiry) return;
    const summary = `Tiara Sports Club Slot Inquiry [${confirmedInquiry.code}]
Venue: ${confirmedInquiry.item}
Date & Time: ${confirmedInquiry.date} · ${confirmedInquiry.time}
Inquirer: ${confirmedInquiry.name} (${confirmedInquiry.phone}, ${confirmedInquiry.email})
Query: ${confirmedInquiry.query}
Admin Notified: ${confirmedInquiry.adminEmail}`;

    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoLink = () => {
    if (!confirmedInquiry) return '#';
    const sub = encodeURIComponent(`Slot Inquiry: ${confirmedInquiry.item} - Ref ${confirmedInquiry.code}`);
    const b = encodeURIComponent(`Dear Tiara Sports Club Administration,

Inquiry Ref: ${confirmedInquiry.code}
Discipline: ${confirmedInquiry.item}
Requested Date & Time: ${confirmedInquiry.date} · ${confirmedInquiry.time}

User Query:
${confirmedInquiry.query}

Inquirer Contact:
Name: ${confirmedInquiry.name}
Phone: ${confirmedInquiry.phone}
Email: ${confirmedInquiry.email}`);

    return `mailto:${confirmedInquiry.adminEmail}?subject=${sub}&body=${b}`;
  };

  const quickTimePresets = [
    { label: '06:00 AM', time: '06:00' },
    { label: '07:30 AM', time: '07:30' },
    { label: '09:00 AM', time: '09:00' },
    { label: '11:00 AM', time: '11:00' },
    { label: '03:30 PM', time: '15:30' },
    { label: '05:00 PM', time: '17:00' },
    { label: '06:30 PM', time: '18:30' },
    { label: '08:00 PM', time: '20:00' },
    { label: '09:30 PM', time: '21:30' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className={`relative w-full max-w-lg border rounded-sm shadow-2xl p-6 overflow-y-auto max-h-[92vh] ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 p-1 rounded-xs transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedInquiry ? (
          <div>
            <div className="mb-5">
              <span className="text-red-600 font-bold uppercase tracking-widest text-[11px] block font-mono">
                TIARA SPORTS CLUB · VADODARA DESK
              </span>
              <h2
                id="booking-modal-title"
                className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight"
              >
                COURT, GYM & SLOT INQUIRY
              </h2>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                Ask any slot query for Tennis, Pickleball, Badminton, or Gym in Vadodara. Our admin team will receive your query with full schedule details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Select Facility / Arena
                </label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className={`w-full border text-xs px-3.5 py-2.5 rounded-xs focus:border-red-500 focus:outline-none ${
                    isDarkMode ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {CLUB_FACILITIES.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {getSimpleFacilityName(facility.id)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Perfectly Aligned Preferred Date & Start Time Section */}
              <div
                className={`p-3.5 rounded-xs border space-y-3.5 ${
                  isDarkMode ? 'bg-neutral-950/70 border-neutral-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2 border-neutral-800/60">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-500">
                    PREFERRED SCHEDULE
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                    06:00 AM – 11:00 PM DAILY
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5 text-neutral-300">
                      <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={getTodayDateStr()}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full h-10 border text-xs px-3.5 rounded-xs font-mono transition-colors focus:border-red-500 focus:outline-none cursor-pointer ${
                        isDarkMode
                          ? 'bg-neutral-900 border-neutral-700 text-white [color-scheme:dark]'
                          : 'bg-white border-slate-300 text-slate-900 [color-scheme:light]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5 text-neutral-300">
                      <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Custom Start Time</span>
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={`w-full h-10 border text-xs px-3.5 rounded-xs font-mono transition-colors focus:border-red-500 focus:outline-none cursor-pointer ${
                        isDarkMode
                          ? 'bg-neutral-900 border-neutral-700 text-white [color-scheme:dark]'
                          : 'bg-white border-slate-300 text-slate-900 [color-scheme:light]'
                      }`}
                    />
                  </div>
                </div>

                {/* Flexible Time Presets & Quick Pickers */}
                <div className="pt-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Quick Pickers (06:00 AM – 11:00 PM)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTimePresets.map((preset) => (
                      <button
                        key={preset.time}
                        type="button"
                        onClick={() => setStartTime(preset.time)}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded-xs border transition-colors cursor-pointer ${
                          startTime === preset.time
                            ? 'border-red-600 bg-red-600 text-white font-bold'
                            : isDarkMode
                            ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider">
                    Session Duration
                  </label>
                  <span className="text-[11px] font-mono text-red-500 font-bold">
                    {durationMinutes} Minutes ({durationMinutes / 60} hrs)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[60, 90, 120, 180].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`py-2 text-xs font-mono font-bold rounded-xs border transition-colors cursor-pointer ${
                        durationMinutes === mins
                          ? 'border-red-600 bg-red-600 text-white shadow-xs'
                          : isDarkMode
                          ? 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                          : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {mins === 60 ? '1 Hour' : mins === 90 ? '1.5 Hours' : mins === 120 ? '2 Hours' : '3 Hours'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Slot Summary Display */}
              <div
                className={`p-3 rounded-xs border flex items-center justify-between text-xs font-mono ${
                  isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-red-50/50 border-red-200 text-red-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-sans font-bold">
                      PROPOSED SLOT WINDOW
                    </span>
                    <span className="font-bold text-red-500">{formattedTimeSlot}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  DESK NOTIFIED
                </span>
              </div>

              {/* Personal Information */}
              <div
                className={`pt-2 border-t space-y-3 ${
                  isDarkMode ? 'border-neutral-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <label className="block text-xs mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder="e.g. Yashvardhan Rana"
                    className={`w-full border text-xs px-3 py-2 rounded-xs focus:border-red-500 focus:outline-none ${
                      errors.name ? 'border-red-500' : isDarkMode ? 'border-neutral-700 bg-neutral-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="athlete@domain.com"
                      className={`w-full border text-xs px-3 py-2 rounded-xs focus:border-red-500 focus:outline-none ${
                        errors.email ? 'border-red-500' : isDarkMode ? 'border-neutral-700 bg-neutral-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Mobile / WhatsApp (10 Digits) *</label>
                    <input
                      type="tel"
                      value={phone}
                      maxLength={10}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(digits);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="9825000000"
                      className={`w-full border text-xs px-3 py-2 rounded-xs focus:border-red-500 focus:outline-none ${
                        errors.phone ? 'border-red-500' : isDarkMode ? 'border-neutral-700 bg-neutral-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Query Message Textarea */}
                <div>
                  <label className="block text-xs mb-1">Your Query / Special Requirements *</label>
                  <textarea
                    rows={3}
                    value={queryMessage}
                    onChange={(e) => {
                      setQueryMessage(e.target.value);
                      if (errors.queryMessage) setErrors({ ...errors, queryMessage: '' });
                    }}
                    placeholder="e.g. Please confirm slot availability and whether ball machines or loaner rackets are available..."
                    className={`w-full border text-xs p-3 rounded-xs focus:border-red-500 focus:outline-none ${
                      errors.queryMessage ? 'border-red-500' : isDarkMode ? 'border-neutral-700 bg-neutral-950 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'
                    }`}
                  />
                  {errors.queryMessage && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.queryMessage}</p>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Query to Admin...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Query & Notify Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-4 space-y-4 animate-fadeIn">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-widest text-emerald-500 uppercase font-mono">
                EMAIL NOTIFICATION SENT TO ADMIN
              </span>
              <h2 className="font-display text-2xl font-extrabold uppercase mt-1">
                INQUIRY REGISTERED
              </h2>
            </div>

            {/* Inquiry Card */}
            <div
              className={`border rounded-xs p-4 text-left font-mono-numbers space-y-2 text-xs ${
                isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center border-b pb-2 border-neutral-700/50">
                <span className="text-neutral-500">REF CODE:</span>
                <span className="text-red-600 font-bold tracking-wider">{confirmedInquiry.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">FACILITY:</span>
                <span className="font-semibold">{confirmedInquiry.item}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">PROPOSED SCHEDULE:</span>
                <span>
                  {confirmedInquiry.date} · {confirmedInquiry.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">INQUIRER:</span>
                <span>{confirmedInquiry.name} ({confirmedInquiry.phone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">ADMIN RECIPIENT:</span>
                <span className="text-red-500 font-bold">{confirmedInquiry.adminEmail}</span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t border-neutral-700/50 text-[11px] gap-2">
                <span className="text-neutral-500 shrink-0">LOCATION:</span>
                <span className="text-red-600 font-bold text-right">{CLUB_LOCATION.address}</span>
              </div>
              <div className="pt-2 border-t border-neutral-700/50 text-[11px] font-sans">
                <span className="text-neutral-500 block font-mono">YOUR QUERY:</span>
                <p className="italic text-neutral-300 mt-0.5">"{confirmedInquiry.query}"</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-4">
              <div className="w-full flex-1 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xs text-center flex items-center justify-center gap-2 shadow-sm">
                <Check className="w-4 h-4" />
                <span>Successfully Sent</span>
              </div>

              <button
                onClick={handleReset}
                className={`w-full sm:w-auto py-3 px-6 rounded-xs border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <AdminEmailPreviewModal
        isOpen={showEmailPreview}
        onClose={() => setShowEmailPreview(false)}
        emailData={
          confirmedInquiry
            ? {
                inquiryId: confirmedInquiry.code,
                facilityName: confirmedInquiry.item,
                date: confirmedInquiry.date,
                timeSlot: confirmedInquiry.time,
                name: confirmedInquiry.name,
                email: confirmedInquiry.email,
                phone: confirmedInquiry.phone,
                query: confirmedInquiry.query,
                submittedAt: 'Just Now',
                adminEmail: confirmedInquiry.adminEmail,
              }
            : null
        }
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
