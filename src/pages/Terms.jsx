// Static legal content (can be updated later)
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { PolicySection, PolicyList } from '../components/PolicySection';

const LAST_UPDATED = 'June 2025';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#C0522B]/10 flex items-center justify-center">
              <FileText size={20} className="text-[#C0522B]" />
            </div>
            <p className="text-xs font-bold text-[#C0522B] uppercase tracking-widest">Legal</p>
          </div>
          <h1 className="font-display text-4xl font-bold text-[#2C1A0E] mb-3">Terms &amp; Conditions</h1>
          <p className="text-sm text-[#7B5C3A]">Last updated: {LAST_UPDATED}</p>
          <div className="mt-4 h-px bg-gradient-to-r from-[#C0522B]/40 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 sm:p-8">

          {/* Intro note */}
          <div className="bg-[#F5ECD8]/60 border border-[#E8D5B0] rounded-xl p-4 mb-8 text-sm text-[#5C3317] leading-relaxed">
            Please read these Terms &amp; Conditions carefully before using the Karigar Hub platform. By accessing or using our services, you agree to be bound by these terms.
          </div>

          {/* 1 */}
          <PolicySection number="1" title="Introduction">
            <p>
              Karigar Hub ("Platform", "we", "us") is an online marketplace that connects skilled Indian artisans (Karigars) with buyers who appreciate authentic, handmade crafts. We operate as an intermediary platform and do not manufacture or own any of the products listed.
            </p>
            <p>
              These Terms &amp; Conditions govern your use of our website, mobile application, and all related services. By creating an account or placing an order, you confirm that you are at least 18 years of age and legally capable of entering into a binding agreement.
            </p>
          </PolicySection>

          {/* 2 */}
          <PolicySection number="2" title="User Accounts">
            <p>To access certain features, you must register for an account. You agree to:</p>
            <PolicyList items={[
              'Provide accurate, current, and complete information during registration.',
              'Maintain the security of your password and account credentials.',
              'Notify us immediately of any unauthorised use of your account.',
              'Not share your account with any third party.',
              'Be responsible for all activity that occurs under your account.',
            ]} />
            <p className="mt-2">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
            </p>
          </PolicySection>

          {/* 3 */}
          <PolicySection number="3" title="Artisan Responsibilities">
            <p>Karigars who register as sellers on Karigar Hub agree to:</p>
            <PolicyList items={[
              'List only authentic, handmade products that they have personally crafted or directly oversee.',
              'Provide accurate product descriptions, images, pricing, and stock information.',
              'Fulfil orders within the stated processing time.',
              'Maintain quality standards consistent with product listings.',
              'Comply with all applicable Indian laws, including GST regulations where applicable.',
              'Not list counterfeit, mass-produced, or prohibited items.',
            ]} />
          </PolicySection>

          {/* 4 */}
          <PolicySection number="4" title="Product Information">
            <p>
              All products on Karigar Hub are handmade by individual artisans. As a result, slight variations in colour, size, texture, and pattern are inherent to the nature of handcrafted goods and are not considered defects.
            </p>
            <p>
              Product images are representative. Actual products may vary slightly due to natural dyes, hand-weaving, or hand-painting techniques. We encourage buyers to read product descriptions carefully before purchasing.
            </p>
          </PolicySection>

          {/* 5 */}
          <PolicySection number="5" title="Orders &amp; Payments">
            <PolicyList items={[
              'All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.',
              'Orders are confirmed only upon successful payment processing.',
              'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) where available.',
              'Karigar Hub retains a platform commission from each sale; 80% of the sale price goes directly to the artisan.',
              'In case of payment failure, no amount will be deducted. If deducted, it will be refunded within 5–7 business days.',
            ]} />
          </PolicySection>

          {/* 6 */}
          <PolicySection number="6" title="Prohibited Activities">
            <p>You agree not to:</p>
            <PolicyList items={[
              'Use the platform for any unlawful purpose or in violation of any regulations.',
              'Post false, misleading, or fraudulent product listings or reviews.',
              'Attempt to circumvent the platform by conducting transactions directly with artisans outside Karigar Hub.',
              'Scrape, copy, or reproduce platform content without written permission.',
              'Upload malicious code, viruses, or any software that disrupts platform functionality.',
              'Harass, abuse, or harm other users or artisans on the platform.',
            ]} />
          </PolicySection>

          {/* 7 */}
          <PolicySection number="7" title="Platform Rights">
            <p>
              Karigar Hub reserves the right to modify, suspend, or discontinue any part of the platform at any time without prior notice. We may remove listings, suspend accounts, or cancel orders that violate our policies.
            </p>
            <p>
              All content on the platform — including logos, design, text, and images — is the intellectual property of Karigar Hub or its respective owners and may not be used without explicit written consent.
            </p>
          </PolicySection>

          {/* 8 */}
          <PolicySection number="8" title="Limitation of Liability">
            <p>
              Karigar Hub acts solely as an intermediary marketplace. We are not liable for:
            </p>
            <PolicyList items={[
              'The quality, safety, or legality of products listed by artisans.',
              'Delays in delivery caused by courier partners or natural events.',
              'Any indirect, incidental, or consequential damages arising from use of the platform.',
              'Loss of data, revenue, or profits resulting from platform downtime.',
            ]} />
            <p className="mt-2">
              Our total liability in any matter shall not exceed the amount paid by you for the specific transaction in question.
            </p>
          </PolicySection>

          {/* 9 */}
          <PolicySection number="9" title="Changes to Terms">
            <p>
              We may update these Terms &amp; Conditions from time to time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes your acceptance of the revised terms.
            </p>
            <p>
              We recommend reviewing this page periodically to stay informed of any updates.
            </p>
          </PolicySection>

          {/* 10 */}
          <PolicySection number="10" title="Contact Information">
            <p>For any questions regarding these Terms &amp; Conditions, please reach out to us:</p>
            <div className="mt-3 bg-[#F5ECD8]/60 border border-[#E8D5B0] rounded-xl p-4 space-y-1">
              <p><span className="font-semibold text-[#2C1A0E]">Email:</span> legal@karigarhub.in</p>
              <p><span className="font-semibold text-[#2C1A0E]">Support:</span> namaste@karigarhub.in</p>
              <p><span className="font-semibold text-[#2C1A0E]">Address:</span> Karigar Hub, India</p>
            </div>
          </PolicySection>
        </motion.div>

        {/* Footer links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[#7B5C3A]">
          <Link to="/refund-policy" className="text-[#C0522B] font-semibold hover:underline transition-all">
            Refund &amp; Return Policy →
          </Link>
          <span className="text-[#E8D5B0]">·</span>
          <Link to="/" className="hover:text-[#C0522B] transition-colors">Back to Home</Link>
        </motion.div>
      </div>
    </div>
  );
}
