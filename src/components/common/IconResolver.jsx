import React from 'react'
import * as Icons from 'lucide-react'

export function IconResolver({ name, className = 'w-5 h-5' }) {
  const IconComponent = Icons[name] || Icons.Wrench
  return <IconComponent className={className} />
}
