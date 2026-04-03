import kashmirImage from '../assets/Kashmir.webp';
import odishaImage from '../assets/Odisha.jpeg';
import rajasthanImage from '../assets/Rajasthan.jpeg';
import westBengalImage from '../assets/WestBengal.jpg';
import gujaratImage from '../assets/Gujart.jpeg';
import uttarPradeshImage from '../assets/up.webp';
import biharImage from '../assets/Bihar.webp';
import assamImage from '../assets/assam.jpg';
import maharashtraImage from '../assets/Maharastra.webp';
import tamilNaduImage from '../assets/TamilNadu.jpg';
import keralaImage from '../assets/kerala.jpg';
import karnatakaImage from '../assets/Karnataka.jpg';
import andhraPradeshImage from '../assets/andhara.webp';
import telanganaImage from '../assets/Telengana.jpg';
import punjabImage from '../assets/punjab.jpg';
import madhyaPradeshImage from '../assets/madhya pradesh.jpeg';
import chhattisgarghImage from '../assets/chhatisgarh.jpeg';
import manipurImage from '../assets/manipur.jpeg';
import nagalandImage from '../assets/nagaland.jpg';
import meghalayaImage from '../assets/meghalaya.jpg';
import tripuraImage from '../assets/Tripura.jpg';
import mizoramImage from '../assets/mizoram.jpg';
import goaImage from '../assets/Goa.jpg';
import himachalImage from '../assets/himachal.jpeg';
import arunachalImage from '../assets/arunachal.jpeg';
import sikkimImage from '../assets/sikim.jpeg';
import uttarakhandImage from '../assets/UTTARKHAND.jpg';
import jharkhandImage from '../assets/Jharkhand.jpeg';

// Category images
import handloomImage from '../assets/handloom.jpeg';
import jewelleryImage from '../assets/jwellary.jpeg';
import potteryImage from '../assets/Pottery.jpeg';
import homeDecorImage from '../assets/Home decor.jpeg';
import paintingsImage from '../assets/Paintings.jpeg';
import festiveItemsImage from '../assets/festive items.jpeg';
import woodenCraftsImage from '../assets/Wooden Crafts.jpeg';
import giftsImage from '../assets/Gifts.jpeg';

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = [
  { id: 1, name: 'Handloom', hindi: 'हैंडलूम', count: 312, image: handloomImage },
  { id: 2, name: 'Jewellery', hindi: 'आभूषण', count: 248, image: jewelleryImage },
  { id: 3, name: 'Pottery', hindi: 'मिट्टी के बर्तन', count: 176, image: potteryImage },
  { id: 4, name: 'Home Decor', hindi: 'घर की सजावट', count: 289, image: homeDecorImage },
  { id: 5, name: 'Paintings', hindi: 'चित्रकला', count: 143, image: paintingsImage },
  { id: 6, name: 'Festive Items', hindi: 'त्योहार', count: 198, image: festiveItemsImage },
  { id: 7, name: 'Wooden Crafts', hindi: 'लकड़ी के शिल्प', count: 134, image: woodenCraftsImage },
  { id: 8, name: 'Gifts', hindi: 'उपहार', count: 221, image: giftsImage },
];

// ─── States ───────────────────────────────────────────────────────────────────
export const states = [
  { name: 'Odisha', craft: 'Pattachitra & Sambalpuri', image: odishaImage, products: 142 },
  { name: 'Rajasthan', craft: 'Blue Pottery & Block Print', image: rajasthanImage, products: 218 },
  { name: 'West Bengal', craft: 'Dokra & Kantha', image: westBengalImage, products: 167 },
  { name: 'Gujarat', craft: 'Bandhani & Patola', image: gujaratImage, products: 193 },
  { name: 'Uttar Pradesh', craft: 'Chikankari & Brass', image: uttarPradeshImage, products: 156 },
  { name: 'Bihar', craft: 'Madhubani & Sikki', image: biharImage, products: 98 },
  { name: 'Assam', craft: 'Muga Silk & Cane', image: assamImage, products: 87 },
  { name: 'Kashmir', craft: 'Pashmina & Papier-mâché', image: kashmirImage, products: 124 },
  { name: 'Maharashtra', craft: 'Paithani & Warli', image: maharashtraImage, products: 178 },
  { name: 'Tamil Nadu', craft: 'Kanjivaram & Tanjore', image: tamilNaduImage, products: 203 },
  { name: 'Kerala', craft: 'Kasavu & Aranmula Metal', image: keralaImage, products: 134 },
  { name: 'Karnataka', craft: 'Bidriware & Mysore Silk', image: karnatakaImage, products: 119 },
  { name: 'Andhra Pradesh', craft: 'Kalamkari & Kondapalli', image: andhraPradeshImage, products: 96 },
  { name: 'Telangana', craft: 'Pochampally Ikat & Nirmal', image: telanganaImage, products: 88 },
  { name: 'Madhya Pradesh', craft: 'Chanderi & Gond Art', image: madhyaPradeshImage, products: 112 },
  { name: 'Punjab', craft: 'Phulkari & Jutti', image: punjabImage, products: 104 },
  { name: 'Himachal Pradesh', craft: 'Kullu Shawl & Thangka', image: himachalImage, products: 76 },
  { name: 'Uttarakhand', craft: 'Aipan & Ringal Craft', image: uttarakhandImage, products: 65 },
  { name: 'Jharkhand', craft: 'Sohrai & Dokra', image: jharkhandImage, products: 72 },
  { name: 'Chhattisgarh', craft: 'Dhokra & Bell Metal', image: chhattisgarghImage, products: 58 },
  { name: 'Manipur', craft: 'Moirang Phee & Longpi', image: manipurImage, products: 49 },
  { name: 'Nagaland', craft: 'Naga Shawl & Wood Carving', image: nagalandImage, products: 43 },
  { name: 'Meghalaya', craft: 'Cane & Bamboo Craft', image: meghalayaImage, products: 38 },
  { name: 'Tripura', craft: 'Rignai Weave & Bamboo', image: tripuraImage, products: 34 },
  { name: 'Mizoram', craft: 'Puan Weave & Bamboo', image: mizoramImage, products: 29 },
  { name: 'Arunachal Pradesh', craft: 'Thangka & Woven Textiles', image: arunachalImage, products: 31 },
  { name: 'Sikkim', craft: 'Thangka Painting & Carpet', image: sikkimImage, products: 27 },
  { name: 'Goa', craft: 'Azulejo Tiles & Cashew Art', image: goaImage, products: 52 },
];

