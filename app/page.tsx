import Link from 'next/link';
import Logo from './components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full viewport with gradient */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <Logo size={80} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 dark:text-white leading-tight">
            Failure Archive
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-semibold">
            Research-Grade Failure Knowledge Repository
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            A structured platform for documenting failed projects, research, and ideas. 
            Treat failures as invalidated assumptions, not personal shortcomings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/gallery"
              className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5 [&]:!text-white hover:!text-white"
            >
              Explore Gallery
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/submit"
              className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
            >
              Submit a Failure
            </Link>
            <Link
              href="/premortem"
              className="px-8 py-4 text-gray-700 dark:text-gray-300 font-semibold text-lg hover:text-blue-600 transition-colors"
            >
              Try Pre-Mortem Tool
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">Open</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">CC0 + MIT</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">6 Types</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Failure Records</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">AI-Powered</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-24 px-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Core Philosophy</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">What makes this different</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-xl hover:border-blue-600 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">NOT a Social Network</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No likes, comments, followers, trending pages, or engagement metrics. Pure knowledge sharing.
              </p>
            </div>
            
            <div className="group p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-xl hover:border-blue-600 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Structured Knowledge</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every submission follows a rigorous format: hypothesis, method, failure point, key misunderstanding.
              </p>
            </div>
            
            <div className="group p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-xl hover:border-blue-600 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🔓</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Open by Default</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All content shared under CC0 (text) and MIT (code). Knowledge accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Failure Types */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Failure Record Types</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Document different kinds of failures</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💻', title: 'Technical Project', desc: 'Failed implementations with repos, architecture, and invalidated assumptions.' },
              { icon: '📄', title: 'Research Paper', desc: 'Negative or null results that didn\'t warrant publication but offer insights.' },
              { icon: '💡', title: 'Research Idea', desc: 'Pre-mortem analysis of why an idea is unlikely to work today.' },
              { icon: '💼', title: 'Business Idea', desc: 'Failed market assumptions: size, behavior, distribution, cost, or timing.' },
              { icon: '🚀', title: 'Future Tech Idea', desc: 'Visions blocked by current technology limitations.' },
              { icon: '🤖', title: 'AI Project', desc: 'ML models that failed to generalize or scale as expected.' }
            ].map((type, i) => (
              <div key={i} className="card group cursor-pointer bg-white dark:bg-gray-900">
                <div className="text-3xl mb-3">{type.icon}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors text-gray-900 dark:text-white">{type.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Key Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Built for serious researchers and builders</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">
                🎭
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Anonymous Submission</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Submit anonymously, pseudonymously, or with delayed attribution (30/90/180 days).
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">
                ♻️
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Reuse System</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Mark failures as reused or avoided. Track how your failures help others.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">
                🔮
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Pre-Mortem Tool</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Input your idea and get related failures, common patterns, and risk assessment.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">
                🧠
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI Knowledge Extraction</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Automatic tagging, hypothesis normalization, and similar failure detection powered by Perplexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Start Contributing Today</h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
            Your failures are valuable. Share them to help others avoid the same mistakes.
          </p>
          <Link
            href="/submit"
            className="inline-block px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-blue-700 hover:shadow-2xl hover:scale-105 transition-all duration-200 [&]:!text-white hover:!text-white"
          >
            Submit Your First Failure
          </Link>
        </div>
      </section>
    </div>
  );
}

