import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { QUIZ_LESSONS } from '@/lib/curriculum'
import { QuizView } from './view'

export function generateStaticParams() {
  return QUIZ_LESSONS.map(l => ({ slug: l.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const lesson = QUIZ_LESSONS.find(l => l.slug === slug)
  if (!lesson) return {}

  return {
    title: `Lesson ${lesson.number} quiz: ${lesson.title}`,
    description: `Check what you learned in YBA Lesson ${lesson.number}, "${lesson.title}", with a short ${lesson.quiz.length}-question quiz.`,
    alternates: { canonical: `/curriculum/quizzes/${lesson.slug}` },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = QUIZ_LESSONS.find(l => l.slug === slug)
  if (!lesson) notFound()
  return <QuizView lesson={lesson} />
}