// ─── Festivals ────────────────────────────────────────────────────────────────
export const festivals = [
  { name: 'Diwali Gifting', desc: 'Diyas, brass decor, festive hampers', icon: '🪔' },
  { name: 'Rakhi Specials', desc: 'Handmade rakhis & gift sets', icon: '🎀' },
  { name: 'Wedding Collection', desc: 'Bridal jewellery, sarees & decor', icon: '💍' },
  { name: 'Housewarming', desc: 'Terracotta, brass & wooden gifts', icon: '🏡' },
  { name: 'Return Gifts', desc: 'Handmade personalised gifts', icon: '🎁' },
];

// ─── Artisans — commented out, data now comes from MongoDB ────────────────────
/* export const artisans = [ ... ]; */
export const artisans = [];

// ─── Products — commented out, data now comes from MongoDB ────────────────────
/* export const products = [ ... ]; */
export const products = [];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials = [
  {
    id: 1,
    name: 'Ananya Sharma',
    city: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    text: 'I ordered a Madhubani painting for my living room and it arrived beautifully packed with a handwritten note from Sunita ji. You can feel the soul in every brushstroke. Karigar Hub is truly special.',
    product: 'Madhubani Wall Art',
    rating: 5,
  },
  {
    id: 2,
    name: 'Vikram Nair',
    city: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    text: 'Gifted my mother a Sambalpuri saree for her birthday. She was moved to tears. The quality is exceptional and knowing it was handwoven by a real artisan makes it priceless.',
    product: 'Sambalpuri Saree',
    rating: 5,
  },
  {
    id: 3,
    name: 'Priya Menon',
    city: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
    text: "The Dokra jhumkas I bought are absolutely stunning. So many compliments! I love that I can read the artisan's story and know exactly who made my jewellery.",
    product: 'Dokra Jhumkas',
    rating: 5,
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
export const stats = [
  { label: 'Karigars Supported', value: 3200, suffix: '+' },
  { label: 'Products Sold', value: 62000, suffix: '+' },
  { label: 'States Covered', value: 28, suffix: '' },
  { label: 'Families Impacted', value: 11000, suffix: '+' },
];

// ─── How It Works ─────────────────────────────────────────────────────────────
export const howItWorks = [
  { step: '01', title: 'Discover', subtitle: 'Khojo', description: 'Browse thousands of authentic handmade products from verified Indian artisans across 28 states.', icon: '🔍' },
  { step: '02', title: 'Choose', subtitle: 'Chuniye', description: 'Read artisan stories, request customisations, and pick products that carry real cultural meaning.', icon: '🤝' },
  { step: '03', title: 'Purchase', subtitle: 'Kharido', description: 'Secure checkout with UPI, card, or COD. 80% of every sale goes directly to the artisan.', icon: '🛒' },
  { step: '04', title: 'Impact', subtitle: 'Badlaav', description: "Your purchase funds craft education, fair wages, and preserves India's living heritage.", icon: '✨' },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = [
  { id: 1, user: 'Ritu S.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', rating: 5, date: 'March 2025', text: 'Absolutely stunning piece. The craftsmanship is impeccable and it arrived beautifully packaged with a personal note.' },
  { id: 2, user: 'Arjun M.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', rating: 5, date: 'February 2025', text: 'Gifted this to my wife and she loved it. You can feel the love and skill in every detail. Will definitely order again.' },
  { id: 3, user: 'Kavya R.', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&q=80', rating: 4, date: 'January 2025', text: 'Beautiful quality. Delivery took a bit longer but the product was worth every rupee. Highly recommend.' },
];

// ─── Dashboard — commented out, data now comes from MongoDB ───────────────────
/* export const dashboardStats = { ... }; export const recentOrders = [ ... ]; */
export const dashboardStats = { earnings: { total: 0, thisMonth: 0, growth: 0 }, products: {}, orders: {}, views: { total: 0, thisMonth: 0 } };
export const recentOrders = [];
