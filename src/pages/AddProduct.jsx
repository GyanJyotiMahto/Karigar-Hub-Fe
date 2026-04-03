import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Upload, X, Check, AlertCircle, Package,
  LayoutDashboard, ShoppingBag, BarChart2, Settings, LogOut, Menu, Plus, Trash2
} from 'lucide-react';
import { uploadProductImages, createProduct } from '../services/api';

// ─── Shared dashboard nav (mirrors Dashboard.jsx sidebar) ────────────────────
const navItems = [
  { icon: LayoutDashboard, label: 'Overview',  href: '/dashboard' },
  { icon: Package,         label: 'Products',  href: '/dashboard/products' },
  { icon: ShoppingBag,     label: 'Orders',    href: '/dashboard' },
  { icon: BarChart2,       label: 'Analytics', href: '/dashboard' },
  { icon: Settings,        label: 'Settings',  href: '/dashboard' },
];

const CATEGORIES = ['Handloom', 'Jewellery', 'Pottery', 'Home Decor', 'Paintings', 'Festive Items', 'Wooden Crafts', 'Gifts'];
const STATES     = ['Bihar', 'Odisha', 'Rajasthan', 'West Bengal', 'Uttar Pradesh', 'Assam', 'Kashmir', 'Gujarat'];

const inputCls  = 'w-full px-4 py-2.5 rounded-xl border border-[#E8D5B0] text-[#2C1A0E] text-sm focus:outline-none focus:border-[#C0522B] focus:ring-2 focus:ring-[#C0522B]/10 bg-white transition-all';
const labelCls  = 'block text-sm font-semibold text-[#2C1A0E] mb-1.5';
const errorCls  = 'text-xs text-red-500 mt-1 flex items-center gap-1';

