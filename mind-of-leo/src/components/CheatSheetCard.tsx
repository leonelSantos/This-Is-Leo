import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from './ui/Card';

interface Cheatsheet {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

interface CheatSheetCardProps {
  cheatsheet: Cheatsheet;
  className?: string;
}

export default function CheatSheetCard({ cheatsheet, className = '' }: CheatSheetCardProps) {
  return (
    <Link href={`/cheatsheets/${cheatsheet.slug}`} className="block h-full">
      <Card 
        variant="elevated" 
        isHoverable 
        isClickable
        className={`h-full transition-all hover:translate-y-[-2px] ${className}`}
      >
        <div className="flex items-start">
          <div className="mr-4 h-12 w-12 relative flex-shrink-0">
            {cheatsheet.icon ? (
              <div className="relative h-12 w-12">
                <Image
                  src={`/images/${cheatsheet.icon}`}
                  alt={`${cheatsheet.title} icon`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-bold text-xl">
                {cheatsheet.title.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <Card.Title className="mb-1 group-hover:text-blue-600 transition-colors">
              {cheatsheet.title}
            </Card.Title>
            <Card.Description>
              {cheatsheet.description}
            </Card.Description>
          </div>
        </div>
      </Card>
    </Link>
  );
}