// Static legal content (can be updated later)
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { PolicySection, PolicyList } from '../components/PolicySection';

const LAST_UPDATED = 'June 2025';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1E4D2B]/10 flex items-center justify-center">
              <RefreshCw size={20} className="text-[#1E4D2B]" />
            </div>
            <p className="text-xs font-bold text-[#1E4D2B] uppercase tracking-widest">Legal</p>
          </div>
          <h1 className="font-display text-4xl font-bold text-[#2C1A0E] mb-3">Refund &amp; Return Policy</h1>
          <p className="text-sm text-[#7B5C3A]">Last updated: {LAST_UPDATED}</p>
          <div className="mt-4 h-px bg-gradient-to-r from-[#1E4D2B]/40 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 sm:p-8">

          {/* Intro note */}
          <div className="bg-[#1E4D2B]/8 border border-[#1E4D2B]/20 rounded-xl p-4 mb-8 text-sm text-[#1E4D2B] leading-relaxed">
            At Karigar Hub, we take pride in the quality of every handcrafted product. We want you to be completely satisfied with your purchase. Please read our policy carefully before placing an order.
          </div>

          {/* 1 */}
          <PolicySection number="1" title="Eligibility for Returns">
            <p>You may request a return if:</p>
            <PolicyList items={[
              'The product received is significantly different from the listing description or images.',
              'The item arrives damaged, broken, or defective due to shipping or manufacturing.',
              'You received the wrong product (incorrect item or size).',
              'The product is missing parts or accessories mentioned in the listing.',
            ]} />
            <p className="mt-2">
              To be eligible, the item must be unused, in its original condition, and in the original packaging. Returns must be initiated within <strong>3 days</strong> of delivery.
            </p>
          </PolicySection>

          {/* 2 */}
          <PolicySection number="2" title="Non-Returnable Items">
            <p>The following items are <strong>not eligible</strong> for return or refund:</p>
            <PolicyList items={[
              'Customised or personalised products (items made to order with specific names, colours, sizes, or designs).',
              'Perishable or consumable goods.',
              'Items that have been used, washed, or altered after delivery.',
              'Digital products or downloadable content.',
              'Products returned without prior approval from our support team.',
              'Items where the return window of 3 days has passed.',
            ]} />
            <p className="mt-2">
              Since most products on Karigar Hub are handmade to order, we strongly encourage buyers to review product details carefully before purchasing.
            </p>
          </PolicySection>

          {/* 3 */}
          <PolicySection number="3" title="Return Timeframe">
            <p>
              All return requests must be raised within <strong>3 days of delivery</strong>. To initiate a return:
            </p>
            <PolicyList items={[
              'Contact us at returns@karigarhub.in with your Order ID and reason for return.',
              'Attach clear photographs of the product showing the issue.',
              'Our team will review your request within 1–2 business days.',
              'Once approved, you will receive return shipping instructions.',
            ]} />
            <p className="mt-2">
              Requests raised after 3 days of delivery will not be accepted under any circumstances.
            </p>
          </PolicySection>

          {/* 4 */}
          <PolicySection number="4" title="Refund Process">
            <p>
              Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund.
            </p>
            <PolicyList items={[
              'Approved refunds are processed within 5–7 business days.',
              'Refunds are credited to the original payment method (UPI, bank account, or card).',
              'For Cash on Delivery orders, refunds are processed via bank transfer — please provide your bank details.',
              'Platform fees and payment gateway charges (if any) are non-refundable.',
            ]} />
            <div className="mt-3 bg-[#F5ECD8]/60 border border-[#E8D5B0] rounded-xl p-3 text-xs text-[#7B5C3A]">
              ⏱ Refund timeline: 5–7 business days after return approval. Bank processing times may vary.
            </div>
          </PolicySection>

          {/* 5 */}
          <PolicySection number="5" title="Cancellation Policy">
            <p>Orders can be cancelled under the following conditions:</p>
            <PolicyList items={[
              'Cancellations are accepted within 24 hours of placing the order, before the artisan begins processing.',
              'Once the artisan has started crafting or dispatched the item, cancellations are not possible.',
              'To cancel, contact us immediately at namaste@karigarhub.in with your Order ID.',
              'Approved cancellations receive a full refund within 5–7 business days.',
            ]} />
            <p className="mt-2">
              For made-to-order or customised products, cancellations are not accepted once the order is confirmed, as the artisan begins work immediately.
            </p>
          </PolicySection>

          {/* 6 */}
          <PolicySection number="6" title="Shipping Charges for Returns">
            <PolicyList items={[
              'If the return is due to our error (wrong item, damaged product), we will bear the return shipping cost.',
              'If the return is due to a change of mind or buyer error, the return shipping charges are borne by the buyer.',
              'We recommend using a trackable shipping service for returns. Karigar Hub is not responsible for items lost in transit during return.',
            ]} />
          </PolicySection>

          {/* 7 */}
          <PolicySection number="7" title="Artisan vs Platform Responsibility">
            <p>
              Karigar Hub acts as an intermediary marketplace. Responsibility for product quality and accurate listing rests with the artisan. However, we take full responsibility for:
            </p>
            <PolicyList items={[
              'Ensuring the return and refund process is handled fairly and promptly.',
              'Mediating disputes between buyers and artisans.',
              'Issuing refunds from platform funds in cases where the artisan is unable to resolve the issue.',
            ]} />
            <p className="mt-2">
              Artisans found repeatedly listing inaccurate products or refusing valid returns may have their accounts suspended.
            </p>
          </PolicySection>

          {/* 8 */}
          <PolicySection number="8" title="Contact Information">
            <p>For return requests, refund queries, or any related concerns:</p>
            <div className="mt-3 bg-[#F5ECD8]/60 border border-[#E8D5B0] rounded-xl p-4 space-y-1">
              <p><span className="font-semibold text-[#2C1A0E]">Returns Email:</span> returns@karigarhub.in</p>
              <p><span className="font-semibold text-[#2C1A0E]">Support Email:</span> namaste@karigarhub.in</p>
              <p><span className="font-semibold text-[#2C1A0E]">Response Time:</span> Within 1–2 business days</p>
            </div>
          </PolicySection>
        </motion.div>

        {/* Footer links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[#7B5C3A]">
          <Link to="/terms" className="text-[#C0522B] font-semibold hover:underline transition-all">
            Terms &amp; Conditions →
          </Link>
          <span className="text-[#E8D5B0]">·</span>
          <Link to="/" className="hover:text-[#C0522B] transition-colors">Back to Home</Link>
        </motion.div>
      </div>
    </div>
  );
}
