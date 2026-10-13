import React, { useState } from 'react';
import { NavRoute } from '../../types';
import { CLUB_LOCATION, ADMIN_EMAIL } from '../../data/clubData';
import { saveInquiryToStorage } from '../../data/inquiryStorage';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Navigation, 
  ExternalLink, 
  Copy, 
  Check, 
  Car, 
  Compass, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (route: NavRoute) => void;
  isDarkMode?: boolean;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigate,
  isDarkMode = true,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sportCategory, setSportCategory] = useState('Lawn Tennis');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const GPS_COORDINATES = '22.3420° N, 73.1890° E';
  const GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query=Tiara+Sports+Club+Besides+Red+Coral+greens+opposite+Nayara+petrol+pump+sama-savli+road+Vadodara';
  const GOOGLE_MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=Tiara+Sports+Club+Besides+Red+Coral+greens+opposite+Nayara+petrol+pump+sama-savli+road+Vadodara';

  const validate = () => {
    const errs: Record<string, string> = {};
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errs.name = 'Please provide your full name (minimum 2 characters)';
    } else if (/^\d+$/.test(trimmedName)) {
      errs.name = 'Please enter a valid name (letters required)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length !== 10) {
      errs.phone = 'Contact phone must be exactly 10 digits';
    }

    if (!message.trim() || message.trim().length < 5) {
      errs.message = 'Please enter a message of at least 5 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const refCode = `TIARA-VAD-${Math.floor(100000 + Math.random() * 900000)}`;

    const inquiryPayload = {
      inquiryId: refCode,
      facilityName: sportCategory,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeSlot: 'General Campus Hours (06:00 - 23:00)',
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category: 'General Desk Inquiry',
      query: message.trim(),
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      adminEmail: ADMIN_EMAIL,
    };

    saveInquiryToStorage(inquiryPayload);

    // Dispatch via Zoho SMTP server endpoint
    fetch('/api/send-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryPayload),
    }).catch((err) => console.warn('Backend SMTP call failed:', err));

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRef(refCode);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 500);
  };

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText('22.3150, 73.1320');
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2200);
  };

  const mailtoLink = () => {
    if (!submittedRef) return '#';
    const sub = encodeURIComponent(`General Inquiry - Ref ${submittedRef}`);
    const b = encodeURIComponent(`Dear Tiara Sports Club Administration,

Inquiry Ref: ${submittedRef}
Admin Recipient: ${ADMIN_EMAIL}

Thank you for your prompt review of this Vadodara campus inquiry.`);

    return `mailto:${ADMIN_EMAIL}?subject=${sub}&body=${b}`;
  };

  return (
    <div
      className={`min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDarkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider rounded-xs bg-red-600/10 border border-red-600/30 text-red-500">
            <Compass className="w-3.5 h-3.5 text-red-600" />
            <span>VADODARA SECRETARIAT & CAMPUS COORDINATES · SAMA-SAVLI ROAD</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
            CONTACT TIARA SPORTS CLUB
          </h1>
          <p
            className={`text-sm sm:text-base leading-relaxed mt-2 ${
              isDarkMode ? 'text-neutral-400' : 'text-slate-600'
            }`}
          >
            Connect with our athletic directors for club memberships, 
            tennis academy trials, pickleball slots, badminton arena sessions, or visit our campus in Vadodara, Gujarat.
          </p>
        </div>

        {/* SECTION 1: INTERACTIVE GOOGLE MAP LOCATION SHOWCASE */}
        <div
          className={`border rounded-xs overflow-hidden shadow-xl ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-300'
          }`}
        >
          {/* Map Top Action Header */}
          <div
            className={`p-4 sm:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDarkMode ? 'border-neutral-800 bg-neutral-950/60' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="font-mono text-xs font-bold uppercase text-red-500 tracking-wider">
                  DIRECT CLUB LOCATION SHOWCASE · GOOGLE MAPS
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase mt-1">
                TIARA SPORTS CLUB CAMPUS, VADODARA
              </h2>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                {CLUB_LOCATION.address} · Vadodara, Gujarat 391101
              </p>
            </div>

            {/* Direct Map Action Links */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 shadow-md shadow-red-600/20"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </a>

              <a
                href={GOOGLE_MAPS_SEARCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3.5 py-2 font-bold text-xs uppercase tracking-wider rounded-xs border transition-colors flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <button
                onClick={handleCopyCoords}
                className={`px-3 py-2 text-xs font-mono font-bold rounded-xs border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDarkMode
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="Copy Lat, Long GPS Coordinates"
              >
                {copiedCoords ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">COPIED GPS!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{GPS_COORDINATES}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Google Map Embed Frame */}
          <div className="relative w-full h-[380px] sm:h-[460px] bg-neutral-950">
            <iframe
              title="Tiara Sports Club Vadodara Google Map Location"
              src={`https://maps.google.com/maps?q=Tiara+Sports+Club+Besides+Red+Coral+greens+opposite+Nayara+petrol+pump+sama-savli+road+Vadodara&t=${mapType === 'satellite' ? 'k' : 'm'}&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter saturate-110"
            />

            {/* Floating Map Overlay Controls */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-xs border border-neutral-800 text-xs shadow-lg">
              <button
                onClick={() => setMapType('standard')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  mapType === 'standard' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Road Map</span>
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  mapType === 'satellite' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>Satellite</span>
              </button>
            </div>

            {/* Direct Location Marker Badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 p-3 sm:p-4 bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-xs text-xs space-y-1.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-red-500 uppercase text-[10px]">
                  VERIFIED VENUE · VADODARA, GUJARAT
                </span>
                <span className="text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> GATES OPEN NOW
                </span>
              </div>
              <div className="text-white font-bold text-sm">
                Tiara Sports Club Complex
              </div>
              <div className="text-neutral-400 text-[11px]">
                Besides Red Coral greens, opposite Nayara petrol pump, Sama-Savli Road Vadodara. 
                Dedicated visitor parking entry via Gate 1.
              </div>
            </div>
          </div>

          {/* Transit & Landmarks Grid */}
          <div
            className={`p-4 sm:p-6 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs ${
              isDarkMode ? 'border-neutral-800 bg-neutral-950/40' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div>
              <div className="font-mono font-bold text-red-500 text-[10px] uppercase">
                COMMERCIAL CENTER
              </div>
              <div className="font-bold text-sm mt-0.5">Alkapuri, Vadodara</div>
              <div className={isDarkMode ? 'text-neutral-400' : 'text-slate-500'}>
                15 mins (8.2 km via Gotri)
              </div>
            </div>
            <div>
              <div className="font-mono font-bold text-red-500 text-[10px] uppercase">
                RAILWAY TRANSIT
              </div>
              <div className="font-bold text-sm mt-0.5">Vadodara Junction</div>
              <div className={isDarkMode ? 'text-neutral-400' : 'text-slate-500'}>
                18 mins (10.5 km)
              </div>
            </div>
            <div>
              <div className="font-mono font-bold text-red-500 text-[10px] uppercase">
                AIRPORT ACCESS
              </div>
              <div className="font-bold text-sm mt-0.5">Vadodara Airport (BDQ)</div>
              <div className={isDarkMode ? 'text-neutral-400' : 'text-slate-500'}>
                25 mins (14.8 km)
              </div>
            </div>
            <div>
              <div className="font-mono font-bold text-red-500 text-[10px] uppercase">
                CAMPUS PARKING
              </div>
              <div className="font-bold text-sm mt-0.5">Gate 1 Parking Plaza</div>
              <div className={isDarkMode ? 'text-neutral-400' : 'text-slate-500'}>
                200+ bays · EV Chargers
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT COORDINATES & INQUIRY FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Coordinates Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className={`border rounded-xs p-6 space-y-5 ${
                isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
                SECRETARIAT & DESK
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase">Campus Address</span>
                    <span className={isDarkMode ? 'text-neutral-400' : 'text-slate-600'}>
                      {CLUB_LOCATION.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase">Club Operating Hours</span>
                    <span className={isDarkMode ? 'text-neutral-400' : 'text-slate-600'}>
                      {CLUB_LOCATION.timings}
                    </span>
                    <span className="block text-[11px] text-emerald-500 font-mono mt-0.5">
                      Courts and gym active until 23:00 daily
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase">Direct Helpline Numbers</span>
                    <span className="font-mono-numbers block font-medium">
                      Landline: {CLUB_LOCATION.phone}
                    </span>
                    <span className="font-mono-numbers block font-medium">
                      Mobile & WhatsApp: {CLUB_LOCATION.mobile}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase">Official Club Email</span>
                    <span className="font-mono">{CLUB_LOCATION.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div
              className={`border rounded-xs p-5 text-xs space-y-3 ${
                isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <span className="font-bold text-red-600 uppercase tracking-wider block font-mono">
                VISITOR ENTRY & PROTOCOLS
              </span>
              <p>
                Visitors and academy guests must register at Reception Gate 1. 
                Proper non-marking shoes are strictly required for badminton and tennis courts.
              </p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => onNavigate('facilities')}
                  className="text-red-500 hover:text-red-400 font-bold uppercase inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Court Rules & Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div
            className={`lg:col-span-7 border rounded-xs p-6 sm:p-8 ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {!submittedRef ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
                  SEND OFFICIAL INQUIRY
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Our secretariat in Vadodara will get in touch within 24 hours regarding membership, turf slots, or coaching.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. Hardik Patel"
                      className={`w-full border text-xs px-3.5 py-2.5 rounded-xs focus:border-red-500 focus:outline-none ${
                        isDarkMode ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="member@domain.com"
                      className={`w-full border text-xs px-3.5 py-2.5 rounded-xs focus:border-red-500 focus:outline-none ${
                        isDarkMode ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Contact Phone (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      maxLength={10}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(digits);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="9800000000"
                      className={`w-full border text-xs px-3.5 py-2.5 rounded-xs focus:border-red-500 focus:outline-none ${
                        isDarkMode ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Sport / Facility of Interest
                    </label>
                    <select
                      value={sportCategory}
                      onChange={(e) => setSportCategory(e.target.value)}
                      className={`w-full border text-xs px-3.5 py-2.5 rounded-xs focus:border-red-500 focus:outline-none ${
                        isDarkMode ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Tennis">Tennis</option>
                      <option value="Pickleball">Pickleball</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Gym & Fitness">Gym & Fitness</option>
                      <option value="Club Membership">Club Membership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Your Requirements / Message *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    placeholder="Provide details about your preferred timing, coaching, or membership plans in Vadodara..."
                    className={`w-full border text-xs p-3.5 rounded-xs focus:border-red-500 focus:outline-none ${
                      isDarkMode ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>DISPATCHING TO VADODARA DESK...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Tiara Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <h3 className="font-display text-2xl font-bold uppercase">
                  INQUIRY RECORDED IN VADODARA
                </h3>

                <div
                  className={`border rounded-xs p-4 text-xs font-mono max-w-sm mx-auto space-y-1 ${
                    isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-neutral-500">REFERENCE NUMBER:</div>
                  <div className="text-red-600 font-bold text-sm">{submittedRef}</div>
                </div>

                <p className={`text-xs max-w-md mx-auto ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                  Thank you for reaching out to TIARA SPORTS CLUB. An automated inquiry notification has been dispatched to admin email: <span className="font-mono text-red-500 font-bold">{ADMIN_EMAIL}</span>. Our representative will contact you promptly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-4">
                  <div className="w-full sm:w-auto flex-1 px-6 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xs text-center flex items-center justify-center gap-2 shadow-sm">
                    <Check className="w-4 h-4" />
                    <span>Successfully Sent</span>
                  </div>

                  <button
                    onClick={() => setSubmittedRef(null)}
                    className={`px-6 py-3 border text-xs font-bold uppercase rounded-xs cursor-pointer transition-colors ${
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
        </div>
      </div>
    </div>
  );
};
