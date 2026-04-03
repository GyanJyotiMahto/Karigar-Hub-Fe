import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, MapPin, Image, BookOpen, Settings,
  Shield, ChevronRight, ChevronLeft, Upload, X, Check, Eye, EyeOff
} from 'lucide-react';
import { register, uploadArtistProfileImage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 1, label: 'Basic Info',    icon: User },
  { id: 2, label: 'Business',      icon: Briefcase },
  { id: 3, label: 'Address',       icon: MapPin },
  { id: 4, label: 'Portfolio',     icon: Image },
  { id: 5, label: 'Story',         icon: BookOpen },
  { id: 6, label: 'Preferences',   icon: Settings },
  { id: 7, label: 'Verification',  icon: Shield },
];

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Jammu & Kashmir','Ladakh','Delhi',
];

const CRAFT_CATEGORIES = [
  'Handloom & Weaving','Pottery & Ceramics','Jewellery & Metalwork','Paintings & Art',
  'Wooden Crafts','Leather Craft','Embroidery & Needlework','Stone Carving',
  'Bamboo & Cane','Terracotta','Glass & Lacquerware','Paper Craft',
];

const inputCls = 'w-full px-4 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#B09070] text-sm focus:outline-none focus:border-[#C0522B] focus:ring-2 focus:ring-[#C0522B]/10 transition-all';
const labelCls = 'block text-sm font-semibold text-[#2C1A0E] mb-1.5';
const selectCls = inputCls + ' cursor-pointer';

function Field({ label, children, hint }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-xs text-[#9B7A5A] mt-1">{hint}</p>}
    </div>
  );
}

