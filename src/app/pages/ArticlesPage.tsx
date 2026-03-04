'use client'
import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { articles } from '../data/articles';
import { ServiceAreaFooter } from '../components/ServiceAreaFooter';

const categoryColors: Record<string, string> = {
  'Maintenance Tips': '#0EA5E9',
  'How-To Guides': '#22C55E',
  'Stain Removal': '#F59E0B',
  'Local Salem Tips': '#8B5CF6',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function ArticlesPage() {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const [featured, ...rest] = sorted;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section
        className="px-6 md:px-12 lg:px-20 pt-32 pb-12 md:pt-40 md:pb-16"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#0EA5E9' }}
          >
            Salem, Oregon • Cleaning Tips &amp; Guides
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-tight mb-4"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            ARTICLES &amp; GUIDES
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            Expert advice on pressure washing, concrete maintenance, and keeping your Salem-area
            home in top shape year-round.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="px-6 md:px-12 lg:px-20 py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs tracking-widest uppercase mb-6"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#94A3B8' }}
          >
            Featured Article
          </p>
          <Link
            href={`/articles/${featured.slug}`}
            className="group block rounded-2xl overflow-hidden border border-slate-100 hover:border-sky-200 transition-all duration-300 hover:shadow-xl cursor-pointer"
            style={{ backgroundColor: '#F8FAFC' }}
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${categoryColors[featured.category] ?? '#0EA5E9'}18`,
                    color: categoryColors[featured.category] ?? '#0EA5E9',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <Tag className="w-3 h-3" />
                  {featured.category}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-xs"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
                >
                  <Clock className="w-3 h-3" />
                  {featured.readingTime}
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
                >
                  {formatDate(featured.publishedAt)}
                </span>
              </div>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-tight mb-4 group-hover:text-sky-600 transition-colors duration-200"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
              >
                {featured.title}
              </h2>
              <p
                className="text-base md:text-lg leading-relaxed mb-6 max-w-3xl"
                style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}
              >
                {featured.excerpt}
              </p>
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-200"
                style={{ fontFamily: 'Inter, sans-serif', color: '#0EA5E9' }}
              >
                Read Article
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Article Grid */}
      <section className="px-6 md:px-12 lg:px-20 pb-16">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs tracking-widest uppercase mb-6"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#94A3B8' }}
          >
            All Articles
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group block rounded-xl overflow-hidden border border-slate-100 hover:border-sky-200 transition-all duration-300 hover:shadow-lg cursor-pointer p-6"
                style={{ backgroundColor: '#F8FAFC' }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: `${categoryColors[article.category] ?? '#0EA5E9'}18`,
                      color: categoryColors[article.category] ?? '#0EA5E9',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <Tag className="w-3 h-3" />
                    {article.category}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs"
                    style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
                  >
                    <Clock className="w-3 h-3" />
                    {article.readingTime}
                  </span>
                </div>
                <h3
                  className="text-lg md:text-xl tracking-wide uppercase leading-tight mb-3 group-hover:text-sky-600 transition-colors duration-200"
                  style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
                >
                  {article.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
                >
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
                  >
                    {formatDate(article.publishedAt)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all duration-200"
                    style={{ fontFamily: 'Inter, sans-serif', color: '#0EA5E9' }}
                  >
                    Read
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl px-8 md:px-12 py-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{ backgroundColor: '#0F172A' }}
          >
            <div>
              <h2
                className="text-2xl md:text-3xl tracking-wide uppercase mb-2"
                style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: 'white' }}
              >
                Ready to Get Started?
              </h2>
              <p
                className="text-sm md:text-base"
                style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
              >
                Kyra offers free on-site quotes — she comes to you, takes a look, and gives you a real price before she leaves.
              </p>
            </div>
            <a
              href="/#contact"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: '#0EA5E9',
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '14px',
              }}
            >
              Get Free Quote
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <ServiceAreaFooter />
    </div>
  );
}
