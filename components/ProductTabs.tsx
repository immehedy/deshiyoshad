'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n/provider';

type ProductTabsProps = {
  description: string;
  benefits: string[];
  ingredients: string[];
  nutrition: {
    label: string;
    value: string;
  }[];
  productName: string;
};

export function ProductTabs({
  description,
  benefits,
  ingredients,
  nutrition,
  productName,
}: ProductTabsProps) {
  const { dict } = useI18n();
  const t = dict.product;

  const [tab, setTab] = useState<'description' | 'reviews'>('description');

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
      <div className="flex border-b border-soil/10">
        <button
          onClick={() => setTab('description')}
          className={`border-r border-soil/10 px-6 py-4 text-sm font-black ${
            tab === 'description' ? 'text-leaf' : 'text-soil/50'
          }`}
        >
          {t.description}
        </button>

        <button
          onClick={() => setTab('reviews')}
          className={`px-6 py-4 text-sm font-black ${
            tab === 'reviews' ? 'text-leaf' : 'text-soil/50'
          }`}
        >
          {t.reviews}
        </button>
      </div>

      <div className="p-6 md:p-8">
        {tab === 'description' ? (
          <>
            <p className="max-w-5xl text-base leading-9 text-soil/70">
              {description}
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-black text-soil">
                  {t.benefitsTitle.replace('{name}', productName)}
                </h2>

                <ol className="mt-5 space-y-3 text-soil/70">
                  {benefits.map((benefit, index) => (
                    <li key={benefit}>
                      {index + 1}. {benefit}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-black text-soil">{t.ingredients}</h2>

                <ul className="mt-5 space-y-3 text-soil/70">
                  {ingredients.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-black text-soil">{t.nutritionInfo}</h2>

              <div className="mt-5 max-w-xl divide-y divide-leaf/10 rounded-xl border border-leaf/10">
                {nutrition.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between px-5 py-4 text-soil/70"
                  >
                    <span>{row.label}</span>
                    <strong className="text-soil">{row.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {t.reviewList.map((review, index) => (
              <div
                key={review}
                className="rounded-2xl border border-soil/10 p-5"
              >
                <div className="flex gap-1 text-turmeric">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={15} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-soil/65">{review}</p>

                <h4 className="mt-4 font-black text-soil">
                  {t.customer} {index + 1}
                </h4>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
