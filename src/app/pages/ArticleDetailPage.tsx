'use client'
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, Phone } from 'lucide-react';
import { Article, ArticleSection, getArticleBySlug } from '../data/articles';
import { ServiceAreaFooter } from '../components/ServiceAreaFooter';

interface ArticleDetailPageProps {
  article: Article;
}

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

function renderSection(section: ArticleSection, index: number) {
  switch (section.type) {
    case 'h2':
      return (
        <h2
          key={index}
          className="text-2xl md:text-3xl tracking-wide uppercase mt-10 mb-4"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
        >
          {section.content as string}
        </h2>
      );
    case 'h3':
      return (
        <h3
          key={index}
          className="text-lg md:text-xl tracking-wide uppercase mt-7 mb-3"
          style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#334155' }}
        >
          {section.content as string}
        </h3>
      );
    case 'p':
      return (
        <p
          key={index}
          className="text-base md:text-lg leading-relaxed mb-5"
          style={{ fontFamily: 'Inter, sans-serif', color: '#334155' }}
        >
          {section.content as string}
        </p>
      );
    case 'ul':
      return (
        <ul key={index} className="mb-5 space-y-2 pl-1">
          {(section.content as string[]).map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-base md:text-lg leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif', color: '#334155' }}
            >
              <span
                className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#0EA5E9' }}
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'cta':
      return (
        <div
          key={index}
          className="my-10 rounded-2xl px-8 py-8 border-l-4"
          style={{ backgroundColor: '#F0F9FF', borderLeftColor: '#0EA5E9' }}
        >
          <p
            className="text-base md:text-lg leading-relaxed mb-5"
            style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
          >
            {section.content as string}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
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
            </a>
            <a
              href="tel:+19715100926"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-slate-100"
              style={{
                border: '1.5px solid #CBD5E1',
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '14px',
                color: '#0F172A',
              }}
            >
              <Phone className="w-4 h-4" />
              (971) 510-0926
            </a>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  const related = article.relatedLinks
    .map(link => getArticleBySlug(link.slug))
    .filter((a): a is Article => a !== undefined);

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <section
        className="px-6 md:px-12 lg:px-20 pt-32 pb-10 md:pt-40 md:pb-14"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        <div className="max-w-3xl mx-auto">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-sky-600 cursor-pointer"
            style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold"
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
            <span
              className="text-xs"
              style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8' }}
            >
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase leading-tight mb-6"
            style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
          >
            {article.title}
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}
          >
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* Article Body */}
      <article className="px-6 md:px-12 lg:px-20 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 pb-8 border-b border-slate-100 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#0EA5E9' }}
            >
              <span
                className="text-sm font-bold text-white"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                KL
              </span>
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
              >
                Kyra Lee
              </p>
              <p
                className="text-xs"
                style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}
              >
                Owner, Kyra Lee&apos;s Concrete Cleaning • Salem, OR
              </p>
            </div>
          </div>

          {article.content.map((section, i) => renderSection(section, i))}
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 py-10 md:py-14 border-t border-slate-100">
          <div className="max-w-3xl mx-auto">
            <p
              className="text-xs tracking-widest uppercase mb-6"
              style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#94A3B8' }}
            >
              More Articles
            </p>
            <div className="space-y-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/articles/${rel.slug}`}
                  className="group flex items-start gap-4 p-5 rounded-xl border border-slate-100 hover:border-sky-200 transition-all duration-200 hover:shadow-md cursor-pointer"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-xs mb-2 px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: `${categoryColors[rel.category] ?? '#0EA5E9'}18`,
                        color: categoryColors[rel.category] ?? '#0EA5E9',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {rel.category}
                    </span>
                    <h3
                      className="text-base md:text-lg tracking-wide uppercase leading-tight group-hover:text-sky-600 transition-colors duration-200"
                      style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, color: '#0F172A' }}
                    >
                      {rel.title}
                    </h3>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180 shrink-0 mt-1 text-slate-300 group-hover:text-sky-400 transition-colors" />
                </Link>
              ))}
            </div>

            <Link
              href="/articles"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition-colors hover:text-sky-700 cursor-pointer"
              style={{ fontFamily: 'Inter, sans-serif', color: '#0EA5E9' }}
            >
              View all articles
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </section>
      )}

      <ServiceAreaFooter />
    </div>
  );
}
