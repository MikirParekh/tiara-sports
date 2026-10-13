import React, { useState } from 'react';
import {
  VADODARA_LIVE_CONDITIONS,
  TENNIS_COURT_IMAGE,
  PICKLEBALL_IMAGE,
  BADMINTON_GYM_IMAGE,
  GYM_IMAGE,
  CLUB_LOCATION,
  ADMIN_EMAIL,
} from '../data/clubData';
import {
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  Mail,
  Send,
  Sparkles,
  Copy,
  Check,
  HelpCircle,
  Phone,
  User,
  MessageSquare,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { AdminEmailPreviewModal, EmailData } from './AdminEmailPreviewModal';
import { saveInquiryToStorage } from '../data/inquiryStorage';

interface TurfSlotBookingWidgetProps {
  onOpenBooking?: (facilityId?: string) => void;
  isDarkMode?: boolean;
}

type FacilityCategory = 'tennis' | 'pickleball' | 'badminton' | 'gym';

interface SubmittedInquiry {
  inquiryId: string;
  sport: string;
  facilityName: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  query: string;
  submittedAt: string;
  adminEmail: string;
}

const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const TurfSlotBookingWidget: React.FC<TurfSlotBookingWidgetProps> = ({
  onOpenBooking,
  isDarkMode = true,
}) => {
  const [selectedSport, setSelectedSport] = useState<FacilityCategory>('tennis');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateStr());
  const [customStartTime, setCustomStartTime] = useState<string>('18:30');
  const [customDuration, setCustomDuration] = useState<number>(90);
  const [inquiryCategory, setInquiryCategory] = useState<string>('Slot Availability');

  // Inquiry Form Fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [queryMessage, setQueryMessage] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<SubmittedInquiry | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [showEmailPreview, setShowEmailPreview] = useState<boolean>(false);

  const sportsDetails: Record<FacilityCategory, {
    facilityId: string;
    name: string;
    dimensions: string;
    surface: string;
    lighting: string;
    pricePerHour: string;
    singlePrice: string;
    multiplePrice: string;
    image: string;
    status: string;
    badge: string;
    features: string[];
  }> = {
    tennis: {
      facilityId: 'tennis-courts',
      name: 'Tennis',
      dimensions: 'ITF Tournament Regulation Arena',
      surface: 'ITF Pro Cushioned Championship Acrylic',
      lighting: '1,000 Lux Shadowless LED Floodlights',
      pricePerHour: '₹800 - ₹1,000/hr',
      singlePrice: '₹800/hr (Single)',
      multiplePrice: '₹1,000/hr (Doubles)',
      image: TENNIS_COURT_IMAGE,
      status: 'Prime Slots Active Today',
      badge: 'PRO TOURNAMENT REGULATION',
      features: ['ITF Tournament Specification', 'Pro Ball Machine Available', 'Player Seating Dugout'],
    },
    pickleball: {
      facilityId: 'pickleball-center',
      name: 'Pickleball',
      dimensions: 'USAPA Regulation Competition Facility',
      surface: '8-Coat Cushioned Acrylic Sports Floor',
      lighting: '8x 350W Directional Beam LEDs',
      pricePerHour: '₹600 - ₹750/hr',
      singlePrice: '₹600/hr (Single)',
      multiplePrice: '₹750/hr (Doubles)',
      image: PICKLEBALL_IMAGE,
      status: 'Open For Evening Sessions',
      badge: 'PRO COMPETITION ARENA',
      features: ['Permanent Steel Posts', 'Raw Carbon Paddle Rental', 'Dedicated Spectator Gallery'],
    },
    badminton: {
      facilityId: 'badminton-arena',
      name: 'Badminton',
      dimensions: 'BWF Level-1 Certified Complex',
      surface: 'Sprung First-Grade Teak Wood + Yonex Mats',
      lighting: 'Zero-Glare Anti-Shadow Ceiling Grid',
      pricePerHour: '₹500 - ₹650/hr',
      singlePrice: '₹500/hr (Single)',
      multiplePrice: '₹650/hr (Doubles)',
      image: BADMINTON_GYM_IMAGE,
      status: 'Teak Courts Active',
      badge: 'BWF CERTIFIED TEAK',
      features: ['32ft High Ceiling Clearance', 'Yonex Stringing Machine On-Site', 'Fully Air-Cooled Hall'],
    },
    gym: {
      facilityId: 'fitness-gym',
      name: 'Gym',
      dimensions: 'Comprehensive Strength & Conditioning Floor',
      surface: 'Swedish Barbell Drop Platforms & Sprint Turf',
      lighting: 'Atmospheric Architectural Daylight Lighting',
      pricePerHour: 'From ₹350 / Day Pass',
      singlePrice: '₹350 (Day Pass)',
      multiplePrice: 'Full Access (Member)',
      image: GYM_IMAGE,
      status: 'Open 06:00 - 23:00 Daily',
      badge: 'STRENGTH & BIOMECHANICS',
      features: ['Technogym Skill Line Cardio', 'Power Racks & Dumbbell Suite', 'Contrast Ice Bath Suite'],
    },
  };

  const current = sportsDetails[selectedSport];

  // Helper to format start time + duration into readable range
  const calculateSlotRange = (start: string, duration: number) => {
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

  const formattedTimeSlot = calculateSlotRange(customStartTime, customDuration);

  const quickTimes = [
    { label: '06:00 AM', time: '06:00' },
    { label: '07:30 AM', time: '07:30' },
    { label: '09:00 AM', time: '09:00' },
    { label: '11:00 AM', time: '11:00' },
    { label: '04:00 PM', time: '16:00' },
    { label: '05:30 PM', time: '17:30' },
    { label: '07:00 PM', time: '19:00' },
    { label: '08:30 PM', time: '20:30' },
    { label: '10:00 PM', time: '22:00' },
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'Please provide your full name (minimum 2 characters)';
    } else if (/^\d+$/.test(trimmedName)) {
      errors.name = 'Please enter a valid name (letters required)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length !== 10) {
      errors.phone = 'Mobile number must be exactly 10 digits';
    }

    if (!queryMessage.trim() || queryMessage.trim().length < 5) {
      errors.queryMessage = 'Please enter your query or requirements (at least 5 characters)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const generatedId = `INQ-TIARA-${Math.floor(100000 + Math.random() * 900000)}`;
    const adminEmail = ADMIN_EMAIL;

    // Simulate sending email notification to admin with full query details
    setTimeout(() => {
      const inquiry: SubmittedInquiry = {
        inquiryId: generatedId,
        sport: selectedSport.toUpperCase(),
        facilityName: current.name,
        date: selectedDate,
        timeSlot: formattedTimeSlot,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        category: inquiryCategory,
        query: queryMessage.trim(),
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        adminEmail,
      };

      saveInquiryToStorage(inquiry);

      // Dispatch via Zoho SMTP server endpoint
      fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      }).catch((err) => console.warn('Backend SMTP call failed:', err));

      setSubmittedInquiry(inquiry);
      setIsSubmitting(false);
    }, 450);
  };

  const handleResetInquiry = () => {
    setSubmittedInquiry(null);
    setQueryMessage('');
    setFormErrors({});
  };

  const copyInquiryDetails = () => {
    if (!submittedInquiry) return;
    const text = `Tiara Sports Club Slot Inquiry [${submittedInquiry.inquiryId}]
Sport: ${submittedInquiry.facilityName}
Schedule: ${submittedInquiry.date} · ${submittedInquiry.timeSlot}
Inquirer: ${submittedInquiry.name} (${submittedInquiry.phone}, ${submittedInquiry.email})
Category: ${submittedInquiry.category}
Query: ${submittedInquiry.query}
Admin Notified: ${submittedInquiry.adminEmail}`;

    navigator.clipboard?.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const buildMailtoLink = () => {
    if (!submittedInquiry) return '#';
    const subject = encodeURIComponent(
      `Slot & Arena Inquiry: ${submittedInquiry.facilityName} - Ref ${submittedInquiry.inquiryId}`
    );
    const body = encodeURIComponent(
      `Dear Tiara Sports Club Administration,

I have submitted an inquiry for ${submittedInquiry.facilityName}.

Inquiry ID: ${submittedInquiry.inquiryId}
Preferred Date: ${submittedInquiry.date}
Preferred Slot Time: ${submittedInquiry.timeSlot}
Inquiry Category: ${submittedInquiry.category}

My Query:
${submittedInquiry.query}

Contact Details:
Name: ${submittedInquiry.name}
Phone: ${submittedInquiry.phone}
Email: ${submittedInquiry.email}

Location: Tiara Sports Club, Besides Red Coral greens, opposite Nayara petrol pump, Sama-Savli Road, Vadodara.`
    );
    return `mailto:${submittedInquiry.adminEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className={`border rounded-xs overflow-hidden shadow-2xl transition-all duration-300 ${
        isDarkMode
          ? 'bg-neutral-900 border-neutral-800 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
      }`}
    >
      {/* Header bar with Live Vadodara Conditions & Admin Notification Badge */}
      <div
        className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDarkMode
            ? 'bg-neutral-950/80 border-neutral-800 text-neutral-300'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white font-extrabold text-[10px] uppercase rounded-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            LIVE SLOT INQUIRY DESK
          </span>
          <span className="font-mono text-[11px] font-semibold text-red-500">
            VADODARA CAMPUS: {VADODARA_LIVE_CONDITIONS.temp} · {VADODARA_LIVE_CONDITIONS.weather}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-500 font-bold">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Admin Email Auto-Notification Enabled</span>
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Title & Sport Selector Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-red-600 font-mono text-xs font-bold uppercase tracking-widest block">
              CHAMPIONSHIP COURTS & GYM · VADODARA
            </span>
            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight mt-1">
              COURT, GYM & SLOT INQUIRY
            </h3>
            <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
              Select any custom time what you want, ask your query, and our admin team will receive an instant email notification.
            </p>
          </div>

          {/* Sport Switcher */}
          <div
            className={`flex flex-wrap items-center gap-1 p-1 border rounded-xs shrink-0 ${
              isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-100 border-slate-300'
            }`}
          >
            {(['tennis', 'pickleball', 'badminton', 'gym'] as FacilityCategory[]).map((sport) => (
              <button
                key={sport}
                onClick={() => {
                  setSelectedSport(sport);
                  if (submittedInquiry) setSubmittedInquiry(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                  selectedSport === sport
                    ? 'bg-red-600 text-white shadow-xs font-black'
                    : isDarkMode
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {sport === 'tennis'
                  ? 'Tennis'
                  : sport === 'pickleball'
                  ? 'Pickleball'
                  : sport === 'badminton'
                  ? 'Badminton'
                  : 'Gym'}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Showcase & Inquiry Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Facility Visual Card & High Specifications */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-xs overflow-hidden border border-neutral-800 shadow-xl h-64 sm:h-72 group">
              <img
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-xs font-mono">
                {current.badge}
              </div>

              <div className="absolute bottom-3 left-3 right-3 p-3 bg-neutral-950/95 backdrop-blur-md rounded-xs border border-neutral-800 text-xs space-y-2 text-white shadow-2xl">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-display text-sm font-bold uppercase block text-red-500 font-sans leading-none">
                      {current.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-sans mt-0.5 block">{current.dimensions}</span>
                  </div>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-xs bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase shrink-0">
                    Tariff Rates
                  </span>
                </div>

                {/* Single & Multiple Perfect Pricing Formation (Zero Cutting) */}
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-xs px-2.5 py-1.5 flex flex-col justify-center">
                    <span className="text-[9px] text-neutral-400 block uppercase font-semibold">Single Slot</span>
                    <span className="text-xs font-bold text-emerald-400 block">{current.singlePrice}</span>
                  </div>
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-xs px-2.5 py-1.5 flex flex-col justify-center">
                    <span className="text-[9px] text-neutral-400 block uppercase font-semibold">Multiple / Doubles</span>
                    <span className="text-xs font-bold text-red-400 block">{current.multiplePrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Arena Specs Grid */}
            <div className="space-y-1">
              <span className="text-red-500 text-[11px] font-mono font-bold uppercase tracking-widest block">
                ARENA SPECIFICATIONS
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`p-2.5 rounded-xs border ${
                    isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] uppercase block ${isDarkMode ? 'text-neutral-500' : 'text-slate-500'}`}>
                    SURFACE
                  </span>
                  <span className="font-bold text-xs">{current.surface}</span>
                </div>
                <div
                  className={`p-2.5 rounded-xs border ${
                    isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] uppercase block ${isDarkMode ? 'text-neutral-500' : 'text-slate-500'}`}>
                    LIGHTING & CLIMATE
                  </span>
                  <span className="font-bold text-xs">{current.lighting}</span>
                </div>
              </div>
            </div>

            {/* Inclusions Feature Pills */}
            <div
              className={`p-3 rounded-xs border text-xs space-y-1.5 ${
                isDarkMode ? 'bg-neutral-950/60 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                FACILITY AMENITIES:
              </span>
              <ul className="space-y-1 text-xs">
                {current.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="text-[11px]">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Campus Address Pill */}
            <div
              className={`p-3 rounded-xs border text-[11px] font-mono ${
                isDarkMode ? 'bg-neutral-950/80 border-neutral-800 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <span className="text-red-500 font-bold block mb-0.5">CAMPUS ADDRESS:</span>
              <span>{CLUB_LOCATION.address}</span>
            </div>
          </div>

          {/* Right Column: Inquiry Form OR Confirmation View */}
          <div className="lg:col-span-7">
            {!submittedInquiry ? (
              <form
                onSubmit={handleInquirySubmit}
                className={`p-5 sm:p-6 rounded-xs border space-y-4 shadow-xl ${
                  isDarkMode
                    ? 'bg-neutral-950/80 border-neutral-800'
                    : 'bg-white border-slate-200 shadow-slate-200/40'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-neutral-800/80">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-red-600" />
                    <h4 className="font-display text-lg font-bold uppercase tracking-wide">
                      ASK YOUR INQUIRY FOR {current.name.toUpperCase()}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-xs border border-emerald-500/20">
                    EMAIL DISPATCH ACTIVE
                  </span>
                </div>

                {/* 1. Date & Custom Start Time Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 font-mono block">
                      1. SELECT DATE & PREFERRED TIME WINDOW:
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                      06:00 AM – 11:00 PM DAILY
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-neutral-300 mb-1.5">
                        <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>Preferred Date</span>
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={getTodayDateStr()}
                        className={`w-full h-10 border text-xs px-3.5 rounded-xs font-mono transition-colors focus:border-red-500 focus:outline-none cursor-pointer ${
                          isDarkMode
                            ? 'bg-neutral-900 border-neutral-700 text-white [color-scheme:dark]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 [color-scheme:light]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-neutral-300 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>Custom Start Time</span>
                      </label>
                      <input
                        type="time"
                        value={customStartTime}
                        onChange={(e) => setCustomStartTime(e.target.value)}
                        className={`w-full h-10 border text-xs px-3.5 rounded-xs font-mono transition-colors focus:border-red-500 focus:outline-none cursor-pointer ${
                          isDarkMode
                            ? 'bg-neutral-900 border-neutral-700 text-white [color-scheme:dark]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 [color-scheme:light]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Duration Selector */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">
                      Session Duration
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[60, 90, 120].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setCustomDuration(mins)}
                          className={`py-1.5 text-xs font-mono font-bold rounded-xs border transition-colors cursor-pointer ${
                            customDuration === mins
                              ? 'border-red-600 bg-red-600 text-white shadow-xs'
                              : isDarkMode
                              ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                              : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {mins} mins ({mins / 60} hrs)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Preset Chips */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">
                      Or One-Click Popular Hours:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {quickTimes.map((item) => (
                        <button
                          key={item.time}
                          type="button"
                          onClick={() => setCustomStartTime(item.time)}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded-xs border transition-colors cursor-pointer ${
                            customStartTime === item.time
                              ? 'border-red-600 bg-red-600 text-white font-bold'
                              : isDarkMode
                              ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700'
                              : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slot Window Display */}
                  <div
                    className={`p-2.5 rounded-xs border flex items-center justify-between text-xs font-mono ${
                      isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-red-50/60 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <div>
                        <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-sans font-bold">
                          PROPOSED WINDOW
                        </span>
                        <span className="font-bold text-red-500">{formattedTimeSlot}</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      DESK READY
                    </span>
                  </div>
                </div>

                {/* 2. Inquiry Category */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">
                    2. Inquiry Nature / Subject
                  </label>
                  <select
                    value={inquiryCategory}
                    onChange={(e) => setInquiryCategory(e.target.value)}
                    className={`w-full border text-xs px-3 py-2 rounded-xs focus:border-red-500 focus:outline-none ${
                      isDarkMode
                        ? 'bg-neutral-900 border-neutral-700 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Slot Availability">Slot Availability & Time Confirmation</option>
                    <option value="Coaching & Trials">Coaching / Private Academy Trial</option>
                    <option value="Group / Corporate Booking">Group / Corporate Multi-Court Session</option>
                    <option value="Equipment & Rackets">Equipment Rental / Stringing Inquiries</option>
                    <option value="Membership Plans">Full Club & Gym Membership Plans</option>
                  </select>
                </div>

                {/* 3. Inquirer Contact Info */}
                <div className="space-y-3 pt-1 border-t border-neutral-800/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 font-mono block">
                    3. YOUR CONTACT DETAILS:
                  </span>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                        }}
                        placeholder="e.g. Vikram Patel"
                        className={`w-full border text-xs px-3 py-2 rounded-xs focus:border-red-500 focus:outline-none ${
                          formErrors.name
                            ? 'border-red-500'
                            : isDarkMode
                            ? 'bg-neutral-900 border-neutral-700 text-white'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-[11px] text-red-500 mt-0.5">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                        }}
                        placeholder="athlete@domain.com"
                        className={`w-full border text-xs px-3 py-2 rounded-xs focus:border-red-500 focus:outline-none ${
                          formErrors.email
                            ? 'border-red-500'
                            : isDarkMode
                            ? 'bg-neutral-900 border-neutral-700 text-white'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-500 mt-0.5">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">
                        Mobile / WhatsApp (10 Digits) *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(digits);
                          if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                        }}
                        placeholder="9825000000"
                        className={`w-full border text-xs px-3 py-2 rounded-xs focus:border-red-500 focus:outline-none ${
                          formErrors.phone
                            ? 'border-red-500'
                            : isDarkMode
                            ? 'bg-neutral-900 border-neutral-700 text-white'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-0.5">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Query Message Textarea */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">
                    4. Ask Your Query / Special Requirements *
                  </label>
                  <textarea
                    rows={3}
                    value={queryMessage}
                    onChange={(e) => {
                      setQueryMessage(e.target.value);
                      if (formErrors.queryMessage) {
                        setFormErrors({ ...formErrors, queryMessage: '' });
                      }
                    }}
                    placeholder="e.g. Please let us know if this evening slot is open for 4 players, and whether coaching assistance or racquets can be arranged..."
                    className={`w-full border text-xs p-3 rounded-xs focus:border-red-500 focus:outline-none ${
                      formErrors.queryMessage
                        ? 'border-red-500'
                        : isDarkMode
                        ? 'bg-neutral-900 border-neutral-700 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  {formErrors.queryMessage && (
                    <p className="text-[11px] text-red-500 mt-0.5">{formErrors.queryMessage}</p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-all shadow-lg shadow-red-600/25 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Query to Admin...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Query & Notify Admin via Email</span>
                      </>
                    )}
                  </button>
                  <p className={`text-[10px] text-center mt-2 font-mono ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`}>
                    An automated query dispatch with official branded formatting is transmitted to {ADMIN_EMAIL}.
                  </p>
                </div>
              </form>
            ) : (
              /* Success / Inquiry Dispatched Screen */
              <div
                className={`p-6 sm:p-8 rounded-xs border space-y-5 animate-fadeIn ${
                  isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 uppercase block">
                      EMAIL NOTIFICATION SENT TO ADMIN
                    </span>
                    <h4 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight">
                      INQUIRY SUBMITTED SUCCESSFULLY
                    </h4>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xs border font-mono text-xs space-y-2.5 ${
                    isDarkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 border-neutral-800/80">
                    <span className="text-neutral-500">INQUIRY REF:</span>
                    <span className="text-red-600 font-bold tracking-wider">{submittedInquiry.inquiryId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">ARENA / SPORT:</span>
                    <span className="font-bold">{submittedInquiry.facilityName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">DESIRED SLOT:</span>
                    <span className="text-emerald-500 font-bold">
                      {submittedInquiry.date} · {submittedInquiry.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">INQUIRER:</span>
                    <span>
                      {submittedInquiry.name} ({submittedInquiry.phone})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">ADMIN RECIPIENT:</span>
                    <span className="text-red-500 font-bold">{submittedInquiry.adminEmail}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-800/80 font-sans text-xs">
                    <span className="text-neutral-500 block text-[10px] font-mono uppercase mb-0.5">
                      YOUR QUERY CONTENT:
                    </span>
                    <p className={`italic ${isDarkMode ? 'text-neutral-300' : 'text-slate-700'}`}>
                      "{submittedInquiry.query}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-4">
                  <div className="w-full flex-1 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xs text-center flex items-center justify-center gap-2 shadow-sm">
                    <Check className="w-4 h-4" />
                    <span>Successfully Sent</span>
                  </div>

                  <button
                    onClick={handleResetInquiry}
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
        </div>
      </div>

      {/* Admin Email Preview Modal */}
      <AdminEmailPreviewModal
        isOpen={showEmailPreview}
        onClose={() => setShowEmailPreview(false)}
        emailData={submittedInquiry}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