function TagInput({ tags, setTags, placeholder }) {
  const [val, setVal] = useState('');
  const add = () => {
    const t = val.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setVal('');
  };
  return (
    <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-[#E8D5B0] bg-white min-h-[48px]">
      {tags.map(t => (
        <span key={t} className="flex items-center gap-1 bg-[#C0522B]/10 text-[#C0522B] text-xs font-semibold px-2.5 py-1 rounded-full">
          {t}
          <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X size={10} /></button>
        </span>
      ))}
      <input
        value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        placeholder={tags.length === 0 ? placeholder : 'Add more...'}
        className="flex-1 min-w-[120px] text-sm outline-none bg-transparent text-[#2C1A0E] placeholder-[#B09070]"
      />
    </div>
  );
}

function FileUpload({ label, multiple, accept, files, setFiles, hint }) {
  const ref = useRef();
  const handleFiles = e => {
    const arr = Array.from(e.target.files);
    setFiles(multiple ? [...files, ...arr] : arr);
  };
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div
        onClick={() => ref.current.click()}
        className="border-2 border-dashed border-[#E8D5B0] rounded-xl p-5 text-center cursor-pointer hover:border-[#C0522B] hover:bg-[#C0522B]/5 transition-all group"
      >
        <Upload size={22} className="mx-auto mb-2 text-[#B09070] group-hover:text-[#C0522B] transition-colors" />
        <p className="text-sm text-[#7B5C3A] font-medium">Click to upload {multiple ? 'files' : 'file'}</p>
        <p className="text-xs text-[#B09070] mt-0.5">{hint || 'PNG, JPG, PDF up to 5MB each'}</p>
        <input ref={ref} type="file" multiple={multiple} accept={accept} className="hidden" onChange={handleFiles} />
      </div>
      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-[#1E4D2B]/10 text-[#1E4D2B] text-xs font-medium px-2.5 py-1.5 rounded-lg">
              <Check size={11} />
              <span className="max-w-[120px] truncate">{f.name}</span>
              <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X size={10} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KarigarSignup({ onSubmit, showPass, setShowPass }) {
  const { saveUser } = useAuth();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Step 1 — Basic Info
  const [basic, setBasic] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });

  // Step 2 — Business
  const [biz, setBiz] = useState({ shopName: '', craftCategory: '', experience: '', gst: '', website: '' });
  const [specialties, setSpecialties] = useState([]);

  // Step 3 — Address
  const [addr, setAddr] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', country: 'India' });

  // Step 4 — Portfolio
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);

  // Step 5 — Bio & Story
  const [bio, setBio] = useState({ bio: '', story: '', youtube: '' });

  // Step 6 — Preferences
  const [prefs, setPrefs] = useState({
    customOrders: false, bulkOrders: false,
    shipping: { selfShip: false, platformShip: true, expressShip: false },
    processingDays: '3–5',
    themes: [],
  });

  // Step 7 — Verification
  const [verify, setVerify] = useState({ aadhaar: '', pan: '', bankName: '', accountNo: '', ifsc: '', upi: '' });
  const [verifyDocs, setVerifyDocs] = useState([]);
  const [agreed, setAgreed] = useState(false);

  const go = d => { setDir(d); setStep(s => s + d); };

  const handleFinalSubmit = async () => {
    if (!agreed) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const data = await register({
        name: `${basic.firstName} ${basic.lastName}`.trim(),
        email: basic.email,
        phone: basic.phone,
        password: basic.password,
        businessName: biz.shopName,
        category: biz.craftCategory,
        bio: bio.bio,
        address: {
          addressLine: addr.line1,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
        },
        gstNumber: biz.gst || undefined,
        aadhaarNumber: verify.aadhaar || undefined,
        panNumber: verify.pan || undefined,
        bankDetails: verify.bankName ? {
          accountHolderName: basic.firstName + ' ' + basic.lastName,
          bankName: verify.bankName,
          accountNumber: verify.accountNo,
          ifscCode: verify.ifsc,
        } : { accountHolderName: basic.firstName, bankName: 'N/A', accountNumber: '0', ifscCode: 'N/A' },
        role: 'artist',
      });
      saveUser(data);
      // Upload profile photo to Cloudinary and save to DB
      if (profilePhoto.length > 0) {
        try { await uploadArtistProfileImage(profilePhoto[0]); } catch {}
      }
      // Upload portfolio images as a showcase product
      if (portfolioFiles.length > 0) {
        try {
          const { uploadProductImages, createProduct } = await import('../services/api');
          const { urls } = await uploadProductImages(portfolioFiles.slice(0, 5));
          await createProduct({
            name: `${biz.shopName || basic.firstName + "'s Work"} — Portfolio`,
            description: bio.bio || `Handcrafted work by ${basic.firstName} ${basic.lastName}`,
            category: biz.craftCategory || 'Handloom & Weaving',
            price: 0,
            stock: 1,
            images: urls,
          });
        } catch {}
      }
      onSubmit();
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const variants = {
    enter: d => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: d => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-semibold text-[#1E4D2B]">Step {step} of {STEPS.length}</span>
          <span className="text-xs text-[#7B5C3A]">{STEPS[step - 1].label}</span>
        </div>
        <div className="h-1.5 bg-[#E8D5B0] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#1E4D2B] to-[#C0522B] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-between mt-2.5">
          {STEPS.map(s => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  done ? 'bg-[#1E4D2B] text-white' : active ? 'bg-[#C0522B] text-white ring-4 ring-[#C0522B]/20' : 'bg-[#E8D5B0] text-[#9B7A5A]'
                }`}>
                  {done ? <Check size={12} /> : <Icon size={12} />}
                </div>
                <span className={`text-[9px] font-semibold hidden sm:block ${active ? 'text-[#C0522B]' : done ? 'text-[#1E4D2B]' : 'text-[#B09070]'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="space-y-4"
          >
            {/* ── Step 1: Basic Info ── */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name">
                    <input value={basic.firstName} onChange={e => setBasic({ ...basic, firstName: e.target.value })}
                      type="text" placeholder="Sunita" className={inputCls} />
                  </Field>
                  <Field label="Last Name">
                    <input value={basic.lastName} onChange={e => setBasic({ ...basic, lastName: e.target.value })}
                      type="text" placeholder="Devi" className={inputCls} />
                  </Field>
                </div>
                <Field label="Email Address">
                  <input value={basic.email} onChange={e => setBasic({ ...basic, email: e.target.value })}
                    type="email" placeholder="aap@example.com" className={inputCls} />
                </Field>
                <Field label="Mobile Number">
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] text-sm font-semibold">🇮🇳 +91</span>
                    <input value={basic.phone} onChange={e => setBasic({ ...basic, phone: e.target.value })}
                      type="tel" placeholder="98765 43210" className={inputCls} />
                  </div>
                </Field>
                <Field label="Password">
                  <div className="relative">
                    <input value={basic.password} onChange={e => setBasic({ ...basic, password: e.target.value })}
                      type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" className={inputCls + ' pr-12'} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B5C3A] hover:text-[#C0522B]">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
              </>
            )}

            {/* ── Step 2: Business Details ── */}
            {step === 2 && (
              <>
                <Field label="Shop / Brand Name" hint="This will appear on your karigar profile">
                  <input value={biz.shopName} onChange={e => setBiz({ ...biz, shopName: e.target.value })}
                    type="text" placeholder="e.g. Sunita's Mithila Art" className={inputCls} />
                </Field>
                <Field label="Craft Category">
                  <select value={biz.craftCategory} onChange={e => setBiz({ ...biz, craftCategory: e.target.value })} className={selectCls}>
                    <option value="">Select your primary craft</option>
                    {CRAFT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Specialties / Keywords" hint="Press Enter or comma to add">
                  <TagInput tags={specialties} setTags={setSpecialties} placeholder="e.g. Madhubani, Natural Colours..." />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Years of Experience">
                    <input value={biz.experience} onChange={e => setBiz({ ...biz, experience: e.target.value })}
                      type="text" placeholder="e.g. 15 years" className={inputCls} />
                  </Field>
                  <Field label="GST Number" hint="Optional">
                    <input value={biz.gst} onChange={e => setBiz({ ...biz, gst: e.target.value })}
                      type="text" placeholder="22AAAAA0000A1Z5" className={inputCls} />
                  </Field>
                </div>
                <Field label="Website / Social Link" hint="Optional">
                  <input value={biz.website} onChange={e => setBiz({ ...biz, website: e.target.value })}
                    type="url" placeholder="https://instagram.com/yourshop" className={inputCls} />
                </Field>
              </>
            )}

            {/* ── Step 3: Address ── */}
            {step === 3 && (
              <>
                <Field label="Address Line 1">
                  <input value={addr.line1} onChange={e => setAddr({ ...addr, line1: e.target.value })}
                    type="text" placeholder="House / Shop No., Street" className={inputCls} />
                </Field>
                <Field label="Address Line 2" hint="Optional">
                  <input value={addr.line2} onChange={e => setAddr({ ...addr, line2: e.target.value })}
                    type="text" placeholder="Landmark, Area" className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City / Town">
                    <input value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })}
                      type="text" placeholder="Madhubani" className={inputCls} />
                  </Field>
                  <Field label="PIN Code">
                    <input value={addr.pincode} onChange={e => setAddr({ ...addr, pincode: e.target.value })}
                      type="text" placeholder="847211" className={inputCls} />
                  </Field>
                </div>
                <Field label="State">
                  <select value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value })} className={selectCls}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Country">
                  <input value={addr.country} readOnly className={inputCls + ' bg-[#F5ECD8] cursor-not-allowed'} />
                </Field>
              </>
            )}

            {/* ── Step 4: Portfolio ── */}
            {step === 4 && (
              <>
                <FileUpload
                  label="Profile Photo"
                  multiple={false}
                  accept="image/*"
                  files={profilePhoto}
                  setFiles={setProfilePhoto}
                  hint="JPG or PNG, square preferred, max 2MB"
                />
                <FileUpload
                  label="Portfolio Images"
                  multiple
                  accept="image/*"
                  files={portfolioFiles}
                  setFiles={setPortfolioFiles}
                  hint="Upload up to 10 photos of your best work"
                />
                <Field label="YouTube / Reel Link" hint="Optional — show your craft process">
                  <input value={bio.youtube} onChange={e => setBio({ ...bio, youtube: e.target.value })}
                    type="url" placeholder="https://youtube.com/watch?v=..." className={inputCls} />
                </Field>
              </>
            )}

            {/* ── Step 5: Bio & Story ── */}
            {step === 5 && (
              <>
                <Field label="Short Bio" hint={`${bio.bio.length}/300 characters`}>
                  <textarea
                    value={bio.bio}
                    onChange={e => e.target.value.length <= 300 && setBio({ ...bio, bio: e.target.value })}
                    rows={3} placeholder="Describe your craft and what makes it unique..."
                    className={inputCls + ' resize-none'}
                  />
                </Field>
                <Field label="Your Story" hint="Tell buyers about your journey, heritage, and inspiration">
                  <textarea
                    value={bio.story}
                    onChange={e => setBio({ ...bio, story: e.target.value })}
                    rows={5} placeholder="My grandmother taught me to paint on mud walls during festivals..."
                    className={inputCls + ' resize-none'}
                  />
                </Field>
              </>
            )}

            {/* ── Step 6: Preferences ── */}
            {step === 6 && (
              <>
                <div className="space-y-3">
                  <p className={labelCls}>Order Preferences</p>
                  {[
                    { key: 'customOrders', label: 'Accept Custom Orders', desc: 'Buyers can request personalised items' },
                    { key: 'bulkOrders',   label: 'Accept Bulk / Wholesale Orders', desc: 'For retailers and gifting companies' },
                  ].map(({ key, label, desc }) => (
                    <label key={key} className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E8D5B0] bg-white cursor-pointer hover:border-[#C0522B]/40 transition-all">
                      <input type="checkbox" checked={prefs[key]} onChange={e => setPrefs({ ...prefs, [key]: e.target.checked })}
                        className="mt-0.5 accent-[#C0522B] w-4 h-4" />
                      <div>
                        <p className="text-sm font-semibold text-[#2C1A0E]">{label}</p>
                        <p className="text-xs text-[#9B7A5A]">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className={labelCls}>Shipping Preferences</p>
                  {[
                    { key: 'platformShip', label: 'Platform Shipping (Recommended)', desc: 'We handle pickup & delivery' },
                    { key: 'selfShip',     label: 'Self Ship',  desc: 'You arrange your own courier' },
                    { key: 'expressShip',  label: 'Express Delivery Available', desc: 'Offer 2–3 day delivery option' },
                  ].map(({ key, label, desc }) => (
                    <label key={key} className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E8D5B0] bg-white cursor-pointer hover:border-[#C0522B]/40 transition-all">
                      <input type="checkbox"
                        checked={prefs.shipping[key]}
                        onChange={e => setPrefs({ ...prefs, shipping: { ...prefs.shipping, [key]: e.target.checked } })}
                        className="mt-0.5 accent-[#C0522B] w-4 h-4" />
                      <div>
                        <p className="text-sm font-semibold text-[#2C1A0E]">{label}</p>
                        <p className="text-xs text-[#9B7A5A]">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <Field label="Average Processing Time">
                  <select value={prefs.processingDays} onChange={e => setPrefs({ ...prefs, processingDays: e.target.value })} className={selectCls}>
                    {['1–2 days', '3–5 days', '1 week', '2 weeks', '3–4 weeks', 'Custom (varies by product)'].map(d => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Craft Themes / Styles" hint="Press Enter or comma to add">
                  <TagInput tags={prefs.themes} setTags={t => setPrefs({ ...prefs, themes: t })} placeholder="e.g. Traditional, Tribal, Eco-friendly..." />
                </Field>
              </>
            )}

            {/* ── Step 7: Verification ── */}
            {step === 7 && (
              <>
                <div className="bg-[#1E4D2B]/8 border border-[#1E4D2B]/20 rounded-xl p-3.5 text-sm text-[#1E4D2B]">
                  🔒 All verification details are encrypted and used only for identity & payment purposes.
                </div>

                <p className="text-xs font-bold text-[#9B7A5A] uppercase tracking-wider">Identity (Optional)</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Aadhaar Number">
                    <input value={verify.aadhaar} onChange={e => setVerify({ ...verify, aadhaar: e.target.value })}
                      type="text" placeholder="XXXX XXXX XXXX" className={inputCls} maxLength={14} />
                  </Field>
                  <Field label="PAN Number">
                    <input value={verify.pan} onChange={e => setVerify({ ...verify, pan: e.target.value.toUpperCase() })}
                      type="text" placeholder="ABCDE1234F" className={inputCls} maxLength={10} />
                  </Field>
                </div>

                <FileUpload
                  label="Upload ID Documents"
                  multiple
                  accept="image/*,.pdf"
                  files={verifyDocs}
                  setFiles={setVerifyDocs}
                  hint="Aadhaar, PAN, or any govt. ID (optional)"
                />

                <p className="text-xs font-bold text-[#9B7A5A] uppercase tracking-wider mt-2">Bank Details (Optional)</p>
                <Field label="Bank Name">
                  <input value={verify.bankName} onChange={e => setVerify({ ...verify, bankName: e.target.value })}
                    type="text" placeholder="State Bank of India" className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Account Number">
                    <input value={verify.accountNo} onChange={e => setVerify({ ...verify, accountNo: e.target.value })}
                      type="text" placeholder="XXXXXXXXXXXXXXXX" className={inputCls} />
                  </Field>
                  <Field label="IFSC Code">
                    <input value={verify.ifsc} onChange={e => setVerify({ ...verify, ifsc: e.target.value.toUpperCase() })}
                      type="text" placeholder="SBIN0001234" className={inputCls} />
                  </Field>
                </div>
                <Field label="UPI ID" hint="Optional — for faster payouts">
                  <input value={verify.upi} onChange={e => setVerify({ ...verify, upi: e.target.value })}
                    type="text" placeholder="yourname@upi" className={inputCls} />
                </Field>

                <label className="flex items-start gap-2 mt-1 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-[#C0522B] w-4 h-4" />
                  <span className="text-xs text-[#7B5C3A] leading-relaxed">
                    I agree to the <a href="#" className="text-[#C0522B] hover:underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-[#C0522B] hover:underline">Privacy Policy</a>. I confirm all information is accurate.
                  </span>
                </label>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className={`flex gap-3 mt-6 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
        {step > 1 && (
          <button type="button" onClick={() => go(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E8D5B0] text-[#7B5C3A] text-sm font-semibold hover:border-[#C0522B] hover:text-[#C0522B] transition-all">
            <ChevronLeft size={16} /> Back
          </button>
        )}
        {step < STEPS.length ? (
          <button type="button" onClick={() => go(1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E4D2B] text-white text-sm font-bold hover:bg-[#163A20] transition-all shadow-md ml-auto">
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={handleFinalSubmit} disabled={!agreed || submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E4D2B] text-white text-sm font-bold hover:bg-[#163A20] transition-all shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Registering...' : <>Karigar के रूप में जुड़ें <Check size={16} /></>}
          </button>
        )}
      </div>
      {submitError && (
        <p className="mt-3 text-sm text-red-500 text-center">{submitError}</p>
      )}
    </div>
  );
}