function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-[#9B7A5A] mt-1">{hint}</p>}
      {error && <p className={errorCls}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

export default function AddProduct() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const editData  = location.state?.product || null; // prefilled when editing
  const isEdit    = !!editData;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:          editData?.name          || '',
    description:   editData?.description   || '',
    category:      editData?.category      || '',
    state:         editData?.state         || '',
    price:         editData?.price         || '',
    originalPrice: editData?.originalPrice || '',
    stock:         editData?.stock         || '',
    customizable:  editData?.customizable  || false,
    handmade:      editData?.handmade      ?? true,
    status:        editData?.status        || 'active',
    tags:          editData?.tags?.join(', ') || '',
    isCustomizable: editData?.isCustomizable || false,
  });

  const [customOptions, setCustomOptions] = useState(
    editData?.customizationOptions || []
  );

  const addCustomOption = () => setCustomOptions(prev => [...prev, { name: '', type: 'text', required: false, options: [], priceAdd: 0 }]);
  const removeCustomOption = i => setCustomOptions(prev => prev.filter((_, j) => j !== i));
  const updateCustomOption = (i, key, val) => setCustomOptions(prev => prev.map((o, j) => j === i ? { ...o, [key]: val } : o));

  const [images,   setImages]   = useState([]);   // File objects
  const [previews, setPreviews] = useState(editData?.images || []);
  const [errors,   setErrors]   = useState({});
  const fileRef = useRef();

  // ── Image handling ──────────────────────────────────────────────────────────
  const handleFiles = e => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...urls]);
  };

  const removeImage = i => {
    setImages(prev => prev.filter((_, j) => j !== i));
    setPreviews(prev => prev.filter((_, j) => j !== i));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name     = 'Product name is required';
    if (!form.category)           e.category = 'Please select a category';
    if (!form.price || form.price <= 0) e.price = 'Enter a valid price';
    if (form.stock === '' || form.stock < 0) e.stock = 'Enter stock quantity';
    if (!form.description.trim()) e.description = 'Description is required';
    if (previews.length === 0)    e.images   = 'Upload at least one image';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setUploading(true);
      const fileObjects = images.filter(f => f instanceof File);
      const existingUrls = previews.filter(p => typeof p === 'string' && p.startsWith('http'));
      let cloudinaryUrls = existingUrls;
      if (fileObjects.length > 0) {
        const { urls } = await uploadProductImages(fileObjects);
        cloudinaryUrls = [...existingUrls, ...urls];
      }
      await createProduct({
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        images: cloudinaryUrls,
        isCustomizable: form.isCustomizable,
        customizationOptions: form.isCustomizable ? customOptions.filter(o => o.name.trim()) : [],
      });
      setSaved(true);
      setTimeout(() => navigate('/dashboard/products'), 1500);
    } catch (err) {
      setErrors(prev => ({ ...prev, submit: err.message }));
    } finally {
      setUploading(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen bg-[#F5ECD8]/30 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1E0E06] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold font-display">क</div>
            <div>
              <span className="font-display text-base font-bold text-white block">Karigar Hub</span>
              <span className="text-[9px] tracking-widest text-[#C0522B]">KARIGAR DASHBOARD</span>
            </div>
          </Link>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&q=80" alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-white text-sm font-bold">Sunita Devi</p>
              <p className="text-[#B8A080] text-xs">Madhubani Artist · Bihar</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.label} to={item.href} onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === item.href ? 'bg-[#C0522B] text-white' : 'text-[#B8A080] hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#B8A080] hover:bg-white/10 hover:text-white text-sm font-semibold transition-all">
            <LogOut size={16} /> Back to Store
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E8D5B0]/60 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[#F5ECD8] text-[#5C3317]">
              <Menu size={20} />
            </button>
            <Link to="/dashboard/products" className="p-2 rounded-lg hover:bg-[#F5ECD8] text-[#5C3317] transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-[#2C1A0E]">{isEdit ? 'Edit Product' : 'नया Product जोड़ें'}</h1>
              <p className="text-xs text-[#7B5C3A]">{isEdit ? `Editing: ${editData.name}` : 'Fill in the details below'}</p>
            </div>
          </div>
          <Link to="/dashboard/products" className="text-sm text-[#7B5C3A] hover:text-[#C0522B] font-semibold transition-colors">
            Cancel
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
            className="max-w-3xl mx-auto space-y-6">

            {/* Success banner */}
            {saved && (
              <div className="flex items-center gap-3 bg-[#1E4D2B]/10 border border-[#1E4D2B]/30 rounded-2xl p-4 text-[#1E4D2B] text-sm font-semibold">
                <Check size={18} /> Product {isEdit ? 'updated' : 'published'} successfully! Redirecting...
              </div>
            )}
            {errors.submit && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm font-semibold">
                <AlertCircle size={18} /> {errors.submit}
              </div>
            )}

            {/* ── Basic Info ── */}
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-[#2C1A0E] mb-2">Basic Information</h3>

              <Field label="Product Name *" error={errors.name}>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  type="text" placeholder="e.g. Madhubani Wall Art (Large)" className={inputCls} />
              </Field>

              <Field label="Description *" error={errors.description} hint={`${form.description.length}/1000`}>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={4} placeholder="Describe your product — materials, technique, time taken, dimensions..."
                  className={inputCls + ' resize-none'} maxLength={1000} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Category *" error={errors.category}>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls + ' cursor-pointer'}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="State / Origin">
                  <select value={form.state} onChange={e => set('state', e.target.value)} className={inputCls + ' cursor-pointer'}>
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Tags" hint="Comma-separated: e.g. madhubani, natural colours, wall art">
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  type="text" placeholder="madhubani, natural colours, wall art" className={inputCls} />
              </Field>
            </div>

            {/* ── Pricing & Stock ── */}
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-[#2C1A0E] mb-2">Pricing & Stock</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Selling Price (₹) *" error={errors.price}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B5C3A] font-bold text-sm">₹</span>
                    <input value={form.price} onChange={e => set('price', e.target.value)}
                      type="number" min="0" placeholder="0" className={inputCls + ' pl-8'} />
                  </div>
                </Field>
                <Field label="Original Price (₹)" hint="Optional — shows strikethrough">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B5C3A] font-bold text-sm">₹</span>
                    <input value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)}
                      type="number" min="0" placeholder="0" className={inputCls + ' pl-8'} />
                  </div>
                </Field>
                <Field label="Stock Quantity *" error={errors.stock}>
                  <input value={form.stock} onChange={e => set('stock', e.target.value)}
                    type="number" min="0" placeholder="0" className={inputCls} />
                </Field>
              </div>

              <Field label="Listing Status">
                <div className="flex gap-3">
                  {['active', 'inactive', 'draft'].map(s => (
                    <button key={s} type="button" onClick={() => set('status', s)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all ${
                        form.status === s
                          ? s === 'active' ? 'bg-[#1E4D2B] text-white border-[#1E4D2B]'
                            : s === 'inactive' ? 'bg-[#C0522B] text-white border-[#C0522B]'
                            : 'bg-[#7B5C3A] text-white border-[#7B5C3A]'
                          : 'border-[#E8D5B0] text-[#7B5C3A] hover:border-[#C0522B]'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {/* ── Images ── */}
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
              <h3 className="font-display text-lg font-bold text-[#2C1A0E] mb-4">Product Images</h3>
              {errors.images && <p className={errorCls + ' mb-3'}><AlertCircle size={11} />{errors.images}</p>}

              {/* Previews */}
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {previews.map((src, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E8D5B0] group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-[#1E4D2B]/80 text-white text-[9px] text-center py-0.5 font-semibold">Cover</span>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current.click()}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-[#E8D5B0] flex flex-col items-center justify-center hover:border-[#C0522B] hover:bg-[#C0522B]/5 transition-all text-[#B09070] hover:text-[#C0522B]">
                    <Plus size={18} />
                    <span className="text-[10px] mt-1 font-semibold">Add More</span>
                  </button>
                </div>
              )}

              {previews.length === 0 && (
                <div onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-[#E8D5B0] rounded-xl p-10 text-center cursor-pointer hover:border-[#C0522B] hover:bg-[#C0522B]/5 transition-all group">
                  <Upload size={28} className="mx-auto mb-3 text-[#B09070] group-hover:text-[#C0522B] transition-colors" />
                  <p className="text-sm font-semibold text-[#7B5C3A]">Click to upload product images</p>
                  <p className="text-xs text-[#B09070] mt-1">PNG, JPG up to 10MB each · First image = cover photo</p>
                </div>
              )}
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
            </div>

            {/* ── Product Options ── */}
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-[#2C1A0E] mb-2">Product Options</h3>
              {[
                { key: 'customizable', label: 'Accept Custom Orders', desc: 'Buyers can request personalised variations' },
                { key: 'handmade',     label: '🤲 Handmade Tag',       desc: 'Display the "Handmade" badge on this product' },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E8D5B0] cursor-pointer hover:border-[#C0522B]/40 transition-all">
                  <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                    className="mt-0.5 accent-[#C0522B] w-4 h-4" />
                  <div>
                    <p className="text-sm font-semibold text-[#2C1A0E]">{label}</p>
                    <p className="text-xs text-[#9B7A5A]">{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* ── Customization Options Builder ── */}
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Customization Options</h3>
                  <p className="text-xs text-[#9B7A5A] mt-0.5">Let buyers personalise this product before adding to cart</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-[#7B5C3A] font-semibold">Enable</span>
                  <button type="button" onClick={() => set('isCustomizable', !form.isCustomizable)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.isCustomizable ? 'bg-[#C0522B]' : 'bg-[#E8D5B0]'
                    }`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.isCustomizable ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </label>
              </div>

              {form.isCustomizable && (
                <div className="space-y-4">
                  {customOptions.map((opt, i) => (
                    <div key={i} className="border border-[#E8D5B0] rounded-xl p-4 space-y-3 bg-[#FDF6EC]">
                      {/* Header row */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C0522B] uppercase tracking-wide bg-[#C0522B]/10 px-2 py-0.5 rounded-full">
                          Field {i + 1}
                        </span>
                        <button type="button" onClick={() => removeCustomOption(i)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-[#7B5C3A] hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Name + Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Field Name *</label>
                          <input className={inputCls} value={opt.name} placeholder="e.g. Color, Size, Engraving"
                            onChange={e => updateCustomOption(i, 'name', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls}>Input Type *</label>
                          <select className={inputCls + ' cursor-pointer'} value={opt.type}
                            onChange={e => updateCustomOption(i, 'type', e.target.value)}>
                            <option value="text">✏️ Text Input</option>
                            <option value="number">🔢 Number Input</option>
                            <option value="dropdown">📋 Dropdown</option>
                            <option value="radio">🔘 Radio Buttons</option>
                          </select>
                        </div>
                      </div>

                      {/* Choices — only for dropdown / radio */}
                      {(opt.type === 'dropdown' || opt.type === 'radio') && (
                        <div>
                          <label className={labelCls}>Choices <span className="text-[#9B7A5A] font-normal">(comma-separated)</span></label>
                          <input className={inputCls}
                            value={opt.options?.join(', ') || ''}
                            placeholder="e.g. Red, Blue, Green"
                            onChange={e => updateCustomOption(i, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                          {/* Chip preview of entered choices */}
                          {opt.options?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {opt.options.map(o => (
                                <span key={o} className="text-xs bg-white border border-[#E8D5B0] text-[#5C3317] px-2.5 py-0.5 rounded-full font-semibold">{o}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Extra price */}
                      <div>
                        <label className={labelCls}>
                          Extra Price (₹) <span className="text-[#9B7A5A] font-normal">— added to base price when this field is filled</span>
                        </label>
                        <div className="relative w-40">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B5C3A] font-bold text-sm">₹</span>
                          <input
                            type="number" min="0" placeholder="0"
                            value={opt.priceAdd || ''}
                            onChange={e => updateCustomOption(i, 'priceAdd', Number(e.target.value) || 0)}
                            className={inputCls + ' pl-7'}
                          />
                        </div>
                      </div>

                      {/* Required toggle */}
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <div
                          onClick={() => updateCustomOption(i, 'required', !opt.required)}
                          className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                            opt.required ? 'bg-[#C0522B]' : 'bg-[#E8D5B0]'
                          }`}>
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            opt.required ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </div>
                        <span className="text-sm text-[#5C3317] font-semibold">Required — buyer must fill this before adding to cart</span>
                      </label>
                    </div>
                  ))}

                  <button type="button" onClick={addCustomOption}
                    className="flex items-center gap-2 text-sm font-semibold text-[#C0522B] border border-dashed border-[#C0522B]/40 px-4 py-3 rounded-xl hover:bg-[#C0522B]/5 transition-all w-full justify-center">
                    <Plus size={14} /> Add Another Field
                  </button>

                  {/* Live buyer preview */}
                  {customOptions.some(o => o.name.trim()) && (
                    <div className="border border-[#C0522B]/20 rounded-xl p-4 bg-[#FDF6EC] space-y-3">
                      <p className="text-xs font-bold text-[#C0522B] uppercase tracking-wide">👁 Buyer Preview</p>
                      {customOptions.filter(o => o.name.trim()).map((opt, i) => (
                        <div key={i}>
                          <p className="text-xs font-bold text-[#7B5C3A] mb-1 uppercase tracking-wide">
                            {opt.name} {opt.required && <span className="text-[#C0522B]">*</span>}
                            {opt.priceAdd > 0 && <span className="ml-1 text-[#1E4D2B] normal-case font-semibold">(+₹{opt.priceAdd})</span>}
                          </p>
                          {opt.type === 'dropdown' && (
                            <select disabled className="w-full px-3 py-2 rounded-xl border border-[#E8D5B0] bg-white text-sm text-[#9B7A5A] cursor-not-allowed">
                              <option>Select {opt.name}</option>
                              {opt.options?.map(o => <option key={o}>{o}</option>)}
                            </select>
                          )}
                          {opt.type === 'radio' && (
                            <div className="flex flex-wrap gap-2">
                              {opt.options?.length
                                ? opt.options.map(o => (
                                    <span key={o} className="px-3 py-1.5 rounded-xl border border-[#E8D5B0] bg-white text-sm text-[#5C3317] font-semibold">{o}</span>
                                  ))
                                : <span className="text-xs text-[#B09070] italic">No choices added yet</span>
                              }
                            </div>
                          )}
                          {opt.type === 'text' && (
                            <div className="w-full px-3 py-2 rounded-xl border border-[#E8D5B0] bg-white text-sm text-[#B09070] italic">Enter {opt.name}</div>
                          )}
                          {opt.type === 'number' && (
                            <div className="w-32 px-3 py-2 rounded-xl border border-[#E8D5B0] bg-white text-sm text-[#B09070] italic">0</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Actions ── */}
            <div className="flex gap-3 pb-8">
              <button type="submit" disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#C0522B] text-white font-bold hover:bg-[#9A3E1E] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                <Check size={16} /> {uploading ? 'Uploading...' : isEdit ? 'Save Changes' : 'Publish Product'}
              </button>
              <Link to="/dashboard/products"
                className="flex-1 flex items-center justify-center py-3.5 rounded-full border border-[#E8D5B0] text-[#5C3317] font-semibold hover:bg-[#F5ECD8] transition-colors text-center">
                Cancel
              </Link>
            </div>
          </motion.form>
        </main>
      </div>
    </div>
  );
}
