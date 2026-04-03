import { AlertCircle, Sparkles } from 'lucide-react';

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-[#E8D5B0] bg-white text-sm text-[#2C1A0E] focus:outline-none focus:border-[#C0522B] focus:ring-2 focus:ring-[#C0522B]/10 transition-all';

export default function CustomizationForm({ options = [], values = {}, onChange, errors = {} }) {
  if (!options.length) return null;

  const handleChange = (name, value) => onChange({ ...values, [name]: value });

  // Total extra cost from selected options
  const extraCost = options.reduce((sum, opt) => {
    return values[opt.name] && opt.priceAdd ? sum + opt.priceAdd : sum;
  }, 0);

  return (
    <div className="bg-[#F5ECD8]/60 border border-[#E8D5B0] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[#2C1A0E] text-sm flex items-center gap-2">
          <Sparkles size={14} className="text-[#C0522B]" /> Customize Your Order
        </h4>
        {extraCost > 0 && (
          <span className="text-xs font-bold text-[#1E4D2B] bg-[#1E4D2B]/10 px-2 py-0.5 rounded-full">
            +₹{extraCost.toLocaleString('en-IN')} added
          </span>
        )}
      </div>

      {options.map(opt => (
        <div key={opt.name}>
          <label className="block text-xs font-bold text-[#7B5C3A] mb-1.5 uppercase tracking-wide">
            {opt.name} {opt.required && <span className="text-[#C0522B]">*</span>}
          </label>

          {/* Dropdown */}
          {opt.type === 'dropdown' && (
            <select
              value={values[opt.name] || ''}
              onChange={e => handleChange(opt.name, e.target.value)}
              className={inputCls + ' cursor-pointer'}
            >
              <option value="">Select {opt.name}</option>
              {opt.options.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}

          {/* Radio */}
          {opt.type === 'radio' && (
            <div className="flex flex-wrap gap-2">
              {opt.options.map(o => (
                <label key={o}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                    values[opt.name] === o
                      ? 'border-[#C0522B] bg-[#C0522B]/10 text-[#C0522B]'
                      : 'border-[#E8D5B0] bg-white text-[#5C3317] hover:border-[#C0522B]'
                  }`}>
                  <input type="radio" name={opt.name} value={o}
                    checked={values[opt.name] === o}
                    onChange={() => handleChange(opt.name, o)}
                    className="hidden" />
                  {o}
                </label>
              ))}
            </div>
          )}

          {/* Text */}
          {opt.type === 'text' && (
            <input
              type="text"
              value={values[opt.name] || ''}
              placeholder={`Enter ${opt.name}`}
              onChange={e => handleChange(opt.name, e.target.value)}
              className={inputCls}
            />
          )}

          {/* Number */}
          {opt.type === 'number' && (
            <input
              type="number"
              value={values[opt.name] || ''}
              placeholder={`Enter ${opt.name}`}
              onChange={e => handleChange(opt.name, e.target.value)}
              className={inputCls}
            />
          )}

          {errors[opt.name] && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={11} /> {errors[opt.name]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
