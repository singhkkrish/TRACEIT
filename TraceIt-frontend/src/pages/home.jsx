import React from "react";
import { 
    Search, 
    MapPin, 
    Upload, 
    Shield, 
    CheckCircle, 
    MessageCircle, 
    Users, 
    Lock, 
    LayoutDashboard, 
    Bell, 
    AlertCircle,
    ArrowRight,
    List
} from "lucide-react";

const Home = ({ onNavigate }) => {

    const foundSteps = [
        {
            icon: Upload,
            title: "Post the Found Item",
            description: "Log in and share details with clear photos of what you found.",
        },
        {
            icon: Shield,
            title: "Create Verification",
            description: "Set custom questions only the real owner can answer.",
        },
        {
            icon: Search,
            title: "Review Claims",
            description: "Check submissions from users claiming the item.",
        },
        {
            icon: CheckCircle,
            title: "Verify & Connect",
            description: "Share contact details only after correct verification.",
        },
    ];

    const lostSteps = [
        {
            icon: Upload,
            title: "Create Lost Post",
            description: "Log in and describe what you lost with photos if available.",
        },
        {
            icon: Search,
            title: "Browse & Search",
            description: "Look through found items or wait for matches.",
        },
        {
            icon: MessageCircle,
            title: "Answer Questions",
            description: "Prove ownership by answering verification questions.",
        },
        {
            icon: CheckCircle,
            title: "Recover Item",
            description: "Get contact details once verified and retrieve your item.",
        },
    ];

    const features = [
        {
            icon: Shield,
            title: "Secure Owner Verification",
            description: "Custom questions ensure items return to rightful owners only.",
            color: "primary",
        },
        {
            icon: Lock,
            title: "Controlled Information Sharing",
            description: "Personal details stay hidden until verification is complete.",
            color: "primary",
        },
        {
            icon: Users,
            title: "Wide Community Network",
            description: "Broadcast lost items across our community for faster reach.",
            color: "secondary",
        },
        {
            icon: LayoutDashboard,
            title: "Easy Posting & Tracking",
            description: "Intuitive dashboard to manage your lost and found activity.",
            color: "secondary",
        },
        {
            icon: Bell,
            title: "Real-time Notifications",
            description: "Get instant alerts when potential matches are found.",
            color: "primary",
        },
        {
            icon: AlertCircle,
            title: "Spam & Fake Claim Protection",
            description: "Advanced verification prevents fraudulent claims.",
            color: "secondary",
        },
    ];

    return (
        // Changed main to a generic wrapper so we can control width per section
        <div className="w-full flex flex-col items-center">

            {/* --- BLOCK 1: HERO TEXT (Constrained Width) --- */}
            <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 mt-10">
                <div className="flex flex-col items-center text-center gap-12">

                    {/* Badge */}
                    <div className="inline-block mb-4 px-6 py-3 bg-black rounded-full text-white font-semibold text-lg">
                        🎯 Smart Recovery Platform
                    </div>

                    {/* Heading */}
                    <h1 className="text-6xl md:text-8xl tracking-tight leading-[0.9] text-black">
                        Reuniting People<br /> With What Matters Most
                    </h1>

                    {/* Paragraphs */}
                    <div className="text-xl md:text-4xl text-muted-foreground max-w-4xl text-gray-500">
                        A smart, secure platform where found items meet their rightful owners.
                        Post, verify, and connect with confidence.
                    </div>
                    <div className="text-xl md:text-3xl text-muted-foreground max-w-2xl text-gray-500">
                        Lost something? Found something? You're in the right place.
                    </div>
                </div>
            </main>

            {/* --- BLOCK 2: STATS SECTION (Full Bleed) --- */}
            <section className="w-full bg-gray-500 py-16 mt-12">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button 
                            onClick={() => onNavigate('lost-item')}
                            className="min-w-[260px] flex items-center justify-center gap-4 px-8 py-5 bg-black text-white font-semibold text-lg rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
                        >
                            <Search className="w-6 h-6" /> Report Lost Item
                        </button>

                        <button 
                            onClick={() => onNavigate('found-item')}
                            className="min-w-[260px] flex items-center justify-center gap-4 px-8 py-5 bg-white text-black border border-gray-300 font-semibold text-lg rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300"
                        >
                            <MapPin className="w-6 h-6" /> Report Found Item
                        </button>

                        {/* Browse Items Button (fixed key: 'browse-items') */}
                        <button 
                            onClick={() => onNavigate('browse-items')}
                            className="min-w-[260px] flex items-center justify-center gap-4 px-8 py-5 bg-white text-black border border-gray-300 font-semibold text-lg rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300"
                        >
                            <List className="w-6 h-6" /> Browse Items
                        </button>
                    </div>

                    {/* Grid Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[{ number: "10K+", label: "Items Reunited" },{ number: "50K+", label: "Active Users" },{ number: "95%", label: "Success Rate" },{ number: "24/7", label: "Community Support" }].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-3">{stat.number}</div>
                                <div className="text-base md:text-lg text-gray-200">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- BLOCK 3: HOW IT WORKS --- */}
            <section className="w-full py-24 bg-brand-gray">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold text-black mb-6 tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-gray-500">
                            Simple steps for both finders and seekers
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">

                        <div>
                            <div className="mb-8 pl-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">
                                    For People Who FOUND an Item
                                </h3>
                                <p className="text-gray-500 text-lg">
                                    Stay safe. Stay anonymous until you're ready.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {foundSteps.map((step, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0">
                                            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center">
                                                <step.icon className="w-7 h-7 text-teal-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-teal-600 uppercase tracking-wider">
                                                Step {index + 1}
                                            </span>
                                            <h4 className="text-xl font-bold text-gray-900 mt-1 mb-2">
                                                {step.title}
                                            </h4>
                                            <p className="text-gray-500 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="mb-8 pl-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">
                                    For People Who LOST an Item
                                </h3>
                                <p className="text-gray-500 text-lg">
                                    Find what matters with secure verification.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {lostSteps.map((step, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0">
                                            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                                                <step.icon className="w-7 h-7 text-orange-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-orange-500 uppercase tracking-wider">
                                                Step {index + 1}
                                            </span>
                                            <h4 className="text-xl font-bold text-gray-900 mt-1 mb-2">
                                                {step.title}
                                            </h4>
                                            <p className="text-gray-500 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- BLOCK 4: FEATURES --- */}
            <section className="w-full py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
                            Why Choose TraceIt?
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Built with security, trust, and community at its core
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <div key={index} className="h-full p-8 rounded-2xl border border-gray-200 hover:border-black/50 hover:shadow-xl transition-all group bg-white">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                                    feature.color === 'primary' ? 'bg-black/5' : 'bg-orange-50'
                                }`}>
                                    <feature.icon className={`w-7 h-7 ${
                                        feature.color === 'primary' ? 'text-black' : 'text-orange-500'
                                    }`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-black">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <div className="max-w-3xl mx-auto p-10 rounded-3xl border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-orange-50/50">
                            <h3 className="text-2xl font-bold mb-4 text-black">
                                Our Mission
                            </h3>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                To create a trustworthy digital space where honesty meets technology, 
                                helping people recover lost belongings through community collaboration 
                                and smart verification.
                            </p>
                            <p className="text-xl font-semibold text-black">
                                Every item has a story. Let's bring it back.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BLOCK 5: CALL TO ACTION --- */}
            <section className="w-full py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            Don't Let Valuable Belongings Stay Lost Forever
                        </h2>
                        <p className="text-xl text-gray-400 mb-10">
                            Join our community today and help return lost items to where they belong.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <button className="min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold text-lg rounded-xl hover:bg-gray-100 hover:scale-105 transition-all">
                                Get Started <ArrowRight className="w-5 h-5" />
                            </button>
                            <button onClick={() => onNavigate('lost-item')} className="min-w-[200px] px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all">
                                Post a Lost Item
                            </button>
                            <button onClick={() => onNavigate('found-item')} className="min-w-[200px] px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all">
                                Post a Found Item
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🔐</div>
                                <h3 className="text-lg font-bold mb-2">Secure & Private</h3>
                                <p className="text-sm text-gray-400">
                                    Your information stays protected
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="text-lg font-bold mb-2">Fast Matching</h3>
                                <p className="text-sm text-gray-400">
                                    Smart algorithms find matches quickly
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4">🤝</div>
                                <h3 className="text-lg font-bold mb-2">Community Driven</h3>
                                <p className="text-sm text-gray-400">
                                    Powered by honest, helpful people
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- BLOCK 6: FOOTER --- */}
            <footer className="w-full bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-black mb-4">TraceIt</h3>
                            <p className="text-gray-500 text-sm">
                                Bringing Lost Items Back Home
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4 text-black">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">How It Works</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Safety Guidelines</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Contact Support</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-black">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Terms & Conditions</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-black">Connect</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Community Forum</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Success Stories</a></li>
                                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Help Center</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
                        <p>© 2025 TraceIt - Lost & Found Platform. All rights reserved.</p>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Home;
