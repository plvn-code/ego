import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { infoPages } from "@/lib/content/info";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return infoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = infoPages.find((p) => p.slug === slug);
  return page ? { title: page.title, description: page.description } : {};
}

export default async function InfoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = infoPages.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <div className="container">
      <div className="page-hero">
        <nav aria-label="Хлібні крихти">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li aria-current="page">{page.title}</li>
          </ol>
        </nav>
        <h1 className="page-title">{page.title}</h1>
      </div>
      <div className="info-layout">
        <nav className="info-nav" aria-label="Інформація">
          {infoPages.map((p) => (
            <Link key={p.slug} href={`/info/${p.slug}`} aria-current={p.slug === slug ? "page" : undefined}>
              {p.title}
            </Link>
          ))}
        </nav>
        <article className="prose">{page.body}</article>
      </div>
    </div>
  );
}
